// Crear una nueva escena de Phaser llamada "Game"
let gameScene = new Phaser.Scene("Game");

// Inicialización de parámetros para la escena
gameScene.init = function () {
  this.playerSpeed = 300; // Velocidad del jugador
  this.playerJump = -840; // Fuerza de salto del jugador
  this.canJump = false; // Estado para verificar si el jugador puede saltar
  this.isTransforming = false;
  lives = 3;
  coinsCount = 0;
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
  this.load.spritesheet(
    "transformation",
    "/img/sources/PowerUps/Transformation/Transformation.png",
    {
      frameWidth: 220,
      frameHeight: 275,
    }
  );

  //Cargar gifts de los props
  this.load.spritesheet("coin", "./img/sources/PowerUps/Gift/Coin.png", {
    frameWidth: 700,
    frameHeight: 700,
  });
  this.load.spritesheet(
    "bottle",
    "./img/sources/PowerUps/HealthPack/Bottle.png",
    {
      frameWidth: 700,
      frameHeight: 700,
    }
  );
  this.load.spritesheet(
    "magicStone",
    "./img/sources/PowerUps/PowerUp/Magic_Stone.png",
    {
      frameWidth: 700,
      frameHeight: 700,
    }
  );

  // Cargar la hoja de sprites de los enemigos
  this.load.spritesheet("enemy1", "/img/sources/Enemy1/Enemy_1.png", {
    frameWidth: 600,
    frameHeight: 900,
  });
  this.load.spritesheet("enemy2", "/img/sources/Enemy2/Enemy_2.png", {
    frameWidth: 700,
    frameHeight: 700,
  });
  this.load.spritesheet("enemy3", "/img/sources/Enemy3/Enemy_3.png", {
    frameWidth: 500,
    frameHeight: 500,
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
  this.layer4 = this.add
    .image(0, 0, "layer4")
    .setOrigin(0, 0)
    .setScrollFactor(0);
  this.layer3 = this.add
    .image(0, 0, "layer3")
    .setOrigin(0, 0)
    .setScrollFactor(0);

  // Crear el grupo de plataformas estáticas
  this.platforms = this.physics.add.staticGroup();
  // Añadir plataformas
  this.platforms.create(400, 700, "plataformMidle").setScale(0.7).refreshBody();
  this.platforms.create(800, 450, "plataformLeft").setScale(0.7).refreshBody();
  this.platforms
    .create(1200, 400, "plataformRight")
    .setScale(0.7)
    .refreshBody();
  this.platforms
    .create(1600, 150, "plataformMidle")
    .setScale(0.7)
    .refreshBody();

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

  const transform = {
    key: "transformation",
    frames: this.anims.generateFrameNumbers("transformation", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
    }),
    frameRate: 5,
    repeat: 0,
  };
  this.anims.create(transform);
  ///////////////////////////////////////////////////

  // Configuración de animaciones de los props
  const coinAnimation = {
    key: "coin",
    frames: this.anims.generateFrameNumbers("coin", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
    }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(coinAnimation);

  const bottleAnimation = {
    key: "bottle",
    frames: this.anims.generateFrameNumbers("bottle", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
    }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(bottleAnimation);

  const magicStoneAnimation = {
    key: "magicStone",
    frames: this.anims.generateFrameNumbers("magicStone", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
    }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(magicStoneAnimation);

  //Animacion de los enemigos
  const enemy1Animation = {
    key: "enemy1",
    frames: this.anims.generateFrameNumbers("enemy1", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
    }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(enemy1Animation);

  const enemy2Animation = {
    key: "enemy2",
    frames: this.anims.generateFrameNumbers("enemy2", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
    }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(enemy2Animation);

  const enemy3Animation = {
    key: "enemy3",
    frames: this.anims.generateFrameNumbers("enemy3", {
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
    }),
    frameRate: 8,
    repeat: -1,
  };
  this.anims.create(enemy3Animation);

  this.enemies = this.physics.add.staticGroup();
  const enemy1 = this.enemies
    .create(2000, 700, "enemy1")
    .setScale(0.3)
    .refreshBody();
  enemy1.anims.play("enemy1"); // Reproducir la animación "enemy1"

  const enemy2 = this.enemies
    .create(2300, 700, "enemy2")
    .setScale(0.3)
    .refreshBody();
  enemy2.anims.play("enemy2"); // Reproducir la animación "enemy2"

  const enemy3 = this.enemies
    .create(2600, 700, "enemy3")
    .setScale(0.3)
    .refreshBody();
  enemy3.anims.play("enemy3"); // Reproducir la animación "enemy3"

  this.gifts = this.physics.add.staticGroup();

  const coin = this.gifts.create(800, 700, "coin").setScale(0.1).refreshBody();
  coin.anims.play("coin");

  const bottle = this.gifts
    .create(1000, 700, "bottle")
    .setScale(0.1)
    .refreshBody();
  bottle.anims.play("bottle");

  const magicStone = this.gifts
    .create(1200, 800, "magicStone")
    .setScale(0.1)
    .refreshBody();
  magicStone.anims.play("magicStone");

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
  // Configurar la detección de colisiones con los regalos en la función create
  this.physics.add.overlap(
    this.player,
    this.gifts,
    this.collectGifts,
    null,
    this
  );
  this.physics.add.overlap(this.player, this.enemies, hitEnemies, null, this);
  this.physics.add.collider(this.player, this.layer2);

  updateLivesText(this);
  updateCoinsText(this);
};

// Función para recoger los regalos
gameScene.collectGifts = function (player, gift) {
  // Aquí verificamos el tipo de objeto recogido para activar la acción correspondiente
  switch (gift.texture.key) {
    case "coin":
      this.collectCoin(player, gift);
      break;
    case "bottle":
      this.collectBottle(player, gift);
      break;
    case "magicStone":
      this.collectMagicStone(player, gift); // Transformación independiente
      break;
  }

  // Destruir el objeto recogido
  gift.destroy();
};

gameScene.collectCoin = function (player, coin) {
  console.log("¡Obtuviste una moneda!");
  coinsCount += 1;
  updateCoinsText(this);
};

// Función para manejar la recolección de la botella (sumar una vida)
gameScene.collectBottle = function (player, bottle) {
  console.log("¡Has recuperado una vida!");
  lives += 1;
  updateLivesText(this);
};

// Función para manejar la recolección de la piedra mágica (animación de transformación)
gameScene.collectMagicStone = function (player, magicStone) {
  if (this.isTransforming) return; // Evitar múltiples transformaciones simultáneas
  this.isTransforming = true; // Establecer que se está transformando

  // Desactivar el movimiento del jugador completamente
  player.setVelocity(0, 0); // Detener el movimiento
  player.body.moves = false; // Desactivar el movimiento del cuerpo del jugador
  player.body.allowGravity = false; // Desactivar la gravedad temporalmente

  // Deshabilitar el input mientras dura la transformación
  this.input.keyboard.enabled = false;

  // Detener cualquier animación anterior
  player.anims.stop();

  // Iniciar la animación de transformación
  player.anims.play("transformation");

  // Una vez que la animación de transformación termine
  player.on("animationcomplete-transformation", () => {
    this.isTransforming = false; // La transformación ha terminado

    // Restaurar el cuerpo del jugador y permitir gravedad de nuevo
    
    player.body.moves = true;
    player.body.allowGravity = true;

    // Restaurar el input del teclado para permitir movimiento
    this.input.keyboard.enabled = true;

    // Restaurar la animación adecuada según el estado del jugador
    if (player.body.touching.down) {
      player.setVelocity(0, 0);
      player.anims.play("idle"); // Si está en el suelo, animación idle
    } else {
      player.setVelocity(0, 0);
      player.anims.play("jump"); // Si está en el aire, animación de salto
    }
  });

  // Destruir la piedra mágica
  magicStone.destroy();
};

function hitEnemies(player, enemy) {
  console.log("Colisión con enemigo detectada");
  lives -= 1;
  updateLivesText(this);

  if (lives >= 0) {
    console.log(`¡Te queda(n) ${lives} vida(s)!`);
    player.setPosition(100, 100);
  }
}

function updateTextPositions(scene) {
  if (scene.livesText) {
      scene.livesText.setPosition(16, 16);
  }
  if (scene.coinsText) {
      scene.coinsText.setPosition(16, 48);
  }
}

// Función para actualizar el texto de vidas en pantalla
function updateLivesText(scene) {
  if (!scene.livesText) {
      scene.livesText = scene.add.text(16, 16, `Vidas: ${lives}`, {
          fontSize: "32px",
          fill: "#FFF",
      });
  } else {
      scene.livesText.setText(`Vidas: ${lives}`);
  }
}

// Función para actualizar el texto de monedas en pantalla
function updateCoinsText(scene) {
  if (!scene.coinsText) {
      scene.coinsText = scene.add.text(16, 48, `Monedas: ${coinsCount}`, {
          fontSize: "32px",
          fill: "#FFF",
      });
  } else {
      scene.coinsText.setText(`Monedas: ${coinsCount}`);
  }
}

// Actualización de la escena (se ejecuta en cada cuadro)
gameScene.updatePlayerHitbox = function () {
  if (this.isTransforming) return; // Evitar cambios de hitbox mientras se transforma

  const animKey = this.player.anims.currentAnim
    ? this.player.anims.currentAnim.key
    : null;
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
  // Evitar actualizar si está en transformación
  if (this.isTransforming) return;
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
    this.player.setVelocityX(0); // Detener movimiento horizontal
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
        this.player.anims.play("idle"); // Reproducir animación de idle si no se está moviendo
        this.updatePlayerHitbox();
      } else {
        this.player.anims.play("walk"); // Reproducir animación de caminar si se está moviendo
        this.updatePlayerHitbox();
      }
    }
  }

  updateTextPositions(this);
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
  updateTextPositions(game.scene.keys.Game);
});
