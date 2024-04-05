import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec3, view } from "cc";
import { hurdle } from "./hurdle";
const { ccclass, property } = _decorator;

@ccclass("component")
export class component extends Component {
    @property({ type: Prefab })
    nodePrefab: Prefab = null;
    instanceNode: Node[] = [];

    onLoad() {
        // let newpos = this.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));

        // this.dino.setPosition(newpos);
        console.log("onLoad of customComponent");
        for (let i = 0; i < 5; i++) {
            let insNode = instantiate(this.nodePrefab);
            this.node.addChild(insNode);
            this.instanceNode.push(insNode);
            insNode.getComponent(hurdle).setHurdle();
            // console.log(this.instanceNode.position);

            // let newpos = this.getComponent(UITransform).convertToWorldSpaceAR(
            //     new Vec3(view.getDesignResolutionSize().x / 2, view.getDesignResolutionSize().y / 2, 0)
            //     // instanceNode.position
            // );
        }
        this.initPosition();
    }
    initPosition() {
        for (let i = 0; i < 5; i++) {
            this.instanceNode[i].position.set(
                view.getDesignResolutionSize().x / 2 + i * 500,
                -view.getDesignResolutionSize().y / 2 +
                    this.instanceNode[i].getComponent(UITransform).contentSize.height * 0.7,
                0
            );
        }
    }

    startMove() {
        for (let index = 0; index < this.instanceNode.length; index++) {
            const element = this.instanceNode[index];
            element.setPosition(element.getPosition().x - 6, element.getPosition().y, 0);
            if (element.getPosition().x < -view.getDesignResolutionSize().x) {
                element.setPosition(
                    view.getDesignResolutionSize().x * 0.5 + element.getComponent(UITransform).width,
                    -view.getDesignResolutionSize().y / 2 + element.getComponent(UITransform).contentSize.height * 0.7,
                    0
                );
            }
        }
    }
    start() {}

    update(deltaTime: number) {
        this.startMove();
    }
}
