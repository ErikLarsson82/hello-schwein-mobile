const rendererHeight = 256
const gameWidth = 260
const gameHeight = 200

const stage = new PIXI.Container()
const renderer = PIXI.autoDetectRenderer(rendererHeight, rendererHeight, {
    antialias: false,
    transparent: false,
    resolution: 1
})
document.body.appendChild(renderer.view)

renderer.view.style.position = "absolute"
renderer.view.style.display = "block"
renderer.view.style.marginLeft = "auto"
renderer.view.style.marginRight = "auto"
renderer.view.style.marginTop = "auto"
renderer.view.style.marginBottom = "auto"
renderer.view.style.left = "0"
renderer.view.style.right = "0"
renderer.view.style.top = "0"
renderer.view.style.bottom = "0"
renderer.view.style.imageRendering = 'pixelated'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST // Default pixel-scaling

function resize() {
    const zoomScaleWidth = (window.innerWidth - (window.innerWidth % gameWidth)) / gameWidth
    const zoomScaleHeight = (window.innerHeight - (window.innerHeight % gameHeight)) / gameHeight
    const zoomScale = Math.min(zoomScaleWidth, zoomScaleHeight)
    renderer.view.style.width = gameWidth * zoomScale + 'px'
    renderer.view.style.height = gameHeight * zoomScale + 'px'
}
window.addEventListener("resize", resize)

resize()

renderer.resize(gameWidth, gameHeight)
renderer.backgroundColor = 0x4b692f
PIXI.loader.add('fox.png')
PIXI.loader.add('bear.png')
PIXI.loader.add('bear_sleeping.png')
PIXI.loader.add('bear_angry.png')
PIXI.loader.add('bush.png')
PIXI.loader.add('logo.png')
PIXI.loader.load(splash)

let pad = 5
let gameStarted = false
let found = false
let fox
let bear
let logo
let running
let bushIndex = -1
let bushes
let bushPos = [
    {x: 20, y: 0},
    {x: 130, y: 50},
    {x: 300, y: 40},
]
let bears
let bearPos = [
    {x: 90, y: 0},
]
let animations = []

window.addEventListener("keydown", e => {
    if (e.keyCode === 32) {
        if (gameStarted) {
            run()
        } else {
            startGame()
        }
    }
})

function run() {
    if (running) return
    running = true
    bushIndex++
    runFox()
}

function runFox() {
    animations.push(animation(fox, [
        { texture: PIXI.Texture.fromImage("fox.png"), time: 5 },
        { texture: PIXI.Texture.fromImage("fox2.png"), time: 5 }
    ]))
}

function cancelAnims() {
    animations = []
}

function animation(sprite, frames) {

    let timer = 0
    let idx = 0

    return function() {
        timer++
        if (timer >= frames[idx].time) {
            timer = 0
            idx++
            if (idx > frames.length - 1) {
                idx = 0    
            }
            sprite.texture = frames[idx].texture
        }
    }
}

function splash() {
    logo = new PIXI.Sprite(PIXI.Texture.fromImage("logo.png"))
    stage.addChild(logo)
    renderer.render(stage)
}

function restartGame() {
    for (var i = stage.children.length - 1; i >= 0; i--) {  stage.removeChild(stage.children[i]);};

    startGame()
}

function startGame() {
    gameStarted = true
    stage.removeChild(logo)

    fox = new PIXI.Sprite(PIXI.Texture.fromImage("fox.png"))
    stage.addChild(fox)

    bears = bearPos.map(pos => {
        const bear = new PIXI.Sprite(PIXI.Texture.fromImage("bear.png"))
        bear.position.x = pos.x
        bear.position.y = pos.y
        bear.INTERVAL = 180
        bear.timer = bear.INTERVAL
        bear.awake = true
        stage.addChild(bear)
        return bear
    })

    bushes = bushPos.map(pos => {
        const bushContainer = new PIXI.Container()
        bushContainer.position.x = pos.x
        bushContainer.position.y = pos.y
        stage.addChild(bushContainer)
        const bush = new PIXI.Sprite(PIXI.Texture.fromImage("bush.png"))
        bush.position.x = -3
        bush.position.y = -3
        bushContainer.addChild(bush)
        return bushContainer
    })

    setInterval(gameloop, 16.6666)
}

function gameloop() {
    animations.forEach(x => x())

    if (running && !found) {
        let bush = bushes[bushIndex]

        if (fox.position.x < bush.position.x) {
            fox.position.x++
        }
        if (fox.position.x > bush.position.x) {
            fox.position.x--
        }
        if (fox.position.y < bush.position.y) {
            fox.position.y++
        }
        if (fox.position.y > bush.position.y) {
            fox.position.y--
        }
        if (fox.position.x === bush.position.x && fox.position.y === bush.position.y) {
            running = false
            cancelAnims()
        }
    }
    if (found) {
        fox.position.x = fox.position.x - 1.5
        fox.scale.x = -1
    }
    bears.forEach(bear => {
        bear.timer--
        if (!found && bear.timer < 0) {
            bear.awake = !bear.awake
            bear.timer = bear.INTERVAL
            bear.texture = PIXI.Texture.fromImage(bear.awake ? "bear.png" : "bear_sleeping.png")
        }
        if (bear.awake && running && bushIndex > 0 && !found) {
            found = true
            animations.push(animation(bear, [
                { texture: PIXI.Texture.fromImage("bear.png"), time: 10 },
                { texture: PIXI.Texture.fromImage("bear_angry.png"), time: 10 },
            ]))
        }
    })
    renderer.render(stage)
}