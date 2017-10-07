import "css/main.scss"

let aquarium = document.querySelector(".aquarium")

const config = {
	floaterInterval: 3500,
	zLevels: 6,
	size: 256,
	speed: 16
}

let leftSide = true
const createFloater = (advanceInTime = 0) => {
	leftSide = !leftSide
	let zFloat = Math.random() * config.zLevels

	let scale = 1 + Math.random() * 0.25
	scale *= 1 + (1 - zFloat / config.zLevels)
	if (zFloat < 2) {
		scale *= 1 + Math.random() * 0.5
	}
	let size = Math.round(config.size * scale)
	let xStart = leftSide ? -size * 1.2 : aquarium.clientWidth + size * 0.2
	let xEnd = !leftSide ? -size * 1.2 : aquarium.clientWidth + size * 0.2
	let yStart = Math.random() * (aquarium.offsetHeight * 2) - (aquarium.offsetHeight / 2) - (size / 2)
	let maxYDiff = aquarium.clientWidth / 2
	let yEnd = yStart + (maxYDiff - (Math.random() * (maxYDiff * 2)))

	if (
		yStart > aquarium.offsetHeight && yEnd > aquarium.offsetHeight ||
		yStart < -size && yEnd < -size
	) return

	let xDist = Math.abs(xStart - xEnd)
	let yDist = Math.abs(yStart - yEnd)
	let dist = Math.sqrt(xDist * xDist + yDist * yDist)
	let timeToLive = (dist / config.speed) * (1 + (zFloat / config.zLevels))

	if (advanceInTime) {
		xStart += (xEnd - xStart) * (advanceInTime / timeToLive)
		yStart += (yEnd - yStart) * (advanceInTime / timeToLive)
		timeToLive -= advanceInTime
		if (timeToLive < 0) return
	}

	let floater = document.createElement("div")
	floater.classList.add("floater")
	floater.style.width = `${size}px`
	floater.style.height = `${size}px`
	floater.style.transform = `translateX(${xStart}px) translateY(${yStart}px)`
	floater.style.transition = `transform ${timeToLive}s linear`

	floater.style.background = `rgba(${Math.floor(128 + Math.random() * 128)},${Math.floor(128 + Math.random() * 128)},${Math.floor(128 + Math.random() * 128)},0.5)`

	//aquarium.appendChild(floaterWrapper)
	document.getElementById("z" + ((config.zLevels - 1) - Math.floor(zFloat))).appendChild(floater)

	setTimeout(() => {
		floater.style.transform = `translate(${xEnd}px, ${yEnd}px)`
	}, 250)

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