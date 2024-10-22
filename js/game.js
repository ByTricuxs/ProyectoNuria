const PLAYER_SCALE = 0.6;
const PLATFORM_SCALE = 0.7;
const ENEMY_SCALE = 0.3;
const GIFT_SCALE = 0.1;
const ZOOM_FACTOR = 1.3;
const WORLD_BOUNDS = { width: 5714, height: 1000 };
const PLAYER_DIMENSIONS = {
  walk: [240, 435],
  idle: [140, 435],
  jump: [140, 435],
};

// Crear una nueva escena de Phaser llamada "Game"
let gameScene = new Phaser.Scene("Game");

// Inicialización de parámetros para la escena
gameScene.init = function () {
  this.playerSpeed = 300;
  this.playerJump = -880;
  this.canJump = false;
  this.isTransforming = false;
  this.lives = 3;
  this.coinsCount = 0;
  updateLivesText(this);
  updateCoinsText(this);
};

// Carga de los recursos necesarios para el juego
gameScene.preload = function () {
  // Cargar imágenes y sprites
  const images = [
    ["layer4", "./img/sources/Background/Layer 4.png"],
    ["layer3", "./img/sources/Background/Layer 3.png"],
    ["layer2", "./img/sources/Background/Layer 2.png"],
    ["layer1", "./img/sources/Background/Layer 1.png"],
    ["layer0", "./img/sources/Background/Layer 0.png"],
    ["plataformLeft", "./img/sources/Plataforms/Left.png"],
    ["plataformRight", "./img/sources/Plataforms/Right.png"],
    ["plataformMidle", "./img/sources/Plataforms/Midle.png"],
  ];

  const spritesheets = [
    ["playerIdle", "/img/sources/Character/idle.png", 109, 275],
    ["playerWalk", "/img/sources/Character/walk.png", 149, 275],
    ["playerJump", "/img/sources/Character/jump.png", 176, 275],
    [
      "transformation",
      "/img/sources/PowerUps/Transformation/Transformation.png",
      220,
      275,
    ],
    ["coin", "./img/sources/PowerUps/Gift/Coin.png", 700, 700],
    ["bottle", "./img/sources/PowerUps/HealthPack/Bottle.png", 700, 700],
    ["magicStone", "./img/sources/PowerUps/PowerUp/Magic_Stone.png", 700, 700],
    ["enemy1", "/img/sources/Enemy1/Enemy_1.png", 600, 900],
    ["enemy2", "/img/sources/Enemy2/Enemy_2.png", 700, 700],
    ["enemy3", "/img/sources/Enemy3/Enemy_3.png", 500, 500],
  ];

  images.forEach(([key, path]) => this.load.image(key, path));
  spritesheets.forEach(([key, path, frameWidth, frameHeight]) => {
    this.load.spritesheet(key, path, { frameWidth, frameHeight });
  });

  this.load.json("levelData", "/data/levelData.json");
};

// Función para crear animaciones reutilizable
gameScene.createAnimation = function (
  key,
  spriteKey,
  frames,
  frameRate,
  repeat = -1
) {
  this.anims.create({
    key,
    frames: this.anims.generateFrameNumbers(spriteKey, { frames }),
    frameRate,
    repeat,
  });
};

