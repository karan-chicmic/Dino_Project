import {
    __private,
    _decorator,
    Component,
    director,
    EventTouch,
    Input,
    input,
    instantiate,
    Node,
    Prefab,
    RigidBody,
    Tween,
    tween,
    UITransform,
    Vec3,
    view,
} from "cc";
import { hurdle } from "./hurdle";
const { ccclass, property } = _decorator;

@ccclass("component")
export class component extends Component {
    @property({ type: Node })
    dino: Node = null;
    @property({ type: Prefab })
    nodePrefab: Prefab = null;
    instanceNode: Node[] = [];
    insNode;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

        // let newpos = this.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));

        // this.dino.setPosition(newpos);
        console.log("onLoad of customComponent");
        for (let i = 0; i < 5; i++) {
            this.insNode = instantiate(this.nodePrefab);
            this.node.addChild(this.insNode);
            this.instanceNode.push(this.insNode);
            this.insNode.getComponent(hurdle).setHurdle();
            // console.log(this.instanceNode.position);

            // let newpos = this.getComponent(UITransform).convertToWorldSpaceAR(
            //     new Vec3(view.getDesignResolutionSize().x / 2, view.getDesignResolutionSize().y / 2, 0)
            //     // instanceNode.position
            // );
        }
        this.initPosition();
    }
    onTouchStart(event: EventTouch) {
        // this.getComponent(UITransform).convertToNodeSpaceAR(
        //     new Vec3(this.dino.getPosition().x, this.dino.getPosition().y, 0)
        // );

        tween(this.dino)
            .to(
                0.5,
                {
                    position: new Vec3(this.dino.getPosition().x + 10, this.dino.getPosition().y + 300, 0),
                },
                { easing: "cubicInOut" }
            )
            .to(
                0.5,
                {
                    position: new Vec3(this.dino.getPosition().x + 20, this.dino.getPosition().y, 0),
                },
                { easing: "cubicInOut" }
            )
            .start();
    }
    initPosition() {
        for (let i = 0; i < 5; i++) {
            this.instanceNode[i].position.set(
                view.getDesignResolutionSize().x / 2 + i * 800,
                -view.getDesignResolutionSize().y / 2 +
                    this.instanceNode[i].getComponent(UITransform).contentSize.height,
                0
            );
        }
    }
    checkCollision(dino: Node, cactus: Node) {
        let cactusx = cactus.position.x;
        let cactusy = cactus.position.y;
        let dinox = this.dino.position.x;
        let dinoy = this.dino.position.y;
        let dinoHeight = this.dino.position.y;
        if (dinox >= cactusx + 150 || dinoy >= cactusy + 150) {
            console.log("Game over!");

            return;
        }
        // const rigidDino = dino.getComponent(RigidBody);
        // rigidDino.useCCD = true;
        // const rigidCactus = cactus.getComponent(RigidBody);
        // rigidCactus.useCCD = true;
    }

    startMove() {
        for (let index = 0; index < this.instanceNode.length; index++) {
            const element = this.instanceNode[index];
            element.setPosition(element.getPosition().x - 10, element.getPosition().y, 0);
            if (element.getPosition().x < -view.getDesignResolutionSize().x) {
                element.setPosition(
                    view.getDesignResolutionSize().x * 1.3 + element.getComponent(UITransform).width + 350,
                    -view.getDesignResolutionSize().y / 2 + element.getComponent(UITransform).contentSize.height,
                    0
                );
            }
        }
    }
    start() {}

    update(deltaTime: number) {
        this.startMove();
        this.checkCollision(this.dino, this.insNode);
    }
}
