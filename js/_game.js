const PLAYER_SCALE = 0.6;
const PLATFORM_SCALE = 0.7;
const ENEMY_SCALE = 0.3;
const GIFT_SCALE = 0.1;
const ZOOM_FACTOR = 1;
const WORLD_BOUNDS = { width: 5714, height: 1000 };
const PLAYER_DIMENSIONS = {
  walk: [240, 435],
  idle: [140, 435],
  jump: [140, 435],
};

// Create a new Phaser scene called "Game"
let gameScene = new Phaser.Scene("Game");

// Initialize scene parameters
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

// Preload game assets
gameScene.preload = function () {
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
    ["playerIdle", "./img/sources/Character/idle.png", 109, 275],
    ["playerWalk", "./img/sources/Character/walk.png", 149, 275],
    ["playerJump", "./img/sources/Character/jump.png", 176, 275],
    [
      "transformation",
      "./img/sources/PowerUps/Transformation/Transformation.png",
      220,
      275,
    ],
    ["coin", "./img/sources/PowerUps/Gift/Coin.png", 700, 700],
    ["bottle", "./img/sources/PowerUps/HealthPack/Bottle.png", 700, 700],
    ["magicStone", "./img/sources/PowerUps/PowerUp/Magic_Stone.png", 700, 700],
    ["enemy1", "./img/sources/Enemy1/Enemy_1.png", 600, 900],
    ["enemy2", "./img/sources/Enemy2/Enemy_2.png", 700, 700],
    ["enemy3", "./img/sources/Enemy3/Enemy_3.png", 500, 500],
  ];

  images.forEach(([key, path]) => this.load.image(key, path));
  spritesheets.forEach(([key, path, frameWidth, frameHeight]) => {
    this.load.spritesheet(key, path, { frameWidth, frameHeight });
  });

  // this.load.json("levelData", "./data/levelData.json");
  this.load.json("levelData", "http://codigo.test/editor/api.php?id=1");
};

// Utility function to create animations
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

// Create scene and configure game elements
gameScene.create = function () {
  const createLayer = (key, scrollFactor = 0) =>
    this.add.image(0, 0, key).setOrigin(0, 0).setScrollFactor(scrollFactor);

  this.layer4 = createLayer("layer4");
  this.layer3 = createLayer("layer3");

  this.platforms = this.physics.add.staticGroup();

  const levelData = this.cache.json.get("levelData");

  levelData.platforms.forEach((platform) => {
    const platformKey = platform.type;
    this.platforms
      .create(platform.x, platform.y, platformKey)
      .setScale(PLATFORM_SCALE)
      .refreshBody();
  });

  this.layer2 = this.physics.add
    .staticImage(0, 900, "layer2")
    .setOrigin(0, 0)
    .setScale(1)
    .refreshBody();

  this.createAnimations();

  this.enemies = this.physics.add.group({
    allowGravity: true,
    immovable: false,
  });
  levelData.enemies.forEach((enemy) => {
    const newEnemy = this.enemies
      .create(enemy.x, enemy.y, enemy.key)
      .setScale(ENEMY_SCALE)
      .refreshBody()
      .setCollideWorldBounds(true);
      if (enemy.key === "enemy3") {
        newEnemy.setSize(400, 450);
      } else if (enemy.key === "enemy2") {
        newEnemy.setSize(450, 650);
      } else if (enemy.key === "enemy1") {
        newEnemy.setSize(500, 800);
      }
    const randomDirection = Math.floor(Math.random() * 2);
    newEnemy.setVelocityX(randomDirection === 1 ? 100 : -100);
    newEnemy.anims.play(enemy.key);
    newEnemy.direction = randomDirection === 1 ? "right" : "left";
  });

  this.gifts = this.physics.add.staticGroup();
  levelData.gifts.forEach((gift) => {
    const newGift = this.gifts
      .create(gift.x, gift.y, gift.key)
      .setScale(GIFT_SCALE)
      .refreshBody();
    newGift.anims.play(gift.key);
  });

  const playerData = levelData.player;
  this.player = this.physics.add
    .sprite(playerData.x, playerData.y, playerData.key)
    .setScale(PLAYER_SCALE)
    .setCollideWorldBounds(true);

  this.physics.world.setBounds(0, 0, WORLD_BOUNDS.width, WORLD_BOUNDS.height);
  this.cameras.main
    .setBounds(0, 0, WORLD_BOUNDS.width, WORLD_BOUNDS.height)
    .startFollow(this.player)
    .setZoom(ZOOM_FACTOR);

  this.cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.player, this.layer2);
  this.physics.add.collider(this.enemies, this.platforms);
  this.physics.add.collider(this.enemies, this.layer2);
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

  createLayer("layer1", 1);
  createLayer("layer0", 1);
};

