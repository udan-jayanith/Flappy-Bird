const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

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

onkeyup = (event) => {
	if (
		!isGameOver &&
		(event.code == 'Space' || event.code == 'KeyW' || event.code == 'ArrowUp')
	) {
		if (!intervalId) startSetInterval()
		bird.jump()
	}
}

overlay.addEventListener('click', (e) => {
	if (e.target.classList.contains('x')) return
	if (
		!intervalId &&
		e.target.classList.contains('notice-centering-div') &&
		!isGameOver
	) {
		startSetInterval()
	}else if (e.target.classList.contains('notice-centering-div')) bird.jump()
})

const notice = document.querySelector('.notice')

function draw() {
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
	if (ground.collisionDetection(bird.getDy(), bird.getBirdHeight())) gameOver()

	currentGameFPS.calculateFPS()
}

setInterval(() => {
	currentGameFPS.display()
}, 1000)

const pauseButton = document.querySelector('.pause-button')

function startSetInterval() {
	pauseButton.style.display = 'block'
	intervalId = setInterval(() => {
		if (gameLoadingStates.length >= 2) draw()
		else console.log(gameLoadingStates)
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
	if (e.code == 'Enter') r()
})

document.querySelector('.reset-game-button').addEventListener('click', () => {
	location.reload()
	//r()
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
			alert(
				'No audio permission granted. Allow audio permission for better experience.'
			)
		)
}

/*
function r() {
	gameOverDialog.style.display = 'none'
	gameOverDialog.close()
	gameLoadingStates = []

	background = new Background()
	ground = new Ground()
	pipes = new Pipes()
	bird = new Bird()

	settings = new Settings()
	currentGameFPS = new CurrentGameFPS()

	isGameOver = false
	intervalId = undefined
	stopSetInterval()
	console.log('d')
}
*/
