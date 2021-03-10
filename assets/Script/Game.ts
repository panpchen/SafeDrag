// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Level from "./Level";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property(cc.Node)
  levelParent: cc.Node = null;
  @property(cc.Prefab)
  levelPrefabs: cc.Prefab[] = [];

  public static instance: Game = null;
  private _curLevel: number = 0;
  private _haveLevelList: cc.Node[] = [];

  onLoad() {
    Game.instance = this;
  }

  startGame() {
    this._curLevel = 0;
    this._haveLevelList.forEach((level) => {
      level.active = false;
    });
    this._loadLevel();
  }

  _loadLevel() {
    let level = this._haveLevelList[this._curLevel];
    if (!level) {
      level = cc.instantiate(this.levelPrefabs[this._curLevel]);
      this._haveLevelList.push(level);
      level.parent = this.levelParent;
    } else {
      level.active = true;
    }
    level.getComponent(Level).init();
  }

  followNewCard(newCard: cc.Node, touchPos: cc.Vec2) {
    const localPos = Utils.worldConvertLocalPointAR(this.node, touchPos);
    newCard.setPosition(localPos);
  }
}
