function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

export function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}
  
export function createImageAsync(imageSrc) {
  return new Promise(resolve => {
  const image = new Image()
  image.onload = () => {
    resolve(image)
  }
  image.src = imageSrc
  })
}

export function isOnTopOfPlatforme({object, plateforme}) {
  return (object.position.y + object.height <= plateforme.position.y && object.position.y + object.height + object.velocity.y >=
    plateforme.position.y && object.position.x + object.width >= plateforme.position.x && object.position.x <= plateforme.position.x + plateforme.width) 
}

export function collisionTop({object1, object2}) {
  return (object1.position.y + object1.height <= object2.position.y && object1.position.y + object1.height + object1.velocity.y >=
    object2.position.y && object1.position.x + object1.width >= object2.position.x && object1.position.x <= object2.position.x + object2.width) 
}

export function isOnTopOfPlatformeCircle({object, plateforme}) {
  return (object.position.y + object.radius <= plateforme.position.y && object.position.y + object.radius + object.velocity.y >=
    plateforme.position.y && object.position.x + object.radius >= plateforme.position.x && object.position.x <= plateforme.position.x + plateforme.width) 
}

export function hitBottomOfPlatform({object, plateforme}) {
  return (object.position.y <= plateforme.position.y + plateforme.height &&
     object.position.y - object.velocity.y >= plateforme.position.y + plateforme.height && object.position.x + object.width >= plateforme.position.x
     && object.position.x <= plateforme.position.x + plateforme.width)
}

export function hitSideOfPlatform({object, plateforme}) {
  return (object.position.x + object.width + object.velocity.x - plateforme.velocity.x >= plateforme.position.x
    && object.position.x + object.velocity.x <= plateforme.position.x + plateforme.width
    && object.position.y <= plateforme.position.y + plateforme.height 
    && object.position.y + object.height >= plateforme.position.y)
}

export function objectsTouch({object1, object2}) {
  return (object1.position.x + object1.width >= object2.position.x
    && object1.position.x <= object2.position.x + object2.width
    && object1.position.y + object1.height >= object2.position.y
    && object1.position.y <= object2.position.y + object2.height)
}