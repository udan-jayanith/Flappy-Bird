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
