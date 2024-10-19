// Crear una nueva escena de Phaser llamada "Game"
let gameScene = new Phaser.Scene("Game");

// Inicialización de parámetros para la escena
gameScene.init = function () {
  this.playerSpeed = 300; // Velocidad del jugador
  this.playerJump = -840; // Fuerza de salto del jugador
  this.canJump = false; // Estado para verificar si el jugador puede saltar
};

// Carga de los recursos necesarios para el juego
gameScene.preload = function () {
  // Cargar imágenes de fondo y plataformas
  this.load.image("layer4", "./img/sources/Background/Layer 4.png"); // Capa de fondo
  this.load.image("layer3", "./img/sources/Background/Layer 3.png"); // Capa de parallax
  this.load.image("layer2", "./img/sources/Background/Layer 2.png"); // Capa del suelo
  this.load.image("layer1", "./img/sources/Background/Layer 1.png"); // Capa de adornos
  this.load.image("layer0", "./img/sources/Background/Layer 0.png"); // Capa de efecto de oscuridad

  // Cargar imágenes de plataformas
  this.load.image("plataformLeft", "./img/sources/Plataforms/Left.png"); // Plataforma izquierda
  this.load.image("plataformRight", "./img/sources/Plataforms/Right.png"); // Plataforma derecha
  this.load.image("plataformMidle", "./img/sources/Plataforms/Midle.png"); // Plataforma central

  

  // Cargar sprites del jugador
  this.load.spritesheet("playerIdle", "/img/sources/Character/idle.png", {
    frameWidth: 109,
    frameHeight: 275,
  });
  this.load.spritesheet("playerWalk", "/img/sources/Character/walk.png", {
    frameWidth: 149,
    frameHeight: 275,
  });
  this.load.spritesheet("playerJump", "/img/sources/Character/jump.png", {
    frameWidth: 176,
    frameHeight: 275,
  });

  //Cargar gifts de los props
  this.load.spritesheet("coin", "./img/sources/PowerUps/Gift/Coin.png", {
    frameWidth: 700,
    frameHeight: 700,
  });
  
  

  // Cargar la hoja de sprites de los enemigos
  //this.load.spritesheet("enemy", "/img/enemy.png", {
  //frameWidth: 176,
  //frameHeight: 300,
  //});

  // Cargar datos del nivel desde un archivo JSON
  this.load.json("levelData", "/data/levelData.json");
};

// Configuración del nivel basado en los datos cargados
gameScene.setupLevel = function (levelData) {
  // Por ahora, esta función está vacía, pero puede ser utilizada para configurar
  // elementos del nivel basados en el archivo JSON cargado.
};

