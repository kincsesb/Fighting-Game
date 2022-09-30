// First i need to project setup
// Create player and enemy
// Move character with Event Listener
// Attacks
// Health bar
// Game Timer and Game Over


// Make a playerground
const background = new Sprite({
    position : {
        x: 0,
        y: 0
    },
    imageSrc : './img/background.png'
})

const shop = new Sprite({
    position : {
        x: 600,
        y: 135
    },
    imageSrc : './img/shop.png',
    scale : 2.7,
    framesMax: 6
})

const canvas = document.querySelector('canvas') // Behívjuk a html fileból a canvas-t
const c = canvas.getContext('2d') 
canvas.width = 1024
canvas.height = 512

c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7


const player =  new Fighter({
    position: {
    x : 0,
    y : 0
    },
    velocity: {
    x : 0,
    y : 0
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc : './img/samuraiMack/idle.png',
    framesMax : 8,
    scale: 2.5,
    offset : {
        x:215,
        y:158
    },
    sprites : {
        idle: {
            imageSrc:'./img/samuraiMack/idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc:'./img/samuraiMack/run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc:'./img/samuraiMack/jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc:'./img/samuraiMack/fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc:'./img/samuraiMack/attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc:'./img/samuraiMack/take hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc:'./img/samuraiMack/death.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset:{
            x: 60,
            y: 50
        },
        width: 190,
        height: 50
    }
})


const enemy =  new Fighter({
    position: {
    x : 400,
    y : 100
    },
    velocity: {
    x : 0,
    y : 10
    },
    color : 'blue',
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc : './img/kenji/idle.png',
    framesMax : 4,
    scale: 2.5,
    offset : {
        x:215,
        y:170
    },
    sprites : {
        idle: {
            imageSrc:'./img/kenji/idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc:'./img/kenji/run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc:'./img/kenji/jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc:'./img/kenji/fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc:'./img/kenji/attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc:'./img/kenji/take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc:'./img/kenji/death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset:{
            x: -170,
            y: 50
        },
        width: 180,
        height: 50
    }
})

let lastKey;
let timer = 60;
let timerId;

function decreaseTimer () {

    if(timer > 0){
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer

    }

    if(timer === 0){
        winningCondition({player,enemy,timerId})
}

}

decreaseTimer()

function animate () {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()
    player.update()
    enemy.update()

    //Player movement
    player.velocity.x = 0
    enemy.velocity.x = 0

    if(keys.a.pressed === true && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    } else if(keys.d.pressed === true && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    

    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed === true && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if(keys.ArrowRight.pressed === true && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //Attack detecting 
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    })
           && player.isAttacking && player.framesCurrent === 4
    ){
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }


    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    })
           && enemy.isAttacking && enemy.framesCurrent === 2
    ){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // End a game based on health

    if(enemy.health <= 0 || player.health <= 0){

        winningCondition({player,enemy,timerId})

    }
}

const keys = {
    a : {
        pressed : false
    },
    d : {
        pressed : false
    },
    w : {
        pressed : false
    },
    ArrowRight : {
        pressed : false
    },
    ArrowLeft : {
        pressed : false
    },
    ArrowUp : {
        pressed : false
    }
}

animate()

// d is equal to go right, a is equal to go left, w is equal to jump
window.addEventListener('keydown', (event) => {


    if(!player.dead){
    console.log(player.position.y)

    switch (event.key) 
    {
        case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break;
    
        case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break;

        case 'w':
        player.velocity.y = - 20 // it will go back to the ground because we create gravity 
        break;

        case ' ':
        player.attack()
        break;
    } 
}
    if(!enemy.dead){
    switch(event.key)
    {
        //Enemy movement
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
            
            case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        
            case 'ArrowUp':
            enemy.velocity.y = - 20 // it will go back to the ground because we create gravity 
            break;
            
            case 'ArrowDown':
            enemy.attack()
            break;
    }
}
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
            case 'd':
            keys.d.pressed = false
            break;
    
                case 'a':
                keys.a.pressed = false
                break;

                    case 'w':
                    keys.w.pressed = false
                    break;
    }

    //Enemy movement
                switch (event.key) {
                    case 'ArrowRight':
                    keys.ArrowRight.pressed = false
                    break;
    
                        case 'ArrowLeft':
                        keys.ArrowLeft.pressed = false
                        break;

                            case 'ArrowUp':
                            keys.ArrowUp.pressed = false
                            break;
}
})

//jump
//backgorund border
//left - right