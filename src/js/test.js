let aquarium = document.querySelector(".floater-wrapper")

let floaterCount = 0

let floaterInterval = 4000

let leftSide = true

let zLevels = 1000
let zFocus = 100
let speed = 16

const createFloater = (advanceInTime = 0) => {
	console.log(floaterCount)

	let zFloat = Math.random() * zLevels
	let zIndex = Math.round(zFloat)

	let size = 128
	let scale = 2 + Math.random() * 1
	if (zFloat < zLevels / 20) {
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

	size *= scale
	leftSide = !leftSide

	let xStart = leftSide ? -size * 2 : aquarium.offsetWidth + size
	let xEnd = !leftSide ? -size * 2 : aquarium.offsetWidth + size
	let yStart = Math.random() * (aquarium.offsetHeight * 2) - aquarium.offsetHeight / 2 - size / 2
	let maxYDiff = aquarium.offsetWidth * 2
	let yEnd = yStart + (maxYDiff - Math.random() * (maxYDiff * 2))

	let xDist = Math.abs(xStart - xEnd)
	let yDist = Math.abs(yStart - yEnd)

	let dist = Math.sqrt(xDist * xDist + yDist * yDist)
	let timeToLive = dist / speed * (1 + zFloat / zLevels)

	if (
		(yStart > aquarium.offsetHeight && yEnd > aquarium.offsetHeight) ||
		(yStart < -size && yEnd < -size)
	) return

	if (advanceInTime) {
		xStart += (xEnd - xStart) * (advanceInTime / timeToLive)
		yStart += (yEnd - yStart) * (advanceInTime / timeToLive)
		timeToLive -= advanceInTime
		if (timeToLive <= 0) {
			return
		}
	}

	let floater = document.createElement("div")
	floater.classList.add("floater")
	floater.style.zIndex = floater.style.zIndex || zLevels - zIndex
	floater.style.width = `${size}px`
	floater.style.height = `${size}px`
	floater.style.background = floater.style.background || "#ccc"
	floater.style.filter = `blur(${1 + Math.abs(zIndex - zFocus) / 50}px) brightness(${1 - zFloat / zLevels / 2})`
	floater.style.transform = `translateX(${xStart}px) translateY(${yStart}px)`
	floater.style.transition = `all ${timeToLive}s linear`
	aquarium.appendChild(floater)

	setTimeout(() => {
		floater.style.transform = `translateX(${xEnd}px) translateY(${yEnd}px)`
	}, 250)

	floaterCount++

	setTimeout(
		floater => {
			floater.remove()
			floaterCount--
		},
		timeToLive * 1000,
		floater
	)
}

for (let i = 0; i < 300; i++) {
	createFloater(floaterInterval / 1000 * i)
}

document.addEventListener(
	"visibilitychange",
	event => {
		if (event.target.visibilityState == "visible") {
			for (let floater of document.querySelectorAll(".floater")) {
				floater.remove()
			}
			floaterCount = 0
			for (let i = 0; i < 300; i++) {
				createFloater(floaterInterval / 1000 * i)
			}
		}
	},
	false
)

setInterval(createFloater, floaterInterval)