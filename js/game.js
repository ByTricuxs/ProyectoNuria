let gameScene = new Phaser.Scene("Game");

// Parámetros para la escena
gameScene.init = function () {
  this.playerSpeed = 150;
  this.playerJump = -500;
};

// Carga de recursos
gameScene.preload = function () {
    this.load.image("layer4", "./img/sources/Background/Layer 4.png"); // fondo
    this.load.image("layer3", "./img/sources/Background/Layer 3.png"); // parallax
    this.load.image("layer2", "./img/sources/Background/Layer 2.png"); // suelo
    this.load.image("plataformLeft", "./img/sources/Platforms/Left.png");
    this.load.image("plataformRight", "./img/sources/Platforms/Right.png");
    this.load.image("plataformMidle", "./img/sources/Platforms/Midle.png");
    this.load.spritesheet("player", "/img/character.png", {
      frameWidth: 275,
      frameHeight: 300,
    })
    
    
    // Cargar levelData.json
    this.load.json('levelData', '/data/levelData.json');
  }
  
  // Configuración del nivel
  gameScene.setupLevel = function (levelData) {
    
  }
  
  // Creación de la escena
  gameScene.create = function () {
    const walk ={
      key:"walk",
      frames: this.anims.generateFrameNumbers("player", {frames: [16, 17, 18, 19, 20, 21, 22, 23]}),
      frameRate: 10,
      repeat: -1
    }
    this.anims.create(walk)
    this.player =this.add.sprite(100, 100, "player")
    this.player.play("walk", true)
  }
  

// Actualizar la escena
gameScene.update = function () {
  
};

// Configuración del juego
let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  debug: true,
  scene: gameScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: true,
    },
  },
};

// Crear el juego
let game = new Phaser.Game(config);
