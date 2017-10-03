const npmEvent = process.env.npm_lifecycle_event
const merge = require('webpack-merge')
const path = require('path')

let mergeConfig = require(`./webpack.config.build.js`)

const webpack = require("webpack")

const PurifyCSSPlugin = require('purifycss-webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const glob = require('glob')

module.exports = merge({}, {
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		host: "0.0.0.0",
		port: 4444,
		overlay: true
	},
	plugins: [
		new PurifyCSSPlugin({
			styleExtensions: [".css", ".sass", ".scss"],
			paths: glob.sync(path.join(__dirname, '/src/{*.html,components/*.vue,js/**/*.vue}')),
			//paths: glob.sync(path.join(__dirname, '/build/*.js')),
			verbose: true,
			purifyOptions: {
				whitelist: ["*:not*"] //
			}
		}),
		new OptimizeCssAssetsPlugin()
	]
})