// Creación de la escena y configuración de los elementos del juego
gameScene.create = function () {
  const createLayer = (key, scrollFactor = 0) =>
    this.add.image(0, 0, key).setOrigin(0, 0).setScrollFactor(scrollFactor);

  // Capas de fondo
  this.layer4 = createLayer("layer4");
  this.layer3 = createLayer("layer3");

  // Crear plataformas
  this.platforms = this.physics.add.staticGroup();

  // Cargar datos desde el JSON
  const levelData = this.cache.json.get("levelData");

  // Crear plataformas a partir de los datos del JSON
  levelData.platforms.forEach((platform) => {
    const platformKey = platform.type; // Usar el tipo desde el JSON
    this.platforms
      .create(platform.x, platform.y, platformKey)
      .setScale(PLATFORM_SCALE)
      .refreshBody();
  });

  // Agregar suelos y otras plataformas (puedes incluir estas directamente o también desde JSON)
  this.layer2 = this.physics.add
    .staticImage(0, 900, "layer2")
    .setOrigin(0, 0)
    .setScale(1)
    .refreshBody();

  // Crear animaciones
  this.createAnimations();

  // Enemigos
  this.enemies = this.physics.add.staticGroup();
  levelData.enemies.forEach((enemy) => {
    const newEnemy = this.enemies
      .create(enemy.x, enemy.y, enemy.key)
      .setScale(ENEMY_SCALE)
      .refreshBody();
    newEnemy.anims.play(enemy.key);
  });

  // Regalos (gifts)
  this.gifts = this.physics.add.staticGroup();
  levelData.gifts.forEach((gift) => {
    const newGift = this.gifts
      .create(gift.x, gift.y, gift.key)
      .setScale(GIFT_SCALE)
      .refreshBody();
    newGift.anims.play(gift.key);
  });

  // Configuración del jugador
  const playerData = levelData.player;
  this.player = this.physics.add
    .sprite(playerData.x, playerData.y, playerData.key)
    .setScale(PLAYER_SCALE)
    .setCollideWorldBounds(true);

  // Configurar mundo y cámara
  this.physics.world.setBounds(0, 0, WORLD_BOUNDS.width, WORLD_BOUNDS.height);
  this.cameras.main
    .setBounds(0, 0, WORLD_BOUNDS.width, WORLD_BOUNDS.height)
    .startFollow(this.player)
    .setZoom(ZOOM_FACTOR);

  // Controles del jugador
  this.cursors = this.input.keyboard.createCursorKeys();

  // Configurar colisiones
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.player, this.layer2);
  this.physics.add.overlap(
    this.player,
    this.gifts,
    this.collectGifts,
    null,
    this
  );
  this.physics.add.overlap(
    this.player,
    this.enemies,
    this.hitEnemies,
    null,
    this
  );

  // Añadir capas de adornos
  createLayer("layer1", 1);
  createLayer("layer0", 1);
};

