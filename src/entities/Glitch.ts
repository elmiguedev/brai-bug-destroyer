import Phaser, { Scene } from "phaser"

export class Glitch extends Phaser.Physics.Arcade.Sprite {
  private life = 40;
  private glitchTimer!: Phaser.Time.TimerEvent;
  public onGlitch!: Function;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "glitch");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setImmovable(true);
    this.setScale(4);
    this.glitchTimer = this.scene.time.addEvent({
      delay: 800,
      loop: true,
      callback: () => {
        this.glitch();
      }
    })
  }

  hurt() {
    this.life--;
    if (this.life <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }

  glitch() {
    this.scene.cameras.main.shake();
    if (this.onGlitch) this.onGlitch();
  }

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene);
    if (this.glitchTimer) {
      this.glitchTimer.remove();
      this.glitchTimer.destroy();
    }
  }

}