import "css/main.scss"

let aquarium = document.querySelector(".floater-wrapper")

let leftSide = true

let zLevels = 1000
let zFocus = 100
let avgTTL = 30 + zLevels / 5

const createFloater = (advanceInTime = 0) => {
	let zFloat = Math.random() * zLevels
	let zIndex = Math.round(zFloat)
	let timeToLive = 30 + zIndex / 5

	let size = 128
	let scale = 2 + Math.random() * 1
	if (zFloat < zFocus) {
		scale += (zFocus - zFloat) / 20
	}
	/*
	if (zFloat > zLevels * 0.8 && Math.random() > 0.9) {
		scale += 2 * Math.random() * 1
		console.log("LARGE")
		floater.style.background = "tomato"
		floater.style.zIndex = -zIndex
	}
	*/
	size *= scale
	leftSide = !leftSide

	let xStart = leftSide ? -size * 2 : aquarium.offsetWidth + size
	let xEnd = !leftSide ? -size * 2 : aquarium.offsetWidth + size
	let yStart = Math.random() * (aquarium.offsetHeight + size) - size
	let yEnd = yStart + (size * 2 - (Math.random() * (size * 4)))

	if (advanceInTime) {
		xStart += xEnd - xStart * (advanceInTime / timeToLive)
		yStart += yEnd - yStart * (advanceInTime / timeToLive)
		timeToLive -= advanceInTime
	}

	if (timeToLive <= 1) return
	console.log("creating:", xStart, yStart, timeToLive)

	let floater = document.createElement("div")
	floater.classList.add("floater")
	floater.style.zIndex = floater.style.zIndex || zLevels - zIndex
	floater.style.width = `${size}px`
	floater.style.height = `${size}px`
	floater.style.background = floater.style.background || "#ccc"
	floater.style.border = "2px solid #aaa"
	floater.style.filter = `blur(${1 + Math.abs(zIndex - zFocus) / 100}px) brightness(${1 - (zFloat / zLevels) / 2})`
	//floater.style.filter = `blur(${zIndex / 2}px)`
	//floater.style.transform = `translate(${xStart}px, ${yStart}px) scale(${scale})`
	floater.style.transform = `translate(${xStart}px, ${yStart}px)`
	floater.style.transition = `all ${timeToLive}s linear`

	//console.log(floater.style.transform)

	aquarium.appendChild(floater)
	setTimeout(() => {
		floater.style.transform = `translate(${xEnd}px, ${yEnd}px)`
	}, 250)


	//floater.style.opacity = 0.8 + Math.random() * 0.2

	setTimeout((floater) => {
		floater.remove()
	}, timeToLive * 1000, floater)
}



for (let i = 0; i < avgTTL / (8000 / 1000); i++) {
	createFloater(8 * i)
}

setInterval(createFloater, 8000)

console.log("NODE_ENV is: ", process.env.NODE_ENV)
console.log("DEBUG is: ", process.env.DEBUG)