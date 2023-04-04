import { Scene } from "phaser";
import { Brai } from "../entities/Brai";
import { Bug } from "../entities/Bug";
import { Glitch } from "../entities/Glitch";
import { MainSceneHud } from "../huds/MainSceneHud";

export class MainScene extends Scene {

  // entities
  private brai!: Brai;
  private bugs!: Phaser.Physics.Arcade.Group;
  private glitches!: Phaser.Physics.Arcade.Group;
  private wall!: Phaser.GameObjects.Rectangle;
  private hud!: MainSceneHud;

  // control variables
  private timer!: Phaser.Time.TimerEvent;
  private enemyCreationTimer!: Phaser.Time.TimerEvent;
  private enemyCreationFrequency: number = 1000;
  private codeIntegrity: number = 100;
  private score: number = 0;


  private keys!: {
    up: Phaser.Input.Keyboard.Key,
    down: Phaser.Input.Keyboard.Key,
    left: Phaser.Input.Keyboard.Key,
    right: Phaser.Input.Keyboard.Key,
    fire: Phaser.Input.Keyboard.Key,
  }

  constructor() {
    super("MainScene");
  }

  // Game loop methods
  // ------------------------_

  create() {
    this.createBackground();
    this.createGameTimer();
    this.createWall();
    this.createPlayer();
    this.createEnemiesGroups();
    this.createEnemies();
    this.createKeys();
    this.createHud();
  }

  update() {
    this.checkInput();
    this.checkEnemyCollisions();
  }

  // Creation methods
  // ------------------------_

  createBackground() {
    this.cameras.main.setBackgroundColor(0x187263)

  }

  createHud() {
    this.hud = new MainSceneHud({
      score: this.score,
      codeIntegrity: this.codeIntegrity,
      burnout: this.brai.isBurnout(),
      burnoutLevel: this.brai.getBurnoutLevel()
    });
    this.scene.add("MainSceneHud", this.hud);
    this.scene.launch("MainSceneHud");
  }

  createGameTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.increaseScore(1);
      }
    })
  }

  createWall() {
    this.wall = this.add.rectangle(0, 0, 10, this.game.canvas.height).setOrigin(0);
    this.physics.add.existing(this.wall);
    this.wall.setFillStyle(0xFF0000)
    const wallBody = this.wall.body as Phaser.Physics.Arcade.Body;
    wallBody.immovable = true;

  }

  createPlayer() {
    this.brai = new Brai(this, 200, 400);
    this.brai.onBurnout = () => {
      this.hud.setBurnout(this.brai.isBurnout());
      this.hud.setBurnoutLevel(this.brai.getBurnoutLevel());
    }
  }

  createKeys() {
    this.keys = {
      up: this.input.keyboard.addKey("up"),
      down: this.input.keyboard.addKey("down"),
      left: this.input.keyboard.addKey("left"),
      right: this.input.keyboard.addKey("right"),
      fire: this.input.keyboard.addKey("space"),
    }
  }

  createEnemiesGroups() {
    this.bugs = this.physics.add.group({
      classType: Bug,
      max: 20,
      active: false,
      visible: false,
      immovable: false,
    });

    this.glitches = this.physics.add.group({
      classType: Glitch,
      max: 1,
      active: false,
      visible: false,
    });
  }

  createEnemies() {
    if (this.enemyCreationTimer) {
      this.enemyCreationTimer.remove();
      this.enemyCreationTimer.destroy();
    }
    this.enemyCreationTimer = this.time.addEvent({
      loop: true,
      delay: this.enemyCreationFrequency,
      callback: () => {
        this.createEnemy();
      }
    })
  }

  createEnemy() {
    const enemyProb = Phaser.Math.Between(1, 100);

    if (enemyProb < 5) {
      this.createGlitch();
    } else if (enemyProb < 10) {
      this.createBugsTrain();
    } else if (enemyProb < 30) {
      this.createBugsTrain(true);
    } else {
      this.createSingleBug();
    }
  }

  createGlitch() {
    const glitch = this.glitches.getFirstDead(true);
    const x = this.game.canvas.width;
    const y = this.game.canvas.height / 2;
    glitch.setPosition(x, y);
    glitch.setVelocityX(-100);
    glitch.onGlitch = () => {
      this.decreaseCodeIntegrity(5);
    }
  }

  createSingleBug() {
    const x = this.game.canvas.width;
    const y = Phaser.Math.Between(0, this.game.canvas.height);
    const bug: Bug = this.bugs.getFirstDead(true, x, y);
    bug.init();
  }

  createBugsTrain(wave?: boolean) {
    const x = this.game.canvas.width;
    const y = Phaser.Math.Between(0, this.game.canvas.height);
    const trainSize = 4;
    const bugMargin = 120;

    for (let i = 0; i < trainSize; i++) {
      const bug: Bug = this.bugs.getFirstDead(true, x + (bugMargin * i), y);
      bug.init();
      if (wave)
        bug.wave(i % 2 === 0);
    }
  }

  // Control methods
  // -------------------------

  increaseScore(score?: number) {
    this.score += score || 1;
    this.hud.setScore(this.score);
    this.checkDifficulty();
  }

  increaseDifficult() {
    if (this.enemyCreationFrequency > 100) {
      this.enemyCreationFrequency -= 20;
      this.createEnemies();
    }
  }

  decreaseCodeIntegrity(mount?: number) {
    this.codeIntegrity -= mount || 1;
    this.cameras.main.shake(100, 0.01)
    this.hud.setCodeIntegrity(this.codeIntegrity);
  }


  // Update and check methods
  // -----------------------------

  checkInput() {
    if (this.keys.up.isDown) this.brai.y -= 10;
    if (this.keys.down.isDown) this.brai.y += 10;
    if (this.keys.left.isDown) this.brai.x -= 10;
    if (this.keys.right.isDown) this.brai.x += 10;
    if (this.keys.fire.isDown) this.brai.fire();
  }

  checkEnemyCollisions() {
    this.physics.collide(this.bugs, this.brai.bullets, (bug, bullet) => {
      bug.destroy();
      bullet.destroy();
      this.increaseScore();
    })
    this.physics.overlap(this.glitches, this.brai.bullets, (glitch, bullet) => {
      const g = glitch as Glitch;
      g.hurt();
      bullet.destroy();
    })
    this.physics.overlap(this.wall, this.bugs, (wall, bug) => {
      this.decreaseCodeIntegrity();
      bug.destroy();
    })
  }

  checkDifficulty() {
    const difficultLimit = 20;
    if (this.score % difficultLimit === 0) {
      this.increaseDifficult();
    }
  }

}