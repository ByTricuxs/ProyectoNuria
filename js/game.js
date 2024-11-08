// Game.js
import background from "./background.js";
import player from "./player.js";
import enemies from "./enemies.js";
import gifts from "./gifts.js";
import platforms from "./platforms.js";

let gameScene = new Phaser.Scene("Game");

gameScene.init = function () {
  this.lives = 3;
  this.coinsCount = 0;
};

gameScene.preload = function () {
  this.load.json("levelData", "http://localhost/codigo/editor/api.php?id=1");
  this.background = new background(this);
  this.player = new player(this);
  this.enemies = new enemies(this);
  this.gifts = new gifts(this);
  this.platforms = new platforms(this);

  this.background.preload();
  this.player.preload();
  this.enemies.preload();
  this.gifts.preload();
  this.platforms.preload();
};

gameScene.create = function () {
    const levelData = this.cache.json.get("levelData");

  this.background.create();
  this.player.create(levelData.player);
  this.enemies.create(levelData.enemies);
  this.gifts.create(levelData.gifts);
  this.platforms.create(levelData.platforms);
};

gameScene.update = function () {
  this.player.update();
  this.enemies.update();
  this.background.update(this.cameras.main.scrollX, this.cameras.main.scrollY);
};

export default gameScene;
