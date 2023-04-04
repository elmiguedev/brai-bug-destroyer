import { Scene } from "phaser";

export class StartScene extends Scene {

  private startKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super("StartScene");
  }

  create() {

    this.createTitles();
    this.createKeys();
  }

  createKeys() {
    this.startKey = this.input.keyboard.addKey("enter");
    this.startKey.onDown = () => {
      this.scene.start("MainScene");
    }
  }

  createTitles() {
    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height / 2;
    this.add.text(centerX, centerY, "- - press [ENTER] to start - - ")
      .setOrigin(0.5)

  }
}