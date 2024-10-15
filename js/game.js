let gameScene = new Phaser.Scene('Game');

//player
let player;
let lives = 3;

gameScene.preload = function () {

};

gameScene.create = function () {
    gameW = this.sys.game.config.width;
    gameH = this.sys.game.config.height;

    //player
    player = this.physics.add.sprite(90, 1000 / 2, 'player');
    player.setScale(0.5);
    player.depth = 5;
    player.body.collideWorldBounds = true;

    this.cursors = this.input.keyboard.createCursorKeys();

}

gameScene.update = function () {
    if (this.cursors.left.isDown) {
        player.setVelocityX(-150);
    } else if (this.cursors.right.isDown) {
        player.setVelocityX(150);
    } else {
        player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        player.setVelocityY(-150);
    } else if (this.cursors.down.isDown) {
        player.setVelocityY(150);
    } else {
        player.setVelocityY(0);
    }

    /*
    //Enemy movement
        enemys.forEach(enemy => {
            if (enemy.body.velocity.x > 0) {
                if (enemy.x >= gameW - 50) { 
                    enemy.body.velocity.x *= -1; 
                }
            } else { 
                if (enemy.x <= 50) { 
                    enemy.body.velocity.x *= -1; 
                }
            }
        });
        */  
}

// our game's configuration
let config = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.8,
    scene: gameScene,
    title: 'Nurias shadows - Game',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true
        }
    }
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);