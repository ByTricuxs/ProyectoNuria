let gameScene = new Phaser.Scene("Game");

// Parámetros para la escena
gameScene.init = function () {
  this.playerSpeed = 150;
  this.playerJump = -500;
};

// Carga de recursos
// Carga de recursos
gameScene.preload = function () {
    this.load.image("layer4", "/img/sources/Background/Layer 4.png"); // fondo
    this.load.image("layer3", "/img/sources/Background/Layer 3.png"); // parallax
    this.load.image("layer2", "/img/sources/Background/Layer 2.png"); // suelo
    this.load.image("plataformLeft", "/img/sources/Platforms/Left.png");
    this.load.image("plataformRight", "/img/sources/Platforms/Right.png");
    this.load.image("plataformMidle", "/img/sources/Platforms/Midle.png");
    this.load.spritesheet("character", "/img/sources/Character/character.png", {
      frameWidth: 200,
      frameHeight: 250,
      margin: 1,
      spacing: 1,
    });
    
    // Cargar levelData.json
    this.load.json('levelData', 'levelData.json');
  };
  
  // Configuración del nivel
  gameScene.setupLevel = function (levelData) {
    // Crear al jugador
    this.player = this.physics.add.sprite(levelData.player.x, levelData.player.y, "character", levelData.player.frame);
    this.player.setCollideWorldBounds(true);
  
    // Configurar plataformas
    this.platforms = this.physics.add.staticGroup();
    levelData.platforms.forEach(platform => {
      let x = platform.x;
      let y = platform.y;
      for (let i = 0; i < platform.tiles; i++) {
        let tileKey = platform.key === "ground" ? "layer2" : "plataformMidle";
        let tile = this.platforms.create(x, y, tileKey);
        tile.setOrigin(0, 0);
        x += tile.width; // Ajustar la posición para la siguiente pieza
      }
    });
  
    // Agregar el objetivo
    this.goal = this.add.sprite(levelData.goal.x, levelData.goal.y, "character", levelData.goal.frame);
  
    // Colisiones
    this.physics.add.collider(this.player, this.platforms);
  };
  
  // Creación de la escena
  gameScene.create = function () {
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;
  
    // Fondo
    this.add.image(gameW / 2, gameH / 2, "layer4").setScrollFactor(0);
  
    // Parallax
    this.parallaxLayer = this.add.tileSprite(0, gameH - 400, gameW, 400, "layer3").setOrigin(0, 0);
    this.parallaxLayer.setScrollFactor(0.5); // Ajuste para el efecto parallax
  
    // Cargar los datos del nivel desde el JSON
    const levelData = this.cache.json.get('levelData');
  
    // Llamar a setupLevel con los datos del nivel
    this.setupLevel(levelData);
  
    // Crear animaciones
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("character", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("character", { start: 4, end: 19 }),
      frameRate: 10,
      repeat: 0,
    });
  
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("character", { start: 20, end: 35 }),
      frameRate: 10,
      repeat: -1
    });
  
    // Configurar los controles
    this.cursors = this.input.keyboard.createCursorKeys();
  
    // Configuración de la cámara para seguir al jugador
    this.cameras.main.setBounds(0, 0, gameW, gameH);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
  };
  

// Actualizar la escena
gameScene.update = function () {
  let onGround = this.player.body.blocked.down || this.player.body.touching.down;

  // Movimiento del jugador
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-this.playerSpeed);
    if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "walk") {
      this.player.anims.play("walk");
    }
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(this.playerSpeed);
    if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "walk") {
      this.player.anims.play("walk");
    }
  } else {
    this.player.setVelocityX(0);
    if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "idle") {
      this.player.anims.play("idle");
    }
  }

  // Salto
  if ((this.cursors.up.isDown || this.cursors.space.isDown) && onGround) {
    this.player.setVelocityY(this.playerJump);
    this.player.anims.play("jump");
  }

  // Efecto parallax
  this.parallaxLayer.tilePositionX = this.cameras.main.scrollX * 0.5;
};

// Configuración del juego
let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
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
