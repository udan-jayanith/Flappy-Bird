// #region Background
class Background {
	constructor() {
		this.img = new Image()
		this.img.src = '../images/background.png'
		this.overlay = document.querySelector('.overlay')

		// Wait until the image is loaded
		this.img.onload = () => {
			this.imgWidth = this.img.naturalWidth
			this.imgHeight = this.img.naturalHeight

			canvas.width = this.imgWidth * 2
			canvas.height = this.imgHeight
			this.overlay.style.width = getComputedStyle(canvas).width

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
			this.dy = canvas.height - this.imgHeight
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
				this.dy,
				this.imgWidth,
				this.imgHeight
			)

			this.dx[i] -= gameSpeed / 1.09
			if (this.dx[i] < -this.imgWidth) this.dx[i] = this.imgWidth
		}
	}

	collisionDetection(dy, birdHeight) {
		if (dy + birdHeight > this.dy) {
			playAudio('../sounds/die.ogg')
			return true
		}
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
					randomNumber: Math.floor(Math.random() * 401) - 186,
				})
			}

			gameLoadingStates.push('Loading Pipes....')
		}

		this.imgDownward.onload = () => {
			gameLoadingStates.push('Loading Pipes....')
		}

		this.a = canvas.height - 372
		this.scoringSystem = new ScoringSystem()
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
				this.properties[i].randomNumber = Math.floor(Math.random() * 401) - 186
				this.scoringSystem.newScore()
			}

		}

		
	}

	collisionDetection(dx, dy, objectWidth, objectHeight) {
		for (let i = 0; i < this.properties.length; i++) {
			if (
				this.properties[i].dx < dx + objectWidth - 8 &&
				this.properties[i].dx + this.imgWidth > dx &&
				(this.a - this.properties[i].randomNumber < dy + objectHeight - 8 ||
					this.imgHeight - this.a - this.properties[i].randomNumber > dy)
			) {
				playAudio('../sounds/die.ogg')
				return true
			}
		}
	}

	reset() {
		this.properties = []
		for (let i = 0; i < 4; i++) {
			this.properties.push({
				dx: canvas.width + (this.imgWidth + canvas.width / 4) * i,
				randomNumber: Math.floor(Math.random() * 401) - 186,
			})
		}

		this.scoringSystem.reset()
	}
}
// #endregion

// #region Bird
class Bird {
	constructor() {
		this.img1 = new Image()
		this.img1.src = '../images/bird1.png'

		this.img2 = new Image()
		this.img2.src = '../images/bird2.png'

		this.img3 = new Image()
		this.img3.src = '../images/bird3.png'

		// Wait until the image is loaded
		this.img1.onload = () => {
			this.imgWidth = this.img1.naturalWidth
			this.imgHeight = this.img1.naturalHeight
			this.dx = this.imgWidth * 4

			gameLoadingStates.push('Loading Pipes....')
		}

		this.img2.onload = () => {
			gameLoadingStates.push('Loading Pipes....')
		}

		this.img3.onload = () => {
			gameLoadingStates.push('Loading Pipes....')
		}

		this.frame = 0
		this.birdSpeed = 2
		this.skyLevel = null
		this.eventTrigger = 0
		this.birdGravity = 9.2
		this.isGameStarted = false
		this.freeMove = 20
		this.freeMoveAction = true

		this.dy = 0
	}

	draw(image) {
		this.dy = canvas.height - this.skyLevel
		ctx.drawImage(
			image,
			0,
			0,
			this.imgWidth,
			this.imgHeight,
			this.dx,
			this.dy,
			this.imgWidth,
			this.imgHeight
		)
	}

	updateBirdActions() {
		if (!this.isGameStarted) {
			this.skyLevel = canvas.height / 2 + this.freeMove
			if (!this.freeMoveAction) {
				this.freeMove++
				if (this.freeMove >= 20) this.freeMoveAction = true
			} else {
				this.freeMove--
				if (this.freeMove <= 0) this.freeMoveAction = false
			}
		}
		this.frame += this.birdSpeed

		if (this.frame <= 10) return this.img1
		else if (this.frame <= 20) return this.img2
		else {
			if (this.frame > 30) this.frame = 0
			return this.img3
		}
	}

	runGravity() {
		if (this.skyLevel == null) this.skyLevel = canvas.height / 2
		if (this.eventTrigger > 0) {
			this.eventTrigger -= this.birdSpeed + 0.0533333333
			this.skyLevel +=
				this.birdGravity -
				(canvas.height / 2 - this.skyLevel / (canvas.height / 2)) / 1000 //0.0533333333
		} else {
			this.skyLevel -=
				(canvas.height / 2 - this.skyLevel / (canvas.height / 2)) / 60
		}
	}

	isGameStarted() {
		return this.isGameStarted
	}

	jump() {
		if (!this.isGameStarted) this.isGameStarted = true
		if (
			this.skyLevel + this.eventTrigger + this.birdSpeed * 20 >=
			canvas.height
		)
			return
		this.eventTrigger = this.birdSpeed * 15
		playAudio('../sounds/jump.ogg')
	}

	getDx() {
		return this.dx
	}

	getDy() {
		return this.dy
	}

	getBirdHeight() {
		return this.imgHeight
	}

	getBirdWidth() {
		return this.imgWidth
	}

	reset() {
		this.dx = this.imgWidth * 4

		this.frame = 0
		this.birdSpeed = 2
		this.skyLevel = null
		this.eventTrigger = 0
		this.birdGravity = 9.2
		this.isGameStarted = false
		this.freeMove = 20
		this.freeMoveAction = true

		this.dy = 0
	}
}
// #endregion
