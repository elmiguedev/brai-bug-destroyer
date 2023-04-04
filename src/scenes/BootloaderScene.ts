import { Scene } from "phaser";
import BraiPng from "../assets/img/brai.png";
import BulletPng from "../assets/img/bullet.png";
import BugPng from "../assets/img/bug.png";
import glitchPng from "../assets/img/glitch.png";


export class BootloaderScene extends Scene {
  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.image("brai", BraiPng)
    this.load.image("bullet", BulletPng)
    this.load.image("bug", BugPng)
    this.load.image("glitch", glitchPng)

    this.load.on("complete", () => {
      this.scene.start("StartScene");
    })
  }
}