// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BottomBar from "./BottomBar";
import Game from "./Game";
import { UIManager, UIType } from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Level extends cc.Component {
  @property(cc.Node)
  restartBtn: cc.Node = null;
  @property(cc.Node)
  bottomBar: cc.Node = null;
  public bar: BottomBar = null;

  onLoad() {
    this.bar = this.bottomBar.getComponent(BottomBar);
    this.bottomBar.active = true;
  }

  init() {
    this.bar.init(this);
    this.restartBtn.opacity = 0;
    this.onOverShow(false);
  }

  onClickRestart() {
    UIManager.instance.showUI(UIType.MenuUI);
  }

  onOverShow(enable: boolean) {
    if (enable) {
      cc.tween(this.restartBtn)
        .to(0.5, { opacity: 0 })
        .to(0.5, { opacity: 255 })
        .start();
    }
    this.bottomBar.active = !enable;
    this.bar.setCardsClickable(!enable);
    this.bar.setWrongIconStatus(enable);
  }
}
