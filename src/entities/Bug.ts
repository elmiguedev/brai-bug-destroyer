import Phaser, { Scene } from "phaser"
export class Bug extends Phaser.Physics.Arcade.Sprite {
  private baseY: number;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "bug");
    this.baseY = y;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  init() {
    this.setVelocityX(-500);
  }

  wave(inverted?: boolean) {
    const from = this.baseY + 50;
    const to = this.baseY - 50;

    this.scene.tweens.add({
      targets: this,
      loop: true,
      y: {
        from: inverted ? to : from,
        to: inverted ? from : to
      },
      yoyo: true
    })
  }
}