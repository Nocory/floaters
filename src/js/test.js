import "css/main.scss"

//const anime = require("animejs")


const config = {
	floaterInterval: 4000,
	zLevels: 1000,
	zFocus: 250,
	size: 256,
	speed: 16
}

let aquarium = document.querySelector(".floater-wrapper")
let leftSide = true
let allFloaters = []

const moveFloaters = () => {
	let now = performance.now()
	for (let floater of allFloaters) {
		let progress = (now - floater.created) / floater.timeToLive
		let xDiff = (floater.xEnd - floater.xStart) * progress
		let yDiff = (floater.yEnd - floater.yStart) * progress
		//console.log(floater)
		floater.el.style.transform = `translate(${xDiff}px,${yDiff}px)`
		//floater.style.transform = `translateX(${444}px) translateY(${444}px)`
	}

	window.requestAnimationFrame(moveFloaters)
}
//window.requestAnimationFrame(moveFloaters)

const createFloater = (advanceInTime = 0) => {
	let zFloat = Math.random() * config.zLevels
	let zIndex = Math.round(zFloat)
	//let timeToLive = 30 + zIndex / 5

	let scale = 1 + Math.random() * 0.5

	scale *= 1 + (1 - zFloat / config.zLevels)

	//console.log(zFocus, zFloat)
	if (zFloat < config.zLevels / 20) {
		scale *= 1 + Math.random() * 1
	}
	/*
	if (zFloat > zLevels * 0.8 && Math.random() > 0.9) {
		scale += 2 * Math.random() * 1
		console.log("LARGE")
		floater.style.background = "tomato"
		floater.style.zIndex = -zIndex
	}
	*/
	let size = Math.round(config.size * scale)
	//let size = config.size
	leftSide = !leftSide

	let xStart = leftSide ? -size * 1.2 : aquarium.clientWidth + size * 0.2
	let xEnd = !leftSide ? -size * 1.2 : aquarium.clientWidth + size * 0.2
	let yStart = Math.random() * (aquarium.offsetHeight * 2) - (aquarium.offsetHeight / 2) - (size / 2)
	let maxYDiff = aquarium.clientWidth / 2
	let yEnd = yStart + (maxYDiff - (Math.random() * (maxYDiff * 2)))

	let xDist = Math.abs(xStart - xEnd)
	let yDist = Math.abs(yStart - yEnd)

	let dist = Math.sqrt(xDist * xDist + yDist * yDist)
	let timeToLive = (dist / config.speed) * (1 + (zFloat / config.zLevels))

	if (
		yStart > aquarium.offsetHeight && yEnd > aquarium.offsetHeight ||
		yStart < -size && yEnd < -size
	) return

	if (advanceInTime) {
		xStart += (xEnd - xStart) * (advanceInTime / timeToLive)
		yStart += (yEnd - yStart) * (advanceInTime / timeToLive)
		timeToLive -= advanceInTime
		if (timeToLive < 0) return
	}

	let floater = document.createElement("div")
	floater.classList.add("floater")
	floater.style.zIndex = floater.style.zIndex || config.zLevels - zIndex
	floater.style.width = `${size}px`
	floater.style.height = `${size}px`
	floater.style.background = floater.style.background || "#ccc"
	floater.style.filter = `blur(${2 + Math.round(Math.abs(zIndex - config.zFocus) / 50)}px) brightness(${1 - (zFloat / config.zLevels) / 2})`
	floater.style.transformOrigin = "center"
	floater.style.transform = `translateX(${xStart}px) translateY(${yStart}px)`
	//floater.style.transition = `all ${timeToLive}s linear`

	aquarium.appendChild(floater)

	const animation = floater.animate([
		{ transform: `translateX(${xStart}px) translateY(${yStart}px)` },
		{ transform: `translateX(${xEnd}px) translateY(${yEnd}px)` }
	], {
		duration: timeToLive * 1000
	})

	animation.onfinish = () => {
		floater.remove()
	}


	/*
	let now = performance.now()
	allFloaters.push({
		el: floater,
		xStart,
		yStart,
		xEnd,
		yEnd,
		timeToLive: timeToLive * 1000,
		created: now,
		die: now + timeToLive * 1000
	})
	*/

	/*
		anime({
			targets: floater,
			translateX: xEnd,
			translateY: yEnd,
			duration: timeToLive
		})
		*/
	/*
	setTimeout(() => {
		floater.style.transform = `translate(${xEnd}px, ${yEnd}px)`
	}, 250)
	*/

	floater.addEventListener("transitionend", function() {
		floater.remove()
	}, false)
}

setInterval(() => {
	document.getElementById("floater-num").innerText = document.getElementsByClassName("floater").length + " divs"
}, 1005)

const initFloaters = () => {
	console.log("INIT")
	config.size = window.screen.width * 0.05 + window.screen.height * 0.05
	for (let floater of document.querySelectorAll(".floater")) {
		floater.remove()
	}
	for (let i = 0; i < 300; i++) {
		createFloater((config.floaterInterval / 1000) * i)
	}
}

document.addEventListener("visibilitychange", (event) => {
	if (event.target.visibilityState == "visible") {
		initFloaters()
	}
}, false)

let resizeTimeout = null
window.addEventListener("resize", (event) => {
	clearTimeout(resizeTimeout)
	resizeTimeout = setTimeout(initFloaters, 333)
}, false)

initFloaters()
setInterval(createFloater, config.floaterInterval)