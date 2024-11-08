

  export default class Ground {
    constructor(scene) {
      this.scene = scene;
      this.ground = this.scene.physics.add.staticGroup();
    }
  
    create() {
      this.ground.create(0, 900, "layer2")
      .setOrigin(0, 0)
      .setScale(1)
      .refreshBody();
    }
  
    addCollisions(player, enemies) {
      this.scene.physics.add.collider(player, this.ground);
      this.scene.physics.add.collider(enemies, this.ground);
    }
  }
  
  