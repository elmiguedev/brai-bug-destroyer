import { Scene } from "phaser";

interface MainSceneHudProps {
  score?: number;
  codeIntegrity?: number;
  burnoutLevel?: number;
  burnout?: boolean;
}

export class MainSceneHud extends Scene {
  private score: number = 0;
  private codeIntegrity: number = 0;
  private burnoutLevel: number = 0;
  private burnout: boolean = false;

  private scoreTxt!: Phaser.GameObjects.Text;
  private codeIntegrityTxt!: Phaser.GameObjects.Text;
  private burnoutTxt!: Phaser.GameObjects.Text;

  constructor(props?: MainSceneHudProps) {
    super("MainSceneHud")
    this.score = props?.score || 0;
    this.codeIntegrity = props?.codeIntegrity || 100;
    this.burnoutLevel = props?.burnoutLevel || 0;
    this.burnout = props?.burnout || false;
  }

  create() {
    this.scoreTxt = this.add.text(10, 10, "");
    this.codeIntegrityTxt = this.add.text(10, 30, "");
    this.burnoutTxt = this.add.text(10, 50, "");
    this.refresh();
  }

  setScore(score: number) {
    this.score = score;
    this.refresh();
  }

  setCodeIntegrity(integrity: number) {
    this.codeIntegrity = integrity;
    this.refresh();
  }

  setBurnout(burnout: boolean) {
    this.burnout = burnout;
    this.refresh();
  }
  setBurnoutLevel(burnoutLevel: number) {
    this.burnoutLevel = burnoutLevel;
    this.refresh();
  }

  refresh() {
    this.scoreTxt.setText(`Score: ${this.score}`)
    this.codeIntegrityTxt.setText(`Code Integrity: ${this.codeIntegrity}`)
    this.burnoutTxt.setText(`Burnout level: ${this.burnoutLevel} ${this.burnout ? "(BURNOUT)" : ""}`);
  }


}