// Gifts.js
export default class Gifts {
    constructor(scene) {
      this.scene = scene;
      this.giftsGroup = this.scene.physics.add.staticGroup();
    }
  
    preload() {
      this.scene.load.spritesheet("coin", "./img/sources/PowerUps/Gift/Coin.png", { frameWidth: 700, frameHeight: 700 });
      this.scene.load.spritesheet("bottle", "./img/sources/PowerUps/HealthPack/Bottle.png", { frameWidth: 700, frameHeight: 700 });
      this.scene.load.spritesheet("magicStone", "./img/sources/PowerUps/PowerUp/Magic_Stone.png", { frameWidth: 700, frameHeight: 700 });
    }
  
    create(giftsData) {
      giftsData.forEach((gift) => {
        const newGift = this.giftsGroup.create(gift.x, gift.y, gift.key).setScale(0.1);
        this.createAnimations(gift.key);
        newGift.anims.play(gift.key);
      });
    }
  
    createAnimations(key) {
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    collectGift(player, gift) {
        this.scene.collectGifts(player, gift);
        gift.destroy();
      }
  }
  