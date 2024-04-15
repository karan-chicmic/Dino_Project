import { _decorator, Component, Node, randomRangeInt, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("hurdle")
export class hurdle extends Component {
    @property({ type: [SpriteFrame] })
    image: [SpriteFrame] | [] = [];

    setHurdle() {
        this.node.getComponent(Sprite).spriteFrame = this.image[randomRangeInt(0, 3)];
    }
    start() {}

    update(deltaTime: number) {}
}
