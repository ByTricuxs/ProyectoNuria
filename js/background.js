export default class Background {
  constructor(scene) {
    this.scene = scene;
    this.layers = [];
  }

  preload() {
    this.scene.load.image("layer4", "./img/sources/Background/Layer 4.png");
    this.scene.load.image("layer3", "./img/sources/Background/Layer 3.png");
    this.scene.load.image("layer2", "./img/sources/Background/Layer 2.png");
    this.scene.load.image("layer1", "./img/sources/Background/Layer 1.png");
    this.scene.load.image("layer0", "./img/sources/Background/Layer 0.png");
  }

  create() {
    const createLayer = (key, scrollFactor = 0) =>
      this.scene.add.image(0, 0, key).setOrigin(0, 0).setScrollFactor(scrollFactor);

    this.layers.push(createLayer("layer4", 0.1));
    this.layers.push(createLayer("layer3", 0.3));
    this.scene.layer2 = this.scene.physics.add
      .staticImage(0, 900, "layer2")
      .setOrigin(0, 0)
      .setScale(1)
      .refreshBody();
      

    createLayer("layer1", 1);
    createLayer("layer0", 1);

    
  }

  update(scrollX, scrollY) {
    this.layers[0].x = -scrollX * 0.1;
    this.layers[0].y = -scrollY * 0.1;
    this.layers[1].x = -scrollX * 0.3;
    this.layers[1].y = -scrollY * 0.3;
  }
}