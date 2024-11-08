export default class Plataforms {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.staticGroup();
      }
    
      preload() {
        this.scene.load.image("plataformLeft", "./img/sources/Plataforms/Left.png");
        this.scene.load.image("plataformRight", "./img/sources/Plataforms/Right.png");
        this.scene.load.image("plataformMidle", "./img/sources/Plataforms/Midle.png");
      }
    
      create(platformData) {
        platformData.forEach(platform => {
          const platformSprite = this.group.create(platform.x, platform.y, platform.type);
          platformSprite.setScale(0.7).refreshBody();
        });
      }
    }