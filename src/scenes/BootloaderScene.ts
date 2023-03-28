import { Scene } from "phaser";
import BraianLowResPng from "../assets/img/braian-low-res.png";

export class BootloaderScene extends Scene {
  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.image("braian-low-res", BraianLowResPng)
    this.load.on("complete", () => {
      this.scene.start("StartScene");
    })
  }
}