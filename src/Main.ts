import { MainScene } from './scenes/MainScene';
import Phaser from 'phaser';
import { BootloaderScene } from './scenes/BootloaderScene';
import { StartScene } from './scenes/StartScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootloaderScene,
    StartScene,
    MainScene
  ]
};

new Phaser.Game(config);