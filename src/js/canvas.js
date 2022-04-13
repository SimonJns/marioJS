import {createImage, createImageAsync, isOnTopOfPlatforme, collisionTop, isOnTopOfPlatformeCircle, hitBottomOfPlatform, hitSideOfPlatform, objectsTouch } from './utils.js'

import gsap from 'gsap'
import plateforme from '../img/plateformes.png'
import background from '../img/background_1.png'
import hills from '../img/hills.png'
import smallplateforme from '../img/plateformes_small.png'
import block from '../img/sprite/block.png'
import blockTri from '../img/sprite/blockTri.png'
import moyPlateforme from '../img/moyPlateforme.png'
import grdPlateforme from '../img/grdPlateformes.png'
import hPlateforme from '../img/hPlateforme.png'
import xhPlateforme from '../img/xhPlateforme.png'
import drapeauSprite from '../img/drapeau.png'


import IdleLeft from '../img/sprite/IdleLeft.png'
import IdleRight from '../img/sprite/IdleRight.png'
import RunLeft from '../img/sprite/RunLeft.png'
import RunRight from '../img/sprite/RunRight.png'
import spriteGoomba from '../img/sprite/spriteGoomba.png'
import JumpRight from '../img/sprite/JumpRight.png'
import JumpLeft from '../img/sprite/JumpLeft.png'

import powerUpSprite from '../img/sprite/PowerUp.png'
import IdlePowerLeft from '../img/sprite/IdlePowerLeft.png'
import IdlePowerRight from '../img/sprite/IdlePowerRight.png'
import JumpPowerRight from '../img/sprite/JumpPowerRight.png'
import JumpPowerLeft from '../img/sprite/JumpPowerLeft.png'
import RunPowerLeft from '../img/sprite/RunPowerLeft.png'
import RunPowerRight from '../img/sprite/RunPowerRight.png'

import {audio} from './audio.js'
import {images} from './images.js'



const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1500
canvas.height = 610


let gravity = 1.5

class Joueur {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        
      
        this.width = 66
        this.height = 100

        this.image = createImage(IdleRight)
        this.frames = 0
        this.sprites = {
          stand: {
            right: createImage(IdleRight),
            left: createImage(IdleLeft),
            powerUp: {
              right: createImage(IdlePowerRight),
              left: createImage(IdlePowerLeft),
              cropWidth: 177,
              width: 66
            },
            cropWidth: 177,
            width: 66
          }, 
          //ok
          run: {
            right: createImage(RunRight),
            left: createImage(RunLeft),
            powerUp: {
              right: createImage(RunPowerRight),
              left: createImage(RunPowerLeft),
              cropWidth: 341,
              width: 90
            },
            cropWidth: 341,
            width: 90
          },
          jump: {
            right: createImage(JumpRight),
            left: createImage(JumpLeft),
            powerUp: {
              right: createImage(JumpPowerRight),
              left: createImage(JumpPowerLeft),
              cropWidth: 285,
              width: 90
            },
            cropWidth: 285,
            width: 90
          }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = this.sprites.stand.cropWidth
        this.powerMushroom = {
          powerUp: false
        }
        this.invincible = false
        this.opacite = 1
      }
    draw() {
      c.save()
      c.globalAlpha = this.opacite
      c.drawImage(this.currentSprite, this.currentCropWidth*this.frames,0,this.currentCropWidth,400, this.position.x, this.position.y, this.width, this.height)
      c.restore()
    }

    update() {
      this.frames++
      const {currentSprite, sprites} = this

      if (this.frames > 58 && (currentSprite === sprites.stand.right || currentSprite === sprites.stand.left 
        || currentSprite === sprites.stand.powerUp.left
        || currentSprite === sprites.stand.powerUp.right)) this.frames = 0
      else if (this.frames > 29 && (currentSprite === sprites.run.right || currentSprite === sprites.run.left 
        ||currentSprite === sprites.run.powerUp.right || currentSprite === sprites.run.powerUp.left)) this.frames = 0
      else if (currentSprite === sprites.jump.right || currentSprite === sprites.jump.left
        ||currentSprite === sprites.jump.powerUp.right || currentSprite === sprites.jump.powerUp.left) this.frames = 0

      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y

      if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity

      if (this.invincible) {
        if (this.opacite ===1) this.opacite = 0
        else this.opacite = 1 
      }
      else this.opacite = 1
      }
    }

