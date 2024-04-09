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
import { hurdle } from "./hurdle"; // Assuming "hurdle" script defines cactus behavior

const { ccclass, property } = _decorator;

@ccclass("component")
export class component extends Component {
    @property({ type: Node })
    dino: Node = null;
    @property({ type: Prefab })
    nodePrefab: Prefab = null;
    instanceNode: Node[] = [];
    gameOver: boolean = false; // Flag to track game state
    insNode: Node;
    isJumping = false;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

        for (let i = 0; i < 5; i++) {
            this.insNode = instantiate(this.nodePrefab);
            this.node.addChild(this.insNode);
            this.instanceNode.push(this.insNode);
            this.insNode.getComponent(hurdle).setHurdle();

            this.instanceNode[i].position.set(
                view.getDesignResolutionSize().x / 2 + i * 950,
                -view.getDesignResolutionSize().y / 2 +
                    this.instanceNode[i].getComponent(UITransform).contentSize.height,
                0
            );
        }
    }

    onTouchStart(event: EventTouch) {
        if (!this.isJumping) {
            this.isJumping = true; // Set jumping flag to prevent further jumps

            tween(this.dino)
                .to(
                    0.45,
                    {
                        position: new Vec3(this.dino.getPosition().x + 8, this.dino.getPosition().y + 500, 0),
                    },
                    { easing: "cubicInOut" }
                )
                .to(
                    0.45,
                    {
                        position: new Vec3(this.dino.getPosition().x + 16, this.dino.getPosition().y, 0),
                    },
                    { easing: "cubicInOut", onComplete: () => (this.isJumping = false) } // Reset jump flag after completion
                )
                .start();
        }
    }

    startMove() {
        for (let index = 0; index < this.instanceNode.length; index++) {
            const element = this.instanceNode[index];
            element.setPosition(element.getPosition().x - 14, element.getPosition().y, 0);
            if (element.getPosition().x < -view.getDesignResolutionSize().x) {
                element.setPosition(
                    view.getDesignResolutionSize().x * 1.3 + element.getComponent(UITransform).width + 350,
                    -view.getDesignResolutionSize().y / 2 + element.getComponent(UITransform).contentSize.height,
                    0
                );
            }
        }
    }
    checkCollision() {
        for (const cactus of this.instanceNode) {
            const dinoWorldBounds = this.dino.getComponent(UITransform).getBoundingBoxToWorld();
            const cactusWorldBounds = cactus.getComponent(UITransform).getBoundingBoxToWorld();

            if (cactusWorldBounds.intersects(dinoWorldBounds)) {
                console.error("Game over!");
                this.gameOver = true; // Ensure you've declared this property in your component

                this.node.destroy();
            }
        }
    }

    update(deltaTime: number) {
        this.startMove();
        this.checkCollision();
    }
}