// Creación de la escena y configuración de los elementos del juego
gameScene.create = function () {
  // Añadir fondo (capas de fondo con efecto de parallax)
  // Añadir fondo
  this.layer4 = this.add.image(0, 0, "layer4").setOrigin(0, 0).setScrollFactor(0);
  this.layer3 = this.add.image(0, 0, "layer3").setOrigin(0, 0).setScrollFactor(0);
  
  // Crear el grupo de plataformas estáticas
  this.platforms = this.physics.add.staticGroup();
  // Añadir plataformas
  this.platforms.create(400, 700, "plataformMidle").setScale(0.7).refreshBody();
  this.platforms.create(800, 450, "plataformLeft").setScale(0.7).refreshBody();
  this.platforms.create(1200, 400, "plataformRight").setScale(0.7).refreshBody();
  this.platforms.create(1600, 150, "plataformMidle").setScale(0.7).refreshBody();

  // Añadir el layer2 como plataforma colisionable
  this.layer2 = this.physics.add
    .staticImage(0, 900, "layer2")
    .setOrigin(0, 0)
    .setScale(1)
    .refreshBody();

  // Configuración de animaciones del personaje
  //////////////////////////////////////////////////////
  const walk = {
    key: "walk",
    frames: this.anims.generateFrameNumbers("playerWalk", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
    }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(walk);

  const idle = {
    key: "idle",
    frames: this.anims.generateFrameNumbers("playerIdle", {
      frames: [0, 1, 2, 3],
    }),
    frameRate: 4,
    repeat: -1,
  };
  this.anims.create(idle);

  const jump = {
    key: "jump",
    frames: this.anims.generateFrameNumbers("playerJump", {
      frames: [0, 1, 2, 3, 4, 5, 6],
    }),
    frameRate: 6.5,
    repeat: 0,
  };
  this.anims.create(jump);
  ///////////////////////////////////////////////////

  // Configuración de animaciones de los props
  const coinAnimation = {
    key: "coin",
    frames: this.anims.generateFrameNumbers("coin", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(coinAnimation);


  this.gifts = this.physics.add.staticGroup();
  const coin = this.gifts.create(1200, 700, "coin").setScale(0.1).refreshBody();
  coin.anims.play("coin");
    

  // Crear el jugador y configurarlo para colisiones
  this.player = this.physics.add.sprite(100, 100, "playerIdle");
  this.player.setScale(0.6);
  this.player.setCollideWorldBounds(true); // Evitar que el jugador salga de los límites del mundo

  // Configurar los límites de la cámara y el mundo
  this.physics.world.setBounds(0, 0, 5714, 1000); // Ajustar a las dimensiones del fondo
  this.cameras.main.setBounds(0, 0, 5714, 1000); // Tamaño de la cámara
  this.cameras.main.startFollow(this.player); // Seguir al jugador con la cámara

  // Configurar el factor de zoom de la cámara
  let zoomFactor = 1.3;
  this.cameras.main.setZoom(zoomFactor);

  // Habilitar las teclas de dirección para controlar el jugador
  this.cursors = this.input.keyboard.createCursorKeys();

  // Añadir capas de adornos delante del jugador
  this.layer1 = this.add
    .image(0, 0, "layer1")
    .setOrigin(0, 0)
    .setScrollFactor(1);
  this.layer0 = this.add
    .image(0, 0, "layer0")
    .setOrigin(0, 0)
    .setScrollFactor(1);

  // Habilitar la colisión del jugador con las plataformas
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.player, this.layer2);
};

// Actualización de la escena (se ejecuta en cada cuadro)
gameScene.updatePlayerHitbox = function () {
  const animKey = this.player.anims.currentAnim.key;
  if (animKey === "walk") {
    this.player.body.setSize(149, 275); // Tamaño de la imagen de caminar
  } else if (animKey === "idle") {
    this.player.body.setSize(109, 275); // Tamaño de la imagen en reposo
  } else if (animKey === "jump") {
    this.player.body.setSize(109, 275); // Tamaño de la imagen de salto
  }
};

// Actualización de la escena (se ejecuta en cada cuadro)
gameScene.update = function () {
  // Movimiento hacia la izquierda
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-this.playerSpeed);
    this.player.flipX = true; // Voltear el sprite para que mire hacia la izquierda
    if (
      !this.isJumping &&
      (!this.player.anims.isPlaying ||
        this.player.anims.currentAnim.key !== "walk")
    ) {
      this.player.anims.play("walk");
      this.updatePlayerHitbox();
    }
  }
  // Movimiento hacia la derecha
  else if (this.cursors.right.isDown) {
    this.player.setVelocityX(this.playerSpeed);
    this.player.flipX = false; // Orientación normal
    if (
      !this.isJumping &&
      (!this.player.anims.isPlaying ||
        this.player.anims.currentAnim.key !== "walk")
    ) {
      this.player.anims.play("walk");
      this.updatePlayerHitbox();
    }
  }
  // Sin movimiento
  else {
    this.player.setVelocityX(0);
    if (
      !this.isJumping &&
      (!this.player.anims.isPlaying ||
        this.player.anims.currentAnim.key !== "idle")
    ) {
      this.player.anims.play("idle");
      this.updatePlayerHitbox();
    }
  }

  // Salto del jugador
  if (this.cursors.up.isDown && !this.isJumping) {
    this.player.setVelocityY(this.playerJump); // Aplicar fuerza hacia arriba
    this.player.anims.play("jump");
    this.updatePlayerHitbox();
    this.isJumping = true; // Cambiar estado a "en el aire"
  }

  // Verificar si el jugador ha aterrizado
  if (this.player.body.touching.down || this.player.body.blocked.down) {
    if (this.isJumping) {
      this.isJumping = false; // Restablecer estado a "en tierra"
      if (this.player.body.velocity.x === 0) {
        this.player.anims.play("idle");
        this.updatePlayerHitbox();
      } else {
        this.player.anims.play("walk");
        this.updatePlayerHitbox();
      }
    }
  }

  // Efecto de parallax para las capas de fondo
  this.layer4.x = -this.cameras.main.scrollX * 0.1; // Capa más lejana, se mueve más lento
  this.layer4.y = -this.cameras.main.scrollY * 0.1; // Capa más lejana, se mueve más lento

  this.layer3.x = -this.cameras.main.scrollX * 0.3; // Capa intermedia
  this.layer3.y = -this.cameras.main.scrollY * 0.3; // Capa intermedia


};

// Configuración del juego
let config = {
  type: Phaser.AUTO, // Selección automática de renderizado (WebGL o Canvas)
  width: window.innerWidth, // Ancho del juego basado en el ancho de la ventana
  height: window.innerHeight, // Alto del juego basado en el alto de la ventana
  debug: true, // Mostrar información de depuración
  scene: gameScene, // Escena a usar
  physics: {
    default: "arcade", // Motor de físicas
    arcade: {
      gravity: { y: 1400 }, // Gravedad vertical
      debug: true, // Mostrar colisionadores en la pantalla
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE, // Permitir el cambio de tamaño
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centrar el juego en la pantalla
  },
};

// Crear el juego
let game = new Phaser.Game(config);

// Ajustar el tamaño del juego cuando cambia el tamaño de la ventana
window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
