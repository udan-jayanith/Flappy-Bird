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
		this.IntervalTimeout = 1000 / this.FPS
		this.IntervalGameSpeed = this.gameSpeed * this.IntervalTimeout
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

		this.fpsEl = document.querySelector('.current-fps')
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