console.log('main.js loading')

function game() {
    console.log('game')

    var rendererHeight = 256
    var gameWidth = 800
    var gameHeight = 600

    var stage = new PIXI.Container()
    var renderer = PIXI.autoDetectRenderer(rendererHeight, rendererHeight, {
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

    renderer.resize(gameWidth, gameHeight)
    renderer.backgroundColor = 0x4b692f
    PIXI.loader.add('logo.png')
    
    window.addEventListener("keydown", function(e) {
        console.log('keyboard start',e.keyCode)
        if (e.keyCode === 32) {
            speed = 20
        }
    })

    window.addEventListener("keyup", function(e) {
        console.log('keyboard end')
        if (e.keyCode === 32) {
            speed = 1
        }
    })

    window.addEventListener("touchstart", function(e) {
        console.log('touch start', e)
        speed = 20
    })

    window.addEventListener("touchend", function(e) {
        console.log('touch end', e)
        speed = 1
    })

    window.addEventListener("touchcancel", function(e) {
        console.log('touch cancel', e)
        speed = 1
    })

    window.addEventListener("touchmove", function(e) {
        console.log('touch move', e)
    })

    var text = new PIXI.Text('Hello Schwein', {fill : 0xffffff})
    stage.addChild(text)

    var logo = new PIXI.Sprite(PIXI.Texture.fromImage('logo.png'))
    logo.position.y = 50
    stage.addChild(logo)

    var ticks = 0
    var speed = 1

    function gameTick() {
        ticks = ticks + speed
        logo.position.x = 50 + (Math.sin(ticks/100) * 30) //(Math.round(Math.sin(ticks/100)) * 50) + 10

        renderer.render(stage)
    }

    setInterval(gameTick, 16.666)
}