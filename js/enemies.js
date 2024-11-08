// Enemies.js
export default class Enemies {
  constructor(scene) {
    this.scene = scene;
    this.enemiesGroup = this.scene.physics.add.group();
  }

  preload() {
    this.scene.load.spritesheet("enemy1", "./img/sources/Enemy1/Enemy_1.png", {
      frameWidth: 600,
      frameHeight: 900,
    });
    this.scene.load.spritesheet("enemy2", "./img/sources/Enemy2/Enemy_2.png", {
      frameWidth: 700,
      frameHeight: 700,
    });
    this.scene.load.spritesheet("enemy3", "./img/sources/Enemy3/Enemy_3.png", {
      frameWidth: 500,
      frameHeight: 500,
    });
  }

  create(enemiesData) {
    enemiesData.forEach((enemy) => {
      const newEnemy = this.enemiesGroup
        .create(enemy.x, enemy.y, enemy.key)
        .setScale(0.3)
        .setCollideWorldBounds(true);
      newEnemy.setVelocityX(Math.random() > 0.5 ? 100 : -100);
      this.scene.physics.add.collider(enemy, this.scene.platforms);
      this.scene.physics.add.collider(enemy, this.scene.layer2);
      this.scene.physics.add.overlap(
        this.scene.player,
        enemy,
        this.scene.hitEnemies,
        null,
        this.scene
      );
      this.createAnimations(enemy.key);
      newEnemy.anims.play(enemy.key);
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

  update() {
    this.enemiesGroup.getChildren().forEach((enemy) => {
      if (enemy.body.blocked.left) {
        enemy.setVelocityX(100);
      } else if (enemy.body.blocked.right) {
        enemy.setVelocityX(-100);
      }
    });
  }
}