gameScene.createAnimations = function () {
  this.createAnimation("walk", "playerWalk", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("idle", "playerIdle", [0, 1, 2, 3], 4);
  this.createAnimation("jump", "playerJump", [0, 1, 2, 3, 4, 5, 6], 6.5, 0);
  this.createAnimation(
    "transformation",
    "transformation",
    [0, 1, 2, 3, 4, 5, 6, 7],
    5,
    0
  );

  // Animaciones de props
  this.createAnimation("coin", "coin", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("bottle", "bottle", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("magicStone", "magicStone", [0, 1, 2, 3, 4, 5, 6, 7], 8);

  // Animaciones de enemigos
  this.createAnimation("enemy1", "enemy1", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("enemy2", "enemy2", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("enemy3", "enemy3", [0, 1, 2, 3, 4, 5, 6, 7], 8);
};

// Función para recoger regalos (gifts)
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

  gift.destroy();
};

// Función para manejar la recolección de la moneda (sumar una moneda)
gameScene.collectCoin = function (player, coin) {
  console.log("¡Obtuviste una moneda!");
  this.coinsCount += 1;
  updateCoinsText(this);
  // Verifica si se han recogido 3 monedas
  if (this.coinsCount === 3) {
    showVictoryMessage();
    player.setVelocity(0, 0);
  }
};

// Función para manejar la recolección de la botella (sumar una vida)
gameScene.collectBottle = function (player, bottle) {
  console.log("¡Has recuperado una vida!");
  this.lives += 1;
  updateLivesText(this);
};

// Función para manejar la recolección de la piedra mágica (animación de transformación)
gameScene.collectMagicStone = function (player, magicStone) {
  if (this.isTransforming) return;
  this.isTransforming = true;
  player.setVelocity(0, 0);
  player.body.moves = false;
  player.body.allowGravity = false;
  this.input.keyboard.enabled = false;
  player.anims.stop();
  player.anims.play("transformation");
  player.on("animationcomplete-transformation", () => {
    this.isTransforming = false;
    player.setVelocity(0, 0);
    player.body.moves = true;
    player.body.allowGravity = true;
    this.input.keyboard.enabled = true;
    if (player.body.touching.down) {
      player.setVelocity(0, 0);
      player.anims.play("idle");
    } else {
      player.setVelocity(0, 0);
      player.anims.play("jump");
    }
  });
  magicStone.destroy();
};

// Función para manejar colisión con enemigos
gameScene.hitEnemies = function (player, enemy) {
  console.log("Colisión con enemigo detectada");

  if (this.lives === 1) {
    console.log("¡Has perdido tu última vida! Reiniciando el nivel...");
    this.scene.stop(); // Detener la escena actual
    player.setVelocity(0, 0);
    player.body.moves = false;
    player.body.allowGravity = false;
    this.input.keyboard.enabled = false;
    this.scene.start("Game"); // Iniciar la escena nuevamente
    updateCoinsText(this);
    updateLivesText(this);
    showMessage();
  } else {
    // Restar vida
    this.lives -= 1;
    updateLivesText(this);
    console.log(`¡Te queda(n) ${this.lives} vida(s)!`);
    player.setPosition(100, 817); // Opcional: reiniciar posición del jugador
  }
};

function showMessage() {
  const messageDiv = document.getElementById("message");
  messageDiv.classList.remove("hidden");
  messageDiv.classList.add("visible");

  setTimeout(() => {
    messageDiv.classList.remove("visible");
    messageDiv.classList.add("hidden");
  }, 6000);
}

function showVictoryMessage(player) {
  const victoryMessage = document.getElementById("victoryMessage");
  victoryMessage.classList.remove("hidden");
  victoryMessage.classList.add("visible");

  setTimeout(() => {
    victoryMessage.classList.remove("visible");
    victoryMessage.classList.add("hidden");
  }, 6000);
}

function updateLivesText(scene) {
  // Acceder al elemento HTML y actualizar el texto
  const livesTextElement = document.getElementById("livesText");
  if (livesTextElement) {
    livesTextElement.textContent = `Vidas: ${scene.lives}`;
  }
}

function updateCoinsText(scene) {
  // Acceder al elemento HTML y actualizar el texto
  const coinsTextElement = document.getElementById("coinsText");
  if (coinsTextElement) {
    coinsTextElement.textContent = `Monedas: ${scene.coinsCount}`;
  }
}

gameScene.updatePlayerHitbox = function () {
  // Dependiendo de la animación actual, ajustar el tamaño del hitbox del jugador
  const currentAnimKey = this.player.anims.currentAnim
    ? this.player.anims.currentAnim.key
    : "idle";

  let width, height;

  switch (currentAnimKey) {
    case "walk":
      width = PLAYER_DIMENSIONS.walk[0];
      height = PLAYER_DIMENSIONS.walk[1];
      break;
    case "idle":
      width = PLAYER_DIMENSIONS.idle[0];
      height = PLAYER_DIMENSIONS.idle[1];
      break;
    case "jump":
      width = PLAYER_DIMENSIONS.jump[0];
      height = PLAYER_DIMENSIONS.jump[1];
      break;
    default:
      width = PLAYER_DIMENSIONS.idle[0];
      height = PLAYER_DIMENSIONS.idle[1];
  }

  // Redimensionar el hitbox del jugador
  this.player.body.setSize(width * PLAYER_SCALE, height * PLAYER_SCALE);
  // Centrar el hitbox en el sprite del jugador
  this.player.body.setOffset(
    (this.player.width - width * PLAYER_SCALE) / 2,
    (this.player.height - height * PLAYER_SCALE) / 2
  );
};

// Actualización del juego
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
  this.layer4.x = -this.cameras.main.scrollX * 0.1; // Capa más lejana, se mueve más lento
  this.layer4.y = -this.cameras.main.scrollY * 0.1; // Capa más lejana, se mueve más lento

  this.layer3.x = -this.cameras.main.scrollX * 0.3; // Capa intermedia
  this.layer3.y = -this.cameras.main.scrollY * 0.3; // Capa intermedia
};

let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  debug: true,
  scene: gameScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1400 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

let game = new Phaser.Game(config);
window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
