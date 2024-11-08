import gameScene from './game.js';

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
        debug: true,
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