class Plateforme {
    constructor({x, y, image, block}) {
        this.position = {
            x,
            y
        }

        this.velocity = {
          x: 0
        }

        this.image = image
        this.width = image.width
        this.height = image.height
        this.block = block
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    } 
    update() {
      this.draw()
      this.position.x += this.velocity.x
    }
}

class GenericObject {
  constructor({x, y, image}) {
      this.position = {
          x,
          y
      }

      this.velocity = {
        x: 0
      }

      this.image = image
      this.width = image.width
      this.height = image.height
      
  }
  draw() {
      c.drawImage(this.image, this.position.x, this.position.y)
  }  
  update() {
    this.draw()
    this.position.x += this.velocity.x
  }
}

class Goomba {
  constructor({position, velocity, distance ={limit: 50,
      traveled: 0}}) {
    this.position = {
      x: position.x,
      y: position.y
    }
    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }
    this.width = 43.33 
    this.height = 50
    this.image = createImage(spriteGoomba)
    this.frames = 0

    this.distance = distance
  }

  draw() {
    //c.fillStyle = 'red'
    //c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.drawImage(this.image, 130*this.frames,0,130,150, this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.frames ++
    if (this.frames >=58) this.frames = 0
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity

    // mouvement arrière goomba 
    this.distance.traveled += Math.abs(this.velocity.x)

    if (this.distance.traveled > this.distance.limit) {
      this.distance.traveled = 0
      this.velocity.x = -this.velocity.x
    }
  }
}

class PowerUp {
  constructor({position, velocity}) {
    this.position = {
      x: position.x,
      y: position.y
    }
    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }
    this.width = 56  
    this.height = 60
    this.image = createImage(powerUpSprite)
    this.frames = 0
  }

  draw() {
    //c.fillStyle = 'red'
    //c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.drawImage(this.image, 56*this.frames,0,56,60, this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.frames ++
    if (this.frames >=75) this.frames = 0
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity
  }
}

class Particule {
  constructor({position, velocity, radius, color = '#654428', bouledefeu = false, fades = false}) {
    
  
    this.position ={
      x: position.x, 
      y: position.y
    }

    this.velocity = {
      x: velocity.x, 
      y: velocity.y
    }

    this.radius = radius
    this.tdv = 300
    this.color = color
    this.bouledefeu = bouledefeu
    this.opacite = 1
    this.fades = fades
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacite
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.tdv --
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if (this.position.y + this.radius + this.velocity.y <= canvas.height)
      this.velocity.y += gravity*0.4

    if (this.fades && this.opacite > 0) {
      this.opacite -= 0.01
    }
    if (this.opacite < 0) this.opacite = 0
  }
}

let plateformeImage 
let smallplateformeImage 
let blockTriImage 
let grdPlateformeImage
let hPlateformeImage
let xhPlateformeImage
let blockImage

let joueur = new Joueur()
let plateformes = []
let genericObjects = []
let lastKey = []
let goombas = []
let particules = []
let powerUps = []

let keys

let scrollOffset = 0
let drapeau 
let drapeauImage
let jeu 
let currentLevel = 1

function selectLevel(currentLevel) {
  switch(currentLevel) {
    case 1: 
      init ()
      break
    case 2:
      initLevel2()
      break
  }

}

