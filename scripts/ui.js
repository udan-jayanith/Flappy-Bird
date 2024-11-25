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
