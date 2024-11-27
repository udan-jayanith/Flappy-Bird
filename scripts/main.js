const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

ctx.shadowColor = 'transparent'
ctx.shadowBlur = 0
ctx.shadowOffsetX = 0
ctx.shadowOffsetY = 0

let gameLoadingStates = []

let background = new Background()
let ground = new Ground()
let pipes = new Pipes()
let bird = new Bird()

let settings = new Settings()
let currentGameFPS = new CurrentGameFPS()

let isGameOver = false
let intervalId = undefined
const overlay = document.querySelector('.overlay')
const loadingScreen = document.querySelector('.loading-screen')
loadingScreen.style.display = 'block'

onkeyup = (event) => {
	if (event.code == 'KeyF') {
		screenModFun()
		return
	}
	if (loadingScreen.style.display == 'block') return
	if (
		!isGameOver &&
		(event.code == 'Space' || event.code == 'KeyW' || event.code == 'ArrowUp')
	) {
		if (!intervalId) startSetInterval()
		bird.jump()
	}
}

overlay.addEventListener('click', (e) => {
	if (
		e.target.classList.contains('x') ||
		loadingScreen.style.display == 'block'
	) {
		return
	}

	if (
		!intervalId &&
		e.target.classList.contains('notice-centering-div') &&
		!isGameOver
	) {
		startSetInterval()
	} else if (e.target.classList.contains('notice-centering-div')) bird.jump()
})

const notice = document.querySelector('.notice')
const progressBar = document.querySelector('.loading-bar')

function draw() {
	if (loadingScreen.style.display == 'block') {
		loadingScreen.style.display = 'none'
	}
	ctx.clearRect(-canvas.width, 0, canvas.width * 3, canvas.height)

	background.draw(settings.getGameSpeed())
	if (bird.isGameStarted) {
		pipes.draw(settings.getGameSpeed())
		notice.style.display = 'none'
	}

	if (
		pipes.collisionDetection(
			bird.getDx(),
			bird.getDy(),
			bird.getBirdWidth(),
			bird.getBirdHeight()
		)
	) {
		gameOver()
	}

	bird.runGravity()
	bird.draw(bird.updateBirdActions())
	ground.draw(settings.getGameSpeed())
	if (
		ground.collisionDetection(bird.getDy(), bird.getBirdHeight()) &&
		bird.isGameStarted
	) {
		gameOver()
	}

	currentGameFPS.calculateFPS()
}

setInterval(() => {
	currentGameFPS.display()
}, 1000)

const pauseButton = document.querySelector('.pause-button')

function startSetInterval() {
	pauseButton.style.display = 'block'
	intervalId = setInterval(() => {
		if (progressBar.value >= 100) draw()
		else {
			loadingScreen.style.width = getComputedStyle(canvas).width
			progressBar.value = gameLoadingStates.length * 10
		}
	}, settings.getIntervalTimeout())
}
startSetInterval()

function stopSetInterval() {
	clearInterval(intervalId)
}

function pauseTheGame() {
	pauseButton.style.display = 'none'
	stopSetInterval()
	intervalId = false
	notice.style.display = 'block'
	notice.innerText = 'Press "Space" to resume the game.'
}

const gameOverDialog = document.querySelector('.game-over')

function gameOver() {
	isGameOver = true
	pauseButton.style.display = 'none'
	stopSetInterval()

	gameOverDialog.style.display = 'flex'
	gameOverDialog.showModal()
}

gameOverDialog.addEventListener('keydown', (e) => {
	e.preventDefault()
	if (e.code == 'Enter') playAgain()
})

document.querySelector('.reset-game-button').addEventListener('click', () => {
	playAgain()
})

pauseButton.addEventListener('click', () => {
	pauseTheGame()
})

function playAudio(audioFilePath) {
	const audio = new Audio(audioFilePath)
	audio.volume = 0.1
	audio
		.play()
		.catch((error) =>
			console.log(
				'No audio permission granted. Allow audio permission for better experience.'
			)
		)
}

function playAgain() {
	gameOverDialog.style.display = 'none'
	gameOverDialog.close()

	stopSetInterval()
	pipes.reset()
	bird.reset()

	isGameOver = false
	intervalId = undefined

	notice.style.display = 'block'
	notice.innerText = 'Press "Space" to play again.'
	startSetInterval()
}

const screenMod = document.querySelector('.screen-mod')
screenMod.addEventListener('click', () => {
	// Call the function to go full screen
	screenModFun()
})

const mod = document.querySelector('.m-mod')

function screenModFun() {
	if (
		document.documentElement.requestFullscreen &&
		mod.src.split('/')[4] == 'fullscreen.webp'
	) {
		document.documentElement.requestFullscreen()
		mod.src = 'https://flappy-bird3.vercel.app/images/fullscreen-exit.webp'
	} else if (document.exitFullscreen) {
		document.exitFullscreen()
		mod.src = 'https://flappy-bird3.vercel.app/images/fullscreen.webp'
	}
}

window.addEventListener('resize', () => {
	setTimeout(() => {
		overlay.style.width = getComputedStyle(canvas).width
	}, 1000)
})

function isElectron() {
  return navigator.userAgent.includes('Electron');
}

// Show the button only if running in Electron
if (isElectron()) {
	screenMod.style.display = 'none'
}