async function init() {
  joueur = new Joueur()
  keys = {
    right: {
      pressed: false 
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

 jeu =  {
    disableUserInput: false
  }
 plateformeImage = await createImageAsync(plateforme)
 smallplateformeImage = await createImageAsync(smallplateforme)
 blockTriImage = await createImageAsync(blockTri)
 blockImage = await createImageAsync(block)
 grdPlateformeImage = await createImageAsync(grdPlateforme)
 hPlateformeImage = await createImageAsync(hPlateforme)
 xhPlateformeImage = await createImageAsync(xhPlateforme)
 drapeauImage = await createImageAsync(drapeauSprite)

 drapeau = new GenericObject({
  x: 6968 + 500,
  y: canvas.height - grdPlateformeImage.height - drapeauImage.height,
  image: drapeauImage
})

 powerUps = [new PowerUp({position: {
  x: 300, 
  y: 100
},
velocity: {
  x:0,
  y: 0
}
})]

 joueur = new Joueur()
 const goombaWidth = 43.33
 goombas = [new Goomba({position: {
   x: 908 + grdPlateformeImage.width - goombaWidth, 
   y: 100
  },
  velocity: {
    x: -0.3,
    y:0
  }, 
  distance: {
    limit: 400,
    traveled:0
  }
  }),
  new Goomba({position: {
    x: 3249 + grdPlateformeImage.width - goombaWidth, 
    y: 100
   },
   velocity: {
     x: -0.3,
     y:0
   }, 
   distance: {
     limit: 400,
     traveled:0
   }
   }),
   new Goomba({position: {
    x: 3249 + grdPlateformeImage.width - goombaWidth - goombaWidth, 
    y: 100
   },
   velocity: {
     x: -0.3,
     y:0
   }, 
   distance: {
     limit: 400,
     traveled:0
   }
   }),
   new Goomba({position: {
    x: 3249 + grdPlateformeImage.width - goombaWidth - goombaWidth - goombaWidth, 
    y: 100
   },
   velocity: {
     x: -0.3,
     y:0
   }, 
   distance: {
     limit: 400,
     traveled:0
   }
   }), 
   new Goomba({position: {
    x: 3249 + grdPlateformeImage.width - goombaWidth - goombaWidth - goombaWidth - goombaWidth, 
    y: 100
   },
   velocity: {
     x: -0.3,
     y:0
   }, 
   distance: {
     limit: 400,
     traveled:0
   }
   }),
   new Goomba({position: {
    x: 5135 + xhPlateformeImage.width / 2 + goombaWidth, 
    y: 100
   },
   velocity: {
     x: -0.3,
     y:0
   }, 
   distance: {
     limit: 100,
     traveled:0
   }
   }),
   new Goomba({position: {
    x: 6968, 
    y: 0
   },
   velocity: {
     x: -0.3,
     y:0
   }, 
   distance: {
     limit: 100,
     traveled:0
   }
   })
]
 particules = []
 plateformes = [
   new Plateforme({
     x: 908 + 100, 
     y: 300,
     image: blockTriImage,
     block: true
   }),
   new Plateforme({
    x: 908 + 100 + blockImage.width, 
    y: 100,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 1991 + grdPlateformeImage.width - hPlateformeImage.width, 
    y: canvas.height - grdPlateformeImage.height - hPlateformeImage.height,
    image: hPlateformeImage,
    block: false
  }),
  new Plateforme({
    x: 1991 + grdPlateformeImage.width - hPlateformeImage.width - 100, 
    y: canvas.height - grdPlateformeImage.height - hPlateformeImage.height + blockImage.height,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 5712 + xhPlateformeImage.width + 175, 
    y: canvas.height - xhPlateformeImage.height,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 6116 + 175, 
    y: canvas.height - xhPlateformeImage.height,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 6116 + 175 *2, 
    y: canvas.height - xhPlateformeImage.height,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 6116 + 175 *3, 
    y: canvas.height - xhPlateformeImage.height - 100,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 6116 + 175 * 4, 
    y: canvas.height - xhPlateformeImage.height - 150,
    image: blockTriImage,
    block: true
  }),
  new Plateforme({
    x: 6116 + 175 * 4 + blockTriImage.width, 
    y: canvas.height - xhPlateformeImage.height - 150,
    image: blockTriImage,
    block: true
  }),
  new Plateforme({
    x: 6968 + 300, 
    y: canvas.height - grdPlateformeImage.height,
    image: grdPlateformeImage,
    block: true
  }),
  new Plateforme({
    x: 6968 + 800, 
    y: canvas.height - grdPlateformeImage.height,
    image: grdPlateformeImage,
    block: true
  })
 ]

  genericObjects = [
   new GenericObject({
     x: 0,
     y: 0,
     image: createImage(background)
    }),

    new GenericObject({
      x: 0,
      y: 40,
      image: createImage(hills)
     })
 ]
 scrollOffset = 0

    const plateformesMap = ['grd', 'grd', 'trou', 'grd', 'trou', 'trou', 'grd', 'trou', 'h', 'trou', 'xh', 'trou', 'xh', 'trou',
       'trou', 'xh']

       let plateformeDistance = 0

       plateformesMap.forEach(symbol => {
         switch(symbol) {
            case 'grd':
             plateformes.push(new Plateforme({
               x:plateformeDistance, 
               y:canvas.height - grdPlateformeImage.height,
               image: grdPlateformeImage,
               block: true,
             }))
             plateformeDistance += grdPlateformeImage.width 
             break

          case 'trou': 
            plateformeDistance += 175
            break

          case 'h':
            plateformes.push(new Plateforme({
              x:plateformeDistance, 
              y: canvas.height - hPlateformeImage.height,
              image: hPlateformeImage,
              block: true
            }))
            plateformeDistance += hPlateformeImage.width 
            break
         
          case 'xh':
            plateformes.push(new Plateforme({
              x:plateformeDistance, 
              y: canvas.height - xhPlateformeImage.height,
              image: xhPlateformeImage,
              block: true
            }))
            plateformeDistance += xhPlateformeImage.width 
            break
         }
       })
}

async function initLevel2() {
  joueur = new Joueur()
  keys = {
    right: {
      pressed: false 
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

 jeu =  {
    disableUserInput: false
  }

 blockTriImage = await createImageAsync(blockTri)
 blockImage = await createImageAsync(block)
 grdPlateformeImage = await createImageAsync(images.levels[2].lrgPlateforme)
 hPlateformeImage = await createImageAsync(hPlateforme)
 xhPlateformeImage = await createImageAsync(xhPlateforme)
 drapeauImage = await createImageAsync(drapeauSprite)
 const montagnes = await createImageAsync(images.levels[2].montagnes)
 const moyPlateformeImage = await createImageAsync(images.levels[2].moyPlateforme)

 drapeau = new GenericObject({
  x: 7680,
  y: canvas.height - grdPlateformeImage.height - drapeauImage.height,
  image: drapeauImage
})

 powerUps = [
   new PowerUp ({
    position: {
      x: 4734 - 28,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    }
  })
 ]

 joueur = new Joueur()
 const goombaWidth = 43.33

 goombas = [
  new Goomba({
    position: {
      x: 903 + moyPlateformeImage.width - goombaWidth,
      y: 100
    },
    velocity: {
      x: -2,
      y: 0
    },
    distance: {
      limit: 700,
      traveled: 0
    }
  }),
  new Goomba({
    position: {
      x:
        1878 +
        grdPlateformeImage.width +
        155 +
        200 +
        200 +
        200 +
        blockImage.width / 2 -
        goombaWidth / 2,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    distance: {
      limit: 0,
      traveled: 0
    }
  }),
  new Goomba({
    position: {
      x: 3831 + grdPlateformeImage.width - goombaWidth,
      y: 100
    },
    velocity: {
      x: -1,
      y: 0
    },
    distance: {
      limit: grdPlateformeImage.width - goombaWidth,
      traveled: 0
    }
  }),

  new Goomba({
    position: {
      x: 4734,
      y: 100
    },
    velocity: {
      x: 1,
      y: 0
    },
    distance: {
      limit: grdPlateformeImage.width - goombaWidth,
      traveled: 0
    }
  })
 ]
 particules = []

 plateformes = [
  new Plateforme({
    x: 903 + moyPlateformeImage.width + 115,
    y: 300,
    image: blockTriImage,
    block: true
  }),
  new Plateforme({
    x: 903 + moyPlateformeImage.width + 115 + blockTriImage.width,
    y: 300,
    image: blockTriImage,
    block: true
  }),
  new Plateforme({
    x: 1878 + grdPlateformeImage.width + 175,
    y: 360,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 1878 + grdPlateformeImage.width + 155 + 200,
    y: 300,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 1878 + grdPlateformeImage.width + 155 + 200 + 200,
    y: 330,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 1878 + grdPlateformeImage.width + 155 + 200 + 200 + 200,
    y: 240,
    image: blockImage,
    block: true
  }),
  new Plateforme({
    x: 4734 - moyPlateformeImage.width / 2,
    y: canvas.height - grdPlateformeImage.height - moyPlateformeImage.height,
    image: moyPlateformeImage
  }),
  new Plateforme({
    x: 6001,
    y: canvas.height - grdPlateformeImage.height - moyPlateformeImage.height,
    image: moyPlateformeImage
  }),
  new Plateforme({
    x: 6001,
    y: canvas.height - grdPlateformeImage.height - moyPlateformeImage.height * 2,
    image: moyPlateformeImage
  }),
  new Plateforme({
    x: 6800,
    y: canvas.height - grdPlateformeImage.height - moyPlateformeImage.height,
    image: moyPlateformeImage
  }),
  new Plateforme({
    x: 6800,
    y: canvas.height - grdPlateformeImage.height - moyPlateformeImage.height * 2,
    image: moyPlateformeImage
  }),
  new Plateforme({
    x: 6800,
    y: canvas.height - grdPlateformeImage.height - moyPlateformeImage.height * 3,
    image: moyPlateformeImage
  }),
  new Plateforme({
    x: 8000, 
    y: canvas.height - grdPlateformeImage.height,
    image: grdPlateformeImage,
    block: true
  })
 ]

  genericObjects = [
   new GenericObject({
     x: 0,
     y: 0,
     image: createImage(images.levels[2].background)
    }),

    new GenericObject({
      x: 0,
      y: canvas.height - montagnes.height,
      image: montagnes
     })
 ]
 scrollOffset = 0

    const plateformesMap = ['grd','moy','trou','trou','trou','grd', 'trou', 'trou','trou','trou','trou','trou','grd','grd','trou','trou','moy','trou','trou','moy','trou','trou','grd']

       let plateformeDistance = 0

       plateformesMap.forEach(symbol => {
         switch(symbol) {
           case 'moy':
            plateformes.push(
              new Plateforme({
            x: plateformeDistance,
            y: canvas.height - moyPlateformeImage.height,
            image: moyPlateformeImage,
            block: true,
            text: plateformeDistance
          })
        )

        plateformeDistance += moyPlateformeImage.width 

        break

        case 'grd':
          plateformes.push(new Plateforme({
            x:plateformeDistance, 
            y:canvas.height - grdPlateformeImage.height,
            image: grdPlateformeImage,
            block: true,
            }))
          plateformeDistance += grdPlateformeImage.width 
          break

            

          case 'trou': 
            plateformeDistance += 175
            break
         }
       })
}

function animation() {
    requestAnimationFrame(animation)
    c.fillStyle = 'White'
    c.fillRect(0, 0, canvas.width, canvas.height)

  genericObjects.forEach(genericObject =>{
    genericObject.update()
    genericObject.velocity.x = 0
  })

  particules.forEach((particule, i) => {
    particule.update()
    if (particule.bouledefeu && (particule.position.x - particule.radius >= canvas.width || particule.position.x + particule.radius <= 0))
    setTimeout(() => {
      particules.splice(i, 1)
    },0)
  })

    plateformes.forEach(plateforme => {
        plateforme.update()
        plateforme.velocity.x = 0
    })
  if (drapeau) {
    drapeau.update()
    drapeau.velocity.x = 0

    //condition pour gagner
    //touche le drapeau
    if (!jeu.disableUserInput && objectsTouch({
      object1: joueur,
      object2: drapeau
    }))
    {
      audio.FinNiveau.play()
      audio.Niveau.stop()
      jeu.disableUserInput = true
      joueur.velocity.x = 0
      joueur.velocity.y = 0
      gravity = 0

      joueur.currentSprite = joueur.sprites.jump.right

      //descente du drapeau
      setTimeout(() => {
        audio.Tombe.play()
      },200)
      gsap.to(joueur.position, {
        y: canvas.height - grdPlateformeImage.height - joueur.height,
        duration: 1,
        OnComplete() {
          joueur.currentSprite = joueur.sprites.run.right
        }
      })
      
      gsap.to(joueur.position, {
        delay: 1,
        x: canvas.width,
        duration: 2.5, 
        ease: 'power1.in'
      })

      //feu d'artifice fin du jeu 
      const particuleCount = 300
      const radians = Math.PI * 2 / particuleCount
      const power = 8
      let increment = 1

      const intervalId = setInterval(() => {
      for (let i = 0; i < particuleCount; i++) {
        particules.push(new Particule({
          position: {
          x: canvas.width / 6 * increment,
          y: canvas.height / 2
          },
          velocity: {
          x: Math.cos(radians * i) * power * Math.random(),
          y: Math.sin(radians * i) * power * Math.random()
          },
          radius: 3 * Math.random(),
          color: `hsl(${Math.random() * 200}, 80%, 50%)`,
          fades : true
          }))
        }

        audio.FeuArtificeExplosion.play()
        audio.FeuArtificeSifflement.play()

        if (increment === 4) clearInterval(intervalId)
        increment++
      },1000)
      //go au level 2 
      setTimeout(() =>
        {
          currentLevel++
          gravity = 1.5
          selectLevel(currentLevel) 
        }, 5000)
    }
  }

    //obtenir le powerup
    powerUps.forEach((powerUp, i) => {
      if (objectsTouch({
        object1: joueur, 
        object2: powerUp
      }))
      {
        joueur.powerMushroom.powerUp = true
        setTimeout(()=> {
        powerUps.splice(i, 1)
        },0)
      }else
      powerUp.update()
    })

    goombas.forEach((goomba, index) => {
      goomba.update()

      //colision avec la particule
      particules.forEach((particule, particuleIndex) => {
      if (particule.bouledefeu && particule.position.x + particule.radius >= goomba.position.x 
        && particule.position.y + particule.radius >= goomba.position.y 
        && particule.position.x - particule.radius <= goomba.position.x + goomba.width
        && particule.position.y - particule.radius <= goomba.position.y + goomba.height) 
        {
          for (let i = 0; i<50; i++) {
            particules.push(new Particule({
              position: {
                x: goomba.position.x + goomba.width/2, 
                y: goomba.position.y + goomba.height/2
              },
              velocity: {
                x: (Math.random() - 0.5)*7,
                y: (Math.random() - 0.5)*15
              },
              radius: Math.random() *3
            })
          )
        }
      setTimeout(() => {
        goombas.splice(index, 1)
        particules.splice(particuleIndex, 1)
    }, 0)
      }
  })

      //goomba 
      if (collisionTop({
        object1: joueur,
        object2: goomba
      })) {
        audio.goombaMort.play()
        for (let i = 0; i<50; i++) {
            particules.push(new Particule({
              position: {
                x: goomba.position.x + goomba.width/2, 
                y: goomba.position.y + goomba.height/2
              },
              velocity: {
                x: (Math.random() - 0.5)*7,
                y: (Math.random() - 0.5)*15
              },
              radius: Math.random() *3
            })
          )
          }
        joueur.velocity.y -= 40
        setTimeout(() => {
          goombas.splice(index, 1)
      }, 0)
    } else if (
      joueur.position.x + joueur.width >= goomba.position.x && joueur.position.y + joueur.height >= goomba.position.y && joueur.position.x <= goomba.position.x + goomba.width
    ) {
    //le joueur touche le goomba
    //perdre le powerup
     if (joueur.powerMushroom.powerUp) {
       joueur.invincible = true
       joueur.powerMushroom.powerUp = false
       audio.PowerUpPerdu.play()

        setTimeout(() => {
         joueur.invincible = false
       }, 1000);
      }
     else if (!joueur.invincible) {
      audio.Mort.play()
      selectLevel(currentLevel)
     }    
    }
  })

    joueur.update()

    if (jeu.disableUserInput) return

    
    //scroll code
    let hitSide = false
    if (keys.right.pressed && joueur.position.x < 400) {
        joueur.velocity.x = joueur.speed 
    }
    else if ((keys.left.pressed && joueur.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && joueur.position.x > 0)){
        joueur.velocity.x = -joueur.speed
    }
    else {
        joueur.velocity.x = 0

        if (keys.right.pressed) {
          for (let i =0; i < plateformes.length; i++) {
            const plateforme = plateformes[i]
              plateforme.velocity.x = -joueur.speed

              if (plateforme.block && hitSideOfPlatform({
                object: joueur, 
                plateforme
              })) {
                plateformes.forEach(plateforme => {
                  plateforme.velocity.x = 0
              })
              hitSide = true
              break
              }
          }

            if (!hitSide) {
              scrollOffset += joueur.speed

              drapeau.velocity.x = -joueur.speed

            genericObjects.forEach((genericObject) => {
              genericObject.velocity.x = -joueur.speed * 0.66
            })
            goombas.forEach((goomba) => {
              goomba.position.x -= joueur.speed
          })

          powerUps.forEach((powerUp) => {
            powerUp.position.x -= joueur.speed
        })

          particules.forEach((particule) => {
            particule.position.x -= joueur.speed
        })
      }
        }
        else if (keys.left.pressed && scrollOffset >0) {
          for (let i =0; i < plateformes.length; i++) {
            const plateforme = plateformes[i]
              plateforme.velocity.x = joueur.speed

                if (plateforme.block && hitSideOfPlatform({
                  object: joueur, 
                  plateforme
                })) {
                  plateformes.forEach(plateforme => {
                    plateforme.velocity.x = 0
                })
                hitSide = true
                break
              }
            }

              if (!hitSide) {
                scrollOffset -= joueur.speed

                drapeau.velocity.x = joueur.speed

            genericObjects.forEach((genericObject) => {
              genericObject.velocity.x = joueur.speed * 0.66
            })
            goombas.forEach((goomba) => {
              goomba.position.x += joueur.speed
          })

          powerUps.forEach((powerUp) => {
            powerUp.position.x += joueur.speed
        })
        
        particules.forEach((particule) => {
          particule.position.x += joueur.speed
      })
     }
    }
  }

    //detection de la plateforme
    plateformes.forEach(plateforme => {
        if (
          isOnTopOfPlatforme({
            object: joueur, 
            plateforme
          })
        ){
        joueur.velocity.y = 0 
        }

        if (plateforme.block && hitBottomOfPlatform({
          object: joueur,
          plateforme
        })) {
          joueur.velocity.y = -joueur.velocity.y
        }

        if (plateforme.block && hitSideOfPlatform({
          object: joueur, 
          plateforme
        })) {
          joueur.velocity.x = 0
        }

        //rebond des particules
        particules.forEach((particule, index) => {
          if (
          isOnTopOfPlatformeCircle({
            object: particule, 
            plateforme
          })
        ){
          const rebond = 0.9
          particule.velocity.y = -particule.velocity.y *0.99
          if (particule.radius -0.4 < 0 ) particules.splice(index, 1)
          else
          particule.radius -= 0.4
        }
        if (particule.tdv < 0) particules.splice(index, 1)
      })
        
        goombas.forEach(goomba => {
          if(isOnTopOfPlatforme({
            object: goomba, 
            plateforme
          }))
          goomba.velocity.y = 0
        })

        powerUps.forEach(PowerUp => {
          if(isOnTopOfPlatforme({
            object: PowerUp, 
            plateforme
          }))
          PowerUp.velocity.y = 0
        })
      })      

    //condition pour perdre
    if (joueur.position.y > canvas.height) {
      audio.Mort.play()
    selectLevel(currentLevel)
    }
    
    //changer les sprites
    if (joueur.velocity.y !== 0) return 
    if (keys.right.pressed && 
      lastKey === 'right' && joueur.currentSprite !== joueur.sprites.run.right) { 
      joueur.currentSprite = joueur.sprites.run.right
      joueur.currentCropWidth = joueur.sprites.run.cropWidth
      joueur.width = joueur.sprites.run.width
    } else if (keys.left.pressed &&
      lastKey === 'left' && joueur.currentSprite !== joueur.sprites.run.left) {
      joueur.currentSprite = joueur.sprites.run.left
      joueur.currentCropWidth = joueur.sprites.run.cropWidth
      joueur.width = joueur.sprites.run.width
    }
    else if (!keys.left.pressed &&
      lastKey === 'left' && joueur.currentSprite !== joueur.sprites.stand.left) {
      joueur.currentSprite = joueur.sprites.stand.left
      joueur.currentCropWidth = joueur.sprites.stand.cropWidth
      joueur.width = joueur.sprites.stand.width
    }
    else if (!keys.right.pressed &&
      lastKey === 'right' && joueur.currentSprite !== joueur.sprites.stand.right) {
      joueur.currentSprite = joueur.sprites.stand.right
      joueur.currentCropWidth = joueur.sprites.stand.cropWidth
      joueur.width = joueur.sprites.stand.width
    }
    
    //powerup
    if (!joueur.powerMushroom.powerUp) return

    if (keys.right.pressed && 
      lastKey === 'right' && joueur.currentSprite !== joueur.sprites.run.powerUp.right) {
      joueur.currentSprite = joueur.sprites.run.powerUp.right
      joueur.currentCropWidth = joueur.sprites.run.powerUp.cropWidth
      joueur.width = joueur.sprites.run.powerUp.width
    } else if (keys.left.pressed &&
      lastKey === 'left' && joueur.currentSprite !== joueur.sprites.run.powerUp.left) {
      joueur.currentSprite = joueur.sprites.run.powerUp.left
      joueur.currentCropWidth = joueur.sprites.run.powerUp.cropWidth
      joueur.width = joueur.sprites.run.powerUp.width
    }
    else if (!keys.left.pressed &&
      lastKey === 'left' && joueur.currentSprite !== joueur.sprites.stand.powerUp.left) {
      joueur.currentSprite = joueur.sprites.stand.powerUp.left
      joueur.currentCropWidth = joueur.sprites.stand.powerUp.cropWidth
      joueur.width = joueur.sprites.stand.powerUp.width
    }
    else if (!keys.right.pressed &&
      lastKey === 'right' && joueur.currentSprite !== joueur.sprites.stand.powerUp.right) {
      joueur.currentSprite = joueur.sprites.stand.powerUp.right
      joueur.currentCropWidth = joueur.sprites.stand.powerUp.cropWidth
      joueur.width = joueur.sprites.stand.powerUp.width
    }
  }

selectLevel(1)
//init()
//initLevel2()
animation()

window.addEventListener('keydown', ({keyCode}) => {
  if (jeu.disableUserInput) return

    switch (keyCode) {
        case 81:
          console.log('left')
          keys.left.pressed = true
          lastKey = 'left'
          break

        case 83:
          console.log('bas')
          break
        
        case 68:
          console.log('right')
          keys.right.pressed = true
          lastKey = 'right'
          break

        case 90:
          console.log('haut')
          joueur.velocity.y -= 25
          audio.Saut.play()
          if (lastKey === 'right')
          joueur.currentSprite = joueur.sprites.jump.right
          else
          joueur.currentSprite = joueur.sprites.jump.left

          if (!joueur.powerMushroom.powerUp) break

          if (lastKey === 'right')
          joueur.currentSprite = joueur.sprites.jump.powerUp.right
          else
          joueur.currentSprite = joueur.sprites.jump.powerUp.left

          break

        case 32: 
        console.log('espace')

        if (!joueur.powerMushroom.powerUp) return 

        audio.TirBouleDefeu.play()

        let velocity = 15
        if (lastKey === 'left') velocity = -velocity

        particules.push(new Particule({
          position: {
            x: joueur.position.x + joueur.width / 2,
            y: joueur.position.y + joueur.height / 2
          },
          velocity: {
            x: velocity,
            y: 0
          },
          radius: 5,
          color: 'red',
          bouledefeu: true
        }))
        break
    }
})

window.addEventListener('keyup', ({keyCode}) => {
  if (jeu.disableUserInput) return
    
    switch (keyCode) {
        case 81:
            console.log('left')
            keys.left.pressed = false
            break

        case 83:
            console.log('bas')
            break
        
        case 68:
            console.log('right')
            keys.right.pressed = false
            break

        case 90:
            console.log('haut')
            
            break
    }
})