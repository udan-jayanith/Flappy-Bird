// #region settings
class Settings {
	constructor() {
		this.FPS = 60
		this.IntervalTimeout = 1000 / this.FPS
		this.gameSpeed = 0.2
		this.IntervalGameSpeed = this.gameSpeed * this.IntervalTimeout
		gameLoadingStates.push('Loading Settings....')
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

		this.fpsEl = document.querySelector('.current-fps')
		gameLoadingStates.push('Loading Settings....')
	}

	calculateFPS() {
		const currentTime = performance.now()
		const deltaTime = currentTime - this.lastTime
		this.fps = Math.round(1000 / deltaTime) // Calculate FPS
		this.lastTime = currentTime
	}

	display() {
		this.fpsEl.innerText = this.fps
	}
}
// #endregion

// #region Point system
class ScoringSystem {
	constructor() {
		this.bestScore = JSON.parse(localStorage.getItem('best-score')) || 0
		this.currentScore = 0

		this.bestScoreEl = document.querySelectorAll('.best-score')
		this.bestScoreEl.forEach((el) => {
			el.innerText = this.bestScore
		})

		this.scoreEl = document.querySelectorAll('.score')

		if ('connection' in navigator) {
			const connection =
				navigator.connection ||
				navigator.mozConnection ||
				navigator.webkitConnection

			setTimeout(() => {
				gameLoadingStates.push('Loading Settings....')
			}, 1000 - connection.downlink * 10)
		}
	}

	newScore() {
		this.currentScore++
		this.scoreEl.forEach((el) => {
			el.innerText = this.currentScore
		})
		if (this.currentScore >= this.bestScore) {
			localStorage.setItem('best-score', JSON.stringify(this.currentScore))
			this.bestScoreEl.forEach((el) => {
				el.innerText = this.currentScore
			})
		}

		playAudio('https://flappy-bird3.vercel.app/sounds/point.ogg')
	}

	reset() {
		this.currentScore = 0
		this.scoreEl.forEach((el) => {
			el.innerText = this.currentScore
		})
	}
}
