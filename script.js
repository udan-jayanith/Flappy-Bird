const canvas = document.getElementById("main-frame")
const ctx = canvas.getContext("2d")

class BackGround{
     constructor(speed){
          this.image = new Image()
          this.image.src = "sprites/Artboard.png" 

          canvas.width = this.image.naturalWidth
          canvas.height = this.image.naturalHeight

          this.width = this.image.naturalWidth
          this.height = this.image.naturalHeight

          this.x1 = 0
          this.x2 = this.width
          this.y = 0

          this.speed = speed
     }

     drawImage(){

          ctx.drawImage(this.image, this.x1, this.y)
          this.x1-=this.speed
          if(this.x1 <= -this.width) this.x1 = this.width

          ctx.drawImage(this.image, this.x2, this.y)
          this.x2-=this.speed
          if(this.x2 <= -this.width) this.x2 = this.width

     }
}

class Base{
     constructor(speed){
          this.image = new Image()
          this.image.src = "sprites/base.png" 

          this.width = this.image.naturalWidth
          this.height = this.image.naturalHeight

          this.x1 = 0
          this.x2 = this.width
          this.y = canvas.height-this.height

          this.speed = speed
     }

     drawImage(){

          ctx.drawImage(this.image, this.x1, this.y)
          this.x1-=this.speed
          if(this.x1 <= -this.width) this.x1 = this.width

          ctx.drawImage(this.image, this.x2, this.y)
          this.x2-=this.speed
          if(this.x2 <= -this.width) this.x2 = this.width

     }
}


class Pipe{
     constructor(speed, pipes){

          this.uperPipe = new Image()
          this.uperPipe.src = "sprites/uper-pipe.png"
          
          this.lowerPipe = new Image()
          this.lowerPipe.src = "sprites/lower-pipe.png" 

          this.width = this.uperPipe.naturalWidth
          this.height = this.uperPipe.naturalHeight

          this.speed = speed
          this.pipes = 16

          this.upperArray = []

          for(let i = 0; i<this.pipes; i++){

               let randomY = Math.random()*2
               if(i % 2 == 0) randomY = Math.random()*2.9
               
               this.upperArray.push({
                    x: (this.width*(i+1)) + this.width,
                    y: -canvas.height/randomY,
               })

          }

          this.lowerArray = []

          for(let i = 0; i<this.pipes; i++){

               let randomY = Math.random()*2.9
               if(i % 2 == 1) randomY = Math.random()*2
               
               this.lowerArray.push({
                    x: (this.width*(i+1)) + this.width,
                    y: canvas.height/randomY,
               })

          }

          
     }

     
     UperPipe(){

          for(let i = 0; i<this.pipes; i++) {

               ctx.drawImage(this.uperPipe, this.upperArray[i].x, this.upperArray[i].y)
               this.upperArray[i].x-=this.speed
     
               if(this.upperArray[i].x < -this.width) {
                    this.upperArray[i].x = canvas.width + this.width

                    let randomY = Math.random()*2
                    if(i % 2 == 0) randomY = Math.random()*2.9

                    this.upperArray[i].y = -canvas.height/randomY
               }

          }
     }

     LowerPipe(){

          for(let i = 0; i<this.pipes; i++) {

               ctx.drawImage(this.lowerPipe, this.lowerArray[i].x, this.lowerArray[i].y)
               this.lowerArray[i].x-=this.speed
     
               if(this.lowerArray[i].x < -this.width) {
                    this.lowerArray[i].x = canvas.width + this.width

                    let randomY = Math.random()*2.9
                    if(i % 2 == 1) randomY = Math.random()*2

                    this.lowerArray[i].y = canvas.height/randomY
               }

          }

     }


}

let arrow = 0

class Bird{
     constructor(speed){
          this.image = new Image()
          this.image.src = 'sprites/bird.png'

          this.Frame = 0
          this.sWidth = this.image.width/3
          this.sHeight = this.image.height
          this.x = 100
          this.y = 100

          this.speed = speed
          
     }


     drawBird(){
          ctx.drawImage(this.image, this.sWidth*this.Frame , 0, this.sWidth, this.sHeight, this.x, this.y, this.sWidth, this.sHeight)

          if(this.Frame >= 2) this.Frame = 0
          else this.Frame++

          if(this.y >= 1 && arrow!=0) {
               this.y --
               arrow --
          }
          else if(this.y < canvas.height) this.y+=1.01


          
     }
}

let speed = 1
const backGround = new BackGround(speed)
const base = new Base(speed)
const pipe = new Pipe(speed) 
const bird = new Bird(speed)

function mainFrame(){
     ctx.clearRect(0, 0, canvas.width, canvas.height)

     backGround.drawImage()
     pipe.UperPipe()
     pipe.LowerPipe()
     base.drawImage()
     bird.drawBird()

}

let stateCheck = setInterval(()=>{

     if (document.readyState === 'complete'){
          clearInterval(stateCheck);
          setInterval(mainFrame, 10)
          console.log('complete')
     }

}, 1);

document.onkeyup = (e) => {
    if (e.key == 'ArrowUp') arrow = 20
}
