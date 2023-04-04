import Phaser, { Scene } from "phaser"
export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "bullet");

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);


    const body = this.body as Phaser.Physics.Arcade.Body;
    body.onWorldBounds = true;
    body.world.on('worldbounds', (body: any) => {
      if (body.gameObject === this) {
        this.destroy();
      }
    });
  }

  init() {
    this.setVelocityX(3000);
  }
}