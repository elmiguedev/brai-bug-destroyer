import Phaser, { Scene } from "phaser"
import { Bullet } from "./Bullet";
export class Brai extends Phaser.Physics.Arcade.Sprite {
  public bullets!: Phaser.Physics.Arcade.Group;
  private burnoutRecoverTimer!: Phaser.Time.TimerEvent;

  public onBurnout?: Function;

  private MAX_BURNOUT_LEVEL: number = 50;
  private BURNOUT_RECOVER_TIME: number = 3000;
  private shooting: boolean = false;
  private burnoutLevel: number = 0;
  private burnout: boolean = false;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "brai");

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      max: 20,
      active: false,
      visible: false,
      collideWorldBounds: true,
    });

    this.burnoutRecoverTimer = this.scene.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => { this.recoverBurnout() }
    })

  }

  fire() {
    if (!this.shooting && !this.burnout) {
      this.shooting = true;
      this.increaseBurnout();
      const bullet = this.bullets.getFirstDead(true, this.x, this.y);
      bullet.init();
      setTimeout(() => { this.shooting = false; }, 100);
    }
  }

  isBurnout() {
    return this.burnout;
  }

  getBurnoutLevel() {
    return this.burnoutLevel;
  }

  private increaseBurnout() {
    this.burnoutLevel++;
    if (this.burnoutLevel >= this.MAX_BURNOUT_LEVEL) {
      this.burnout = true;
      setTimeout(() => {
        this.burnout = false;
        this.burnoutLevel = 0;
        if (this.onBurnout) this.onBurnout();
      }, this.BURNOUT_RECOVER_TIME)
    }
    if (this.onBurnout) this.onBurnout();
  }

  private recoverBurnout() {
    this.burnoutLevel--;
    if (this.burnoutLevel <= 0)
      this.burnoutLevel = 0;
    if (this.onBurnout) this.onBurnout();

  }

}