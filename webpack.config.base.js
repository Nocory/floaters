const webpack = require("webpack")

const path = require('path')
//const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
//const CopyWebpackPlugin = require("copy-webpack-plugin")
const HappyPack = require("happypack")
const happyThreadPool = HappyPack.ThreadPool({ size: 4 })

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ExtractNormal = new ExtractTextPlugin({
	filename: "[name]_[contenthash:8].css",
	disable: false,
	allChunks: true
})
const ExtractCritical = new ExtractTextPlugin({
	filename: "[name]_[contenthash:8]_critical.css",
	disable: false,
	allChunks: true
})

module.exports = {
	entry: {
		app: 'js/main.js'
	},
	output: {
		filename: '[name]_[chunkhash:8].js',
		path: path.resolve(__dirname, 'build')
	},
	module: {
		rules: [{
			test: /critical\.(css|sass|scss)$/,
			use: ExtractCritical.extract({
				fallback: 'style-loader',
				use: 'happypack/loader?id=scss',
				allChunks: true
			})
		},
		{
			test: /^((?!critical).)*\.(css|sass|scss)$/,
			use: ExtractNormal.extract({
				fallback: 'style-loader',
				use: 'happypack/loader?id=scss',
				allChunks: true
			})
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			use: [{
				//loader: 'babel-loader'
				loader: "happypack/loader?id=js"
			}]
		},
		{
			test: /\.(ttf|eot|woff|woff2|svg)$/,
			loader: "url-loader?limit=10240&name=fonts/[name]_[hash:8].[ext]"
		},
		{
			test: /critical\.(png|jpg|jpeg|gif)$/,
			loader: "url-loader?limit=512000&name=img/[name]_[hash:8].[ext]"
		},
		{
			test: /^((?!critical).)*\.(png|jpg|jpeg|gif)$/,
			loader: "url-loader?limit=10240&name=img/[name]_[hash:8].[ext]"
		},
		]
	},
	resolve: {
		alias: {
			//"vue$": 'vue/dist/vue.esm.js',
			//"vue-router$": 'vue-router/dist/vue-router.esm.js'
		},
		modules: [
			path.resolve(__dirname, 'src'),
			path.resolve(__dirname, 'node_modules')
		]
	},
	plugins: [
		new HappyPack({
			id: "scss",
			threadPool: happyThreadPool,
			loaders: ['css-loader', 'sass-loader']
		}),
		new HappyPack({
			id: "js",
			threadPool: happyThreadPool,
			loaders: [{
				loader: "babel-loader",
				options: {
					cacheDirectory: true
				}
			}]
		}),

		new webpack.optimize.ModuleConcatenationPlugin(),
		new CleanWebpackPlugin(['build'], {
			root: __dirname,
			verbose: false,
			dry: false,
			watch: false
		}),

		new webpack.EnvironmentPlugin(['NODE_ENV']),

		new webpack.optimize.CommonsChunkPlugin({
			minChunks: 2,
			children: true,
			async: true
		}),

		new HtmlWebpackPlugin({
			inlineSource: '.(js|css)$',
			//inlineSource: 'critical\.css$',
			template: 'src/index.html'
		}),
		new HtmlWebpackInlineSourcePlugin(),
		//new CopyWebpackPlugin([{ from: 'src/assets/directCopy/*', to: 'directCopy/[name].[ext]' }]),
		ExtractCritical,
		ExtractNormal
		/*
		new ExtractTextPlugin({
			filename: "[name]_[contenthash:8].css",
			disable: false,
			allChunks: true
		})
		*/
	]
}