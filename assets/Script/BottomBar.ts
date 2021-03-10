// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Card from "./Card";
import Level from "./Level";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BottomBar extends cc.Component {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  private _cardList: Card[] = [];

  init(parent: Level) {
    if (this._cardList.length > 0) {
      this._cardList.forEach((card) => {
        card.node.parent = this.scrollView.content;
        card.node.y = 0;
        card.init(parent);
      });
    } else {
      for (
        let i = 0, len = this.scrollView.content.childrenCount;
        i < len;
        i++
      ) {
        const card = this.scrollView.content.children[i];
        this._cardList.push(card.getComponent(Card));
        card.getComponent(Card).init(parent);
      }
    }
  }

  setCardsClickable(enable: boolean) {
    this._cardList.forEach((card) => {
      if (enable) {
        card.register();
      } else {
        card.unregister();
      }
    });
  }

  setWrongIconStatus(enable: boolean) {
    if (enable) {
      this._cardList.forEach((card) => {
        if (card.cardParent) {
          const isShow =
            (card.cardParent.name.indexOf("R") != -1 && card.isCorrect) ||
            (card.cardParent.name.indexOf("L") != -1 && !card.isCorrect);
          card.wrongIcon.active = isShow;
        }
      });
    } else {
      this._cardList.forEach((card) => {
        card.wrongIcon.active = false;
      });
    }
  }
}
