// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import Level from "./Level";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends cc.Component {
  @property(cc.Node)
  wrongIcon: cc.Node = null;
  @property
  isCorrect: boolean = false;
  private _cardParent: cc.Node = null;
  public get cardParent() {
    return this._cardParent;
  }
  private _levelNode: Level = null;
  private _originParent = null;
  private _isMoving: boolean = false;

  onLoad() {
    this.register();
  }

  register() {
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onMoveEvt, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onEndEvt, this);
  }

  unregister() {
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onMoveEvt, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onEndEvt, this);
  }

  init(parent: Level) {
    this._originParent = this.node.parent;
    this._levelNode = parent;
  }

  _onMoveEvt(evt: cc.Event.EventTouch) {
    const currPos = evt.getLocation();
    const startPos = evt.getStartLocation();
    const dis = cc.Vec2.distance(currPos, startPos);
    const deltaY = Math.abs(currPos.y - startPos.y);
    if (!this._isMoving) {
      if (dis > 100 && deltaY > 100) {
        this.node.parent = Game.instance.node;
        this._isMoving = true;
      }
    }
    if (this._isMoving) {
      Game.instance.followNewCard(this.node, currPos);
    }
  }

  _onEndEvt(evt: cc.Event.EventTouch) {
    this._isMoving = false;
    if (this._isSlotIn()) {
      this.node.parent = this._cardParent;
      this.node.scale = 0.4;
      if (this._isGameOver()) {
        this._levelNode.onOverShow(true);
        return;
      }
    } else {
      this.node.parent = this._originParent;
      this.node.y = 0;
      this.node.scale = 0.5;
    }
    this._levelNode.bar.scrollView.scrollToBottom();
  }

  _isSlotIn() {
    return this._cardParent != null;
  }

  _isGameOver() {
    return this._levelNode.bar.scrollView.content.childrenCount == 0;
  }
  onCollisionEnter(other, self) {
    if (other.node.name.indexOf("Area") != -1) {
      this._cardParent = other.node.getComponentInChildren(cc.Component).node;
    }
  }
}
