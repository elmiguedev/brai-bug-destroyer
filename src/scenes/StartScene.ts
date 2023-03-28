import { Scene } from "phaser";

export class StartScene extends Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    this.add.text(100, 100, "Start")
    this.add.image(400, 400, "braian-low-res")
  }
}