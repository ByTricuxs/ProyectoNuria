// Crear una nueva escena de Phaser llamada "Game"
let gameScene = new Phaser.Scene("Game");

// Inicialización de parámetros para la escena
gameScene.init = function () {
  this.playerSpeed = 300; // Velocidad del jugador
  this.playerJump = -840; // Fuerza de salto del jugador
  this.canJump = false;    // Estado para verificar si el jugador puede saltar
};

// Carga de los recursos necesarios para el juego
gameScene.preload = function () {
  // Cargar imágenes de fondo y plataformas
  this.load.image("layer4", "./img/sources/Background/Layer 4.png"); // Capa de fondo
  this.load.image("layer3", "./img/sources/Background/Layer 3.png"); // Capa de parallax
  this.load.image("layer2", "./img/sources/Background/Layer 2.png"); // Capa del suelo
  this.load.image("layer1", "./img/sources/Background/Layer 1.png"); // Capa de adornos
  this.load.image("layer0", "./img/sources/Background/Layer 0.png"); // Capa de efecto de oscuridad
  this.load.image("plataformLeft", "./img/sources/Platforms/Left.png"); // Plataforma izquierda
  this.load.image("plataformRight", "./img/sources/Platforms/Right.png"); // Plataforma derecha
  this.load.image("plataformMidle", "./img/sources/Platforms/Midle.png"); // Plataforma central

  // Cargar la hoja de sprites del personaje
  this.load.spritesheet("player", "/img/character.png", {
    frameWidth: 275,
    frameHeight: 300,
  });

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
  this.layer4 = this.add.image(0, 0, "layer4").setOrigin(0, 0).setScrollFactor(0); // Fondo más lejano
  this.layer3 = this.add.image(0, 0, "layer3").setOrigin(0, 0).setScrollFactor(0); // Fondo intermedio

  // Crear un grupo de plataformas estáticas y añadir la capa del suelo (layer2)
  this.platforms = this.physics.add.staticGroup();
  this.layer2 = this.platforms
    .create(0, 780, "layer2") // Posicionar el suelo
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .refreshBody(); // Refrescar el cuerpo físico para que coincida con la imagen

  // Configuración de animaciones del personaje
  //////////////////////////////////////////////////////
  const walk = {
    key: "walk",
    frames: this.anims.generateFrameNumbers("player", { frames: [16, 17, 18, 19, 20] }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(walk);

  const idle = {
    key: "idle",
    frames: this.anims.generateFrameNumbers("player", { frames: [0, 1, 2, 3] }),
    frameRate: 4,
    repeat: -1,
  };
  this.anims.create(idle);

  const jump = {
    key: "jump",
    frames: this.anims.generateFrameNumbers("player", { frames: [5, 6, 7, 8, 9, 10, 11, 12, 13] }),
    frameRate: 4.5,
    repeat: 0,
  };
  this.anims.create(jump);
  ///////////////////////////////////////////////////

  // Crear el jugador y configurarlo para colisiones
  this.player = this.physics.add.sprite(100, 100, "player");
  this.player.setScale(0.7);
  this.player.setCollideWorldBounds(true); // Evitar que el jugador salga de los límites del mundo

  // Configurar los límites de la cámara y el mundo
  this.physics.world.setBounds(0, 0, 5143, 900); // Tamaño del mundo
  this.cameras.main.setBounds(0, 0, 5143, 900); // Tamaño de la cámara
  this.cameras.main.startFollow(this.player); // Seguir al jugador con la cámara

  // Configurar el factor de zoom de la cámara
  let zoomFactor = 1;
  this.cameras.main.setZoom(zoomFactor);

  // Habilitar las teclas de dirección para controlar el jugador
  this.cursors = this.input.keyboard.createCursorKeys();

  // Añadir capas de adornos delante del jugador
  this.layer1 = this.add.image(0, 0, "layer1").setOrigin(0, 0).setScrollFactor(1);
  this.layer0 = this.add.image(0, 0, "layer0").setOrigin(0, 0).setScrollFactor(1);

  // Habilitar la colisión del jugador con las plataformas
  this.physics.add.collider(this.player, this.platforms);

};

// Actualización de la escena (se ejecuta en cada cuadro)
gameScene.update = function () {
  // Movimiento hacia la izquierda
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-this.playerSpeed);
    this.player.flipX = true; // Voltear el sprite para que mire hacia la izquierda
    if (!this.isJumping && (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "walk")) {
      this.player.anims.play("walk");
    }
  }
  // Movimiento hacia la derecha
  else if (this.cursors.right.isDown) {
    this.player.setVelocityX(this.playerSpeed);
    this.player.flipX = false; // Orientación normal
    if (!this.isJumping && (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "walk")) {
      this.player.anims.play("walk");
    }
  }
  // Sin movimiento horizontal
  else {
    this.player.setVelocityX(0);
    if (!this.isJumping && (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "idle")) {
      this.player.anims.play("idle");
    }
  }

  // Salto del jugador
  if (this.cursors.up.isDown && !this.isJumping) {
    this.player.setVelocityY(this.playerJump); // Aplicar fuerza hacia arriba
    this.player.anims.play("jump");
    this.isJumping = true; // Cambiar estado a "en el aire"
  }
  // Saltar
  if (this.cursors.up.isDown && !this.isJumping && this.player.body.touching.down) {
    this.player.setVelocityY(this.playerJump); // Aplicar fuerza de salto
    this.player.anims.play("salto"); // Reproducir la animación de salto
    this.isJumping = true; // Cambiar estado a "en el aire"
  }

  // Verificar si el jugador ha aterrizado
  if (this.player.body.touching.down || this.player.body.blocked.down) {
    if (this.isJumping) {
      this.isJumping = false; // Restablecer estado a "en tierra"
      if (this.player.body.velocity.x === 0) {
        this.player.anims.play("idle");
      } else {
        this.player.anims.play("walk");
      }
    }
  }
  // Verificar si el jugador ha aterrizado
  if (this.player.body.touching.down || this.player.body.blocked.down) {
    if (this.isJumping) {
      this.isJumping = false; // Cambiar estado a "en tierra"
      if (this.player.body.velocity.x === 0) {
        this.player.anims.play("quieto");
      } else {
        this.player.anims.play("walk");
      }
    }
  }
};

  gameScene.update = function () {
    // Movimiento hacia la izquierda
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.flipX = true; // Voltear el sprite para que mire hacia la izquierda
  
      if (!this.isJumping && (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "walk")) {
        this.player.anims.play("walk");
      }
    }
    // Movimiento hacia la derecha
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.flipX = false; // Orientación normal
  
      if (!this.isJumping && (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "walk")) {
        this.player.anims.play("walk");
      }
    }
    // Sin movimiento horizontal
    else {
      this.player.setVelocityX(0);
  
      if (!this.isJumping && (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== "quieto")) {
        this.player.anims.play("quieto");
      }
    }
  
    
  
    

  // Efecto de parallax para las capas de fondo
  this.layer4.x = -this.cameras.main.scrollX * 0.3; // Capa más lejana, se mueve más lento
  this.layer3.x = -this.cameras.main.scrollX * 0.6; // Capa intermedia
  this.layer2.x = -this.cameras.main.scrollX * 0.9; // Capa más cercana al jugador
};

// Configuración del juego
let config = {
  type: Phaser.AUTO, // Selección automática de renderizado (WebGL o Canvas)
  width: 1715,       // Ancho del juego
  height: 900,       // Alto del juego
  debug: true,       // Mostrar información de depuración
  scene: gameScene,  // Escena a usar
  physics: {
    default: "arcade", // Motor de físicas
    arcade: {
      gravity: { y: 1000 }, // Gravedad vertical
      debug: true,          // Mostrar colisionadores en la pantalla
    },
  },
};

// Crear el juego
let game = new Phaser.Game(config);
