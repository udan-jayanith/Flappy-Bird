const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let gameLoadingStates = []
// Scroll to 500px horizontally
window.scrollTo({left: 0, behavior: 'smooth'})

/*
// Get the HTML element you want to make full screen
let element = document.documentElement; // This selects the entire page

// Function to request full screen
function makeFullScreen() {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

// Call the function
makeFullScreen();
*/

// #region Background
class Background {
	constructor() {
		this.img = new Image()
		this.img.src = '../images/background.png'

		// Wait until the image is loaded
		this.img.onload = () => {
			this.imgWidth = this.img.naturalWidth
			this.imgHeight = this.img.naturalHeight

			canvas.width = this.imgWidth * 2
			canvas.height = this.imgHeight

			this.dx = []
			for (let i = 0; i < 4; i++) {
				this.dx.push(this.imgWidth * i)
			}
			gameLoadingStates.push('Loading Background....')
		}
	}

	draw(gameSpeed) {
		for (let i = 0; i < this.dx.length; i++) {
			ctx.drawImage(
				this.img,
				0,
				0,
				this.imgWidth,
				this.imgHeight,
				this.dx[i],
				0,
				this.imgWidth,
				this.imgHeight - 120
			)

			this.dx[i] -= gameSpeed
			if (this.dx[i] < -this.imgWidth) this.dx[i] = this.imgWidth * 3
		}
	}
}
// #endregion

// #region Ground
class Ground {
	constructor() {
		this.img = new Image()
		this.img.src = '../images/ground.png'

		// Wait until the image is loaded
		this.img.onload = () => {
			this.imgWidth = this.img.naturalWidth
			this.imgHeight = this.img.naturalHeight

			this.dx = []
			for (let i = 0; i < 2; i++) {
				this.dx.push(this.imgWidth * i)
			}
			gameLoadingStates.push('Loading Ground....')
		}
	}

	draw(gameSpeed) {
		for (let i = 0; i < this.dx.length; i++) {
			ctx.drawImage(
				this.img,
				0,
				0,
				this.imgWidth,
				this.imgHeight,
				this.dx[i],
				canvas.height - this.imgHeight,
				this.imgWidth,
				this.imgHeight
			)

			this.dx[i] -= gameSpeed / 1.09
			if (this.dx[i] < -this.imgWidth) this.dx[i] = this.imgWidth
		}
	}

	collisionDetection() {
		return
	}
}
// #endregion

// #region Pipes
class Pipes {
	constructor() {
		this.imgUpward = new Image()
		this.imgUpward.src = '../images/upward-Pipe.png'

		this.imgDownward = new Image()
		this.imgDownward.src = '../images/downward-Pipe.png'

		// Wait until the image is loaded
		this.imgUpward.onload = () => {
			this.imgWidth = this.imgUpward.naturalWidth
			this.imgHeight = this.imgUpward.naturalHeight

			this.properties = []
			for (let i = 0; i < 4; i++) {
				this.properties.push({
					dx: canvas.width + (this.imgWidth + canvas.width / 4) * i,
					randomNumber: Math.floor(Math.random() * 401) - 200,
				})
			}

			gameLoadingStates.push('Loading Pipes....')
		}

		this.imgDownward.onload = () => {
			gameLoadingStates.push('Loading Pipes....')
		}

		this.a = canvas.height + 346
	}

	draw(gameSpeed) {
		for (let i = 0; i < this.properties.length; i++) {
			// lowest +200 medium 0 highest -200
			ctx.drawImage(
				this.imgDownward,
				0,
				0,
				this.imgWidth,
				this.imgHeight,
				this.properties[i].dx,
				-this.a - this.properties[i].randomNumber,
				this.imgWidth,
				this.imgHeight
			)

			ctx.drawImage(
				this.imgUpward,
				0,
				0,
				this.imgWidth,
				this.imgHeight,
				this.properties[i].dx,
				this.a - this.properties[i].randomNumber,
				this.imgWidth,
				this.imgHeight
			)

			this.properties[i].dx -= gameSpeed / 1.1
			if (this.properties[i].dx < -this.imgWidth) {
				this.properties[i].dx =
					canvas.width + (this.imgWidth + canvas.width / 4)
				this.properties[i].randomNumber = Math.floor(Math.random() * 401) - 200
			}
		}
	}

	collisionDetection() {
		return
	}
}
// #endregion

// #region settings
class Settings {
	constructor() {
		this.FPS = 60
		this.IntervalTimeout = 1000 / this.FPS
		this.gameSpeed = 0.0875
		this.IntervalGameSpeed = this.gameSpeed * this.IntervalTimeout
	}

	setFPS(FPS) {
		this.FPS = FPS
	}

	setGameSpeed(gameSpeed) {
		this.gameSpeed = gameSpeed / 100
		this.IntervalGameSpeed = this.gameSpeed * this.IntervalTimeout
	}

	getFPS() {
		return this.FPS
	}

	getGameSpeed() {
		return this.IntervalGameSpeed
	}

	getIntervalTimeout() {
		return this.IntervalTimeout
	}
}
// #endregion

// #region Current game FPS
class CurrentGameFPS {
	constructor() {
		this.lastTime = performance.now()
		this.fps = 0
	}

	display() {
		const currentTime = performance.now()
		const deltaTime = currentTime - this.lastTime
		this.fps = Math.round(1000 / deltaTime) // Calculate FPS
		this.lastTime = currentTime

		// Log FPS
		console.log(`FPS: ${this.fps}`)
	}
}
// #endregion

const background = new Background()
const ground = new Ground()
const pipes = new Pipes()

const settings = new Settings()
settings.setFPS(90)
settings.setGameSpeed(20)
//const currentGameFPS = new CurrentGameFPS()

function draw() {
	ctx.clearRect(-canvas.width, 0, canvas.width * 3, canvas.height)
	background.draw(settings.getGameSpeed())
	pipes.draw(settings.getGameSpeed())
	ground.draw(settings.getGameSpeed())

	//currentGameFPS.display()
}

setInterval(() => {
	if (gameLoadingStates.length >= 2) draw()
	else console.log(gameLoadingStates)
}, settings.getIntervalTimeout())
