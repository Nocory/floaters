import "css/main.scss"

let aquarium = document.querySelector(".floater-wrapper")

const createFloater = () => {
	let floater = document.createElement("div")
	floater.classList.add("floater")

	let zFocus = 10

	let zFloat = Math.random() * 20
	let zIndex = Math.round(zFloat)

	let timeToLive = 20 + Math.random() * 20

	let scale = 0.5 + Math.random() * 0.5 + (20 - Math.random() * zFloat) / 20

	let size = (aquarium.offsetWidth + aquarium.offsetHeight) * 0.05

	let xCoord = Math.random() > 0.5 ? -size : aquarium.offsetWidth
	let yCoord = Math.random() * aquarium.offsetHeight

	floater.innerText = `${scale.toFixed(2)}_${zIndex}`
	floater.style.zIndex = zIndex
	floater.style.width = `${size}px`
	floater.style.height = `${size}px`
	floater.style.background = "#ccc"
	floater.style.border = "2px solid #aaa"
	floater.style.filter = `blur(${1 + Math.abs(zIndex - zFocus) / 4}px)`
	floater.style.transform = `translate(${xCoord}px, ${Math.random() * aquarium.offsetHeight}px) scale(${scale}) `
	floater.style.transition = `all ${timeToLive}s linear, opacity 3s linear`

	console.log(floater.style.transform)

	aquarium.appendChild(floater)

	floater.style.transform = `translate(${aquarium.offsetWidth + size - xCoord}px, ${Math.random() * aquarium.offsetHeight}px) scale(${scale})`
	floater.style.opacity = 0.8 + Math.random() * 0.2

	setTimeout((floater) => {
		floater.remove()
	}, timeToLive * 1000 - 3500, floater)
}

for (let i = 0; i < 10; i++) {
	createFloater()
}

setInterval(createFloater, 2000)

console.log("NODE_ENV is: ", process.env.NODE_ENV)
console.log("DEBUG is: ", process.env.DEBUG)