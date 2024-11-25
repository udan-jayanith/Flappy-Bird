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
					randomNumber: Math.floor(Math.random() * 401) - 186,
				})
			}

			gameLoadingStates.push('Loading Pipes....')
		}

		this.imgDownward.onload = () => {
			gameLoadingStates.push('Loading Pipes....')
		}

		this.a = canvas.height + 396 //400
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
			}
		}
	}

	collisionDetection() {
		return
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

			gameLoadingStates.push('Loading Ground....')
		}

		this.img2.onload = () => {
			gameLoadingStates.push('Loading Ground....')
		}

		this.img3.onload = () => {
			gameLoadingStates.push('Loading Ground....')
		}

		this.frame = 0
		this.birdSpeed = 0
		this.skyLevel = null
		this.eventTrigger = 0
		this.birdGravity = 0
	}

	draw(image) {
		ctx.drawImage(
			image,
			0,
			0,
			this.imgWidth,
			this.imgHeight,
			this.imgWidth * 4,
			canvas.height - this.skyLevel,
			this.imgWidth,
			this.imgHeight
		)
	}

	updateBirdActions() {
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
		this.frame += this.birdSpeed

		if (this.frame <= 10) return this.img1
		else if (this.frame <= 20) return this.img2
		else {
			if (this.frame > 30) this.frame = 0
			return this.img3
		}
	}

	setBirdFPS(fps) {
		this.birdSpeed = 0.0333333333 * fps
		this.birdGravity = 0.0766666667 * fps * 2
	}

	setSkyLevel(h) {
		this.skyLevel = h
	}

	jump() {
		if (this.skyLevel + this.eventTrigger + this.birdSpeed * 20 >= canvas.height) return
		this.eventTrigger = this.birdSpeed * 15
	}
}
// #endregion
