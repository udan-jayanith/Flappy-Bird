const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let gameLoadingStates = []

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


function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

// Call this function to exit fullscreen
exitFullScreen();

*/

const background = new Background()
const ground = new Ground()
const pipes = new Pipes()
const bird = new Bird()

const settings = new Settings()
const currentGameFPS = new CurrentGameFPS()

settings.setFPS(60)
settings.setGameSpeed(20)
bird.setBirdFPS(settings.getFPS())

onkeyup = (event) => {
	if (
		event.code == 'Space' ||
		event.code == 'KeyW' ||
		event.code == 'ArrowUp'
	) {
		bird.jump()
	}
}

const screen = document.querySelector('.overlay')

screen.addEventListener('click', () => {
    bird.jump()
     console.log('Click')
})

function draw() {
	ctx.clearRect(-canvas.width, 0, canvas.width * 3, canvas.height)

	background.draw(settings.getGameSpeed())
	pipes.draw(settings.getGameSpeed())
	bird.draw(bird.updateBirdActions())
	ground.draw(settings.getGameSpeed())

	currentGameFPS.calculateFPS()
}

bird.jump()

setInterval(() => {
	currentGameFPS.display()
}, 1000)

setInterval(() => {
	if (gameLoadingStates.length >= 2) draw()
	else console.log(gameLoadingStates)
}, settings.getIntervalTimeout())
