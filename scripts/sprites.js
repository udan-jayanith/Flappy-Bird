// #region Background
class Background {
	constructor() {
		this.img = new Image()
		this.img.src = '../images/background.webp'
		this.overlay = document.querySelector('.overlay')

		// Wait until the image is loaded
		this.img.onload = () => {
			this.imgWidth = 732 //this.img.naturalWidth
			this.imgHeight = 896 //this.img.naturalHeight

			canvas.width = this.imgWidth * 2
			canvas.height = this.imgHeight
			this.overlay.style.width = getComputedStyle(canvas).width
			this.dx = []
			for (let i = 0; i < 4; i++) {
				this.dx.push(this.imgWidth * i)
			}
			setTimeout(() => {
				gameLoadingStates.push('Loading Background....')
			}, 1000)
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
		this.img.src = '../images/ground.webp'
		this.imgWidth = 1474 //this.img.naturalWidth
		this.imgHeight = 128 //this.img.naturalHeight

		// Wait until the image is loaded
		this.img.onload = () => {
			this.dx = []
			this.dy = canvas.height - this.imgHeight
			setTimeout(() => {
				this.dy = canvas.height - this.imgHeight
			}, 1000)

			for (let i = 0; i < 2; i++) {
				this.dx.push(this.imgWidth * i)
			}
			setTimeout(() => {
				gameLoadingStates.push('Loading Ground....')
			}, 2000)
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
		this.imgUpward.src = '../images/upward-Pipe.webp'

		this.imgDownward = new Image()
		this.imgDownward.src = '../images/downward-Pipe.webp'

		this.imgWidth = 138//this.imgUpward.naturalWidth
		this.imgHeight = 793//this.imgUpward.naturalHeight

		// Wait until the image is loaded
		this.imgUpward.onload = () => {
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

		this.a = canvas.height + 372
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
		this.img1.src = '../images/bird1.webp'

		this.img2 = new Image()
		this.img2.src = '../images/bird2.webp'

		this.img3 = new Image()
		this.img3.src = '../images/bird3.webp'

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