// Create animations for characters and props
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

  this.createAnimation("coin", "coin", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("bottle", "bottle", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("magicStone", "magicStone", [0, 1, 2, 3, 4, 5, 6, 7], 8);

  this.createAnimation("enemy1", "enemy1", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("enemy2", "enemy2", [0, 1, 2, 3, 4, 5, 6, 7], 8);
  this.createAnimation("enemy3", "enemy3", [0, 1, 2, 3, 4, 5, 6, 7], 8);
};

// Handle collecting gifts
gameScene.collectGifts = function (player, gift) {
  switch (gift.texture.key) {
    case "coin":
      this.collectCoin(player, gift);
      break;
    case "bottle":
      this.collectBottle(player, gift);
      break;
    case "magicStone":
      this.collectMagicStone(player, gift);
      break;
  }
  gift.destroy();
};

// Collect a coin
gameScene.collectCoin = function (player, coin) {
  console.log("Collected a coin!");
  this.coinsCount += 1;
  updateCoinsText(this);

  if (this.coinsCount === 3) {
    showVictoryMessage();
    player.setVelocity(0, 0);
  }
};

// Collect a health bottle
gameScene.collectBottle = function (player, bottle) {
  console.log("Gained a life!");
  this.lives += 1;
  updateLivesText(this);
};

// Collect a magic stone (transformation)
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
};

// Handle hitting an enemy
gameScene.hitEnemies = function (player, enemy) {
  console.log("Colisión con enemigo detectada");

  if (this.lives === 1) {
    console.log("¡Has perdido tu última vida! Reiniciando el nivel...");
    this.scene.stop();
    player.setVelocity(0, 0);
    player.body.moves = false;
    player.body.allowGravity = false;
    this.input.keyboard.enabled = false;
    this.scene.start("Game");
    updateCoinsText(this);
    updateLivesText(this);
    showMessage();
  } else {
    this.lives -= 1;
    updateLivesText(this);
    console.log(`¡Te queda(n) ${this.lives} vida(s)!`);
    player.setPosition(100, 816);
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
  const livesTextElement = document.getElementById("livesText");
  if (livesTextElement) {
    livesTextElement.textContent = `Vidas: ${scene.lives}`;
  }
}

function updateCoinsText(scene) {
  const coinsTextElement = document.getElementById("coinsText");
  if (coinsTextElement) {
    coinsTextElement.textContent = `Monedas: ${scene.coinsCount}`;
  }
}

gameScene.updatePlayerHitbox = function () {
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

  this.player.body.setSize(width * PLAYER_SCALE, height * PLAYER_SCALE);
  this.player.body.setOffset(
    (this.player.width - width * PLAYER_SCALE) / 2,
    (this.player.height - height * PLAYER_SCALE) / 2
  );
};

// Actualización del juego
gameScene.update = function () {
  if (this.isTransforming) return;
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-this.playerSpeed);
    this.player.flipX = true;
    if (
      !this.isJumping &&
      (!this.player.anims.isPlaying ||
        this.player.anims.currentAnim.key !== "walk")
    ) {
      this.player.anims.play("walk");
      this.updatePlayerHitbox();
    }
  }
  else if (this.cursors.right.isDown) {
    this.player.setVelocityX(this.playerSpeed);
    this.player.flipX = false;
    if (
      !this.isJumping &&
      (!this.player.anims.isPlaying ||
        this.player.anims.currentAnim.key !== "walk")
    ) {
      this.player.anims.play("walk");
      this.updatePlayerHitbox();
    }
  }
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

  if (this.cursors.up.isDown && !this.isJumping) {
    this.player.setVelocityY(this.playerJump);
    this.player.anims.play("jump");
    this.updatePlayerHitbox();
    this.isJumping = true;
  }
  if (this.player.body.touching.down || this.player.body.blocked.down) {
    if (this.isJumping) {
      this.isJumping = false;
      if (this.player.body.velocity.x === 0) {
        this.player.anims.play("idle");
        this.updatePlayerHitbox();
      } else {
        this.player.anims.play("walk");
        this.updatePlayerHitbox();
      }
    }
  }

  this.enemies.getChildren().forEach((enemy) => {
    if (enemy.body.blocked.left) {
      enemy.setVelocityX(100);
      enemy.direction = "right";
    } else if (enemy.body.blocked.right) {
      enemy.setVelocityX(-100);
      enemy.direction = "left";
    }
  });

  this.layer4.x = -this.cameras.main.scrollX * 0.1;
  this.layer4.y = -this.cameras.main.scrollY * 0.1;

  this.layer3.x = -this.cameras.main.scrollX * 0.3; 
  this.layer3.y = -this.cameras.main.scrollY * 0.3; 
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
