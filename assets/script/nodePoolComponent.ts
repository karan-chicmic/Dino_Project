import {
    _decorator,
    Component,
    director,
    EventTouch,
    input,
    Input,
    instantiate,
    Intersection2D,
    Node,
    NodePool,
    Prefab,
    randomRangeInt,
    tween,
    UITransform,
    Vec3,
    view,
} from "cc";
import { hurdle } from "./hurdle";
import { PoolHandler } from "./PoolHandler";
const { ccclass, property } = _decorator;

@ccclass("nodePoolComponent")
export class nodePoolComponent extends Component {
    @property({ type: Node })
    dino: Node = null;

    @property({ type: Prefab })
    nodePrefab: Prefab = null;

    @property({ type: Node })
    road: Node = null;

    instanceNode: Node[] = [];
    gameOver: boolean = false;
    insNode: Node;
    isDinoJumping = false;

    roadPos: number;
    diff: number;
    cactusDiff = randomRangeInt(810, 1100);
    roadRange = 0.5;
    proceed = true;
    continueGet = true;

    pool: NodePool = new NodePool();

    start() {
        this.startMove();
    }

    onLoad() {
        if (this.road) {
            this.roadPos = this.road.getPosition().y;
        }
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        console.log("Before Pool Size:", this.pool.size());
        for (let i = 0; i < 5; i++) {
            const hurdleNode = instantiate(this.nodePrefab);
            hurdleNode.getComponent(hurdle).setHurdle();
            this.pool.put(hurdleNode);

            if (this.roadPos > 0) {
                this.dino.setPosition(
                    -view.getDesignResolutionSize().x / 2 + this.dino.getComponent(UITransform).width,
                    0 +
                        (this.roadPos + this.road.getComponent(UITransform).height) +
                        this.road.getComponent(UITransform).height * this.roadRange,
                    0
                );
                hurdleNode.setPosition(
                    view.getDesignResolutionSize().x / 2,
                    0 +
                        (this.roadPos +
                            this.road.getComponent(UITransform).height +
                            this.road.getComponent(UITransform).height * this.roadRange),
                    0
                );
            } else {
                this.dino.setPosition(
                    -view.getDesignResolutionSize().x / 2 + this.dino.getComponent(UITransform).width,
                    this.roadPos +
                        this.road.getComponent(UITransform).height +
                        this.road.getComponent(UITransform).height * this.roadRange,
                    0
                );
                hurdleNode.setPosition(
                    view.getDesignResolutionSize().x / 2,
                    this.roadPos +
                        this.road.getComponent(UITransform).height +
                        this.road.getComponent(UITransform).height * this.roadRange,

                    0
                );
            }
        }
        console.log("after pool size", this.pool.size());
    }

    update(deltaTime: number) {
        // this.startMove();
        this.checkCollision();
        if (this.gameOver) {
            //here i will show message when game over/restart game
            // setTimeout(() => director.loadScene(director.getScene().name), 500);
        }
    }

    startMove() {
        console.log("start move pool size", this.pool.size());
        const hurdleNode = this.pool.get();
        // hurdleNode.setParent(this.node);
        this.node.addChild(hurdleNode);
        hurdleNode.setPosition(new Vec3(0, 0, 0));
        // while (!(hurdleNode.getPosition().x < -view.getDesignResolutionSize().x)) {
        //     hurdleNode.setPosition(hurdleNode.getPosition().x - 16, hurdleNode.getPosition().y, 0);
        //     console.log(hurdleNode.getPosition());
        // }
        // if (hurdleNode.getPosition().x < -view.getDesignResolutionSize().x) {
        //     this.pool.put(hurdleNode);
        // }

        console.log("after start move pool size", this.pool.size());
    }
    onTouchStart(event: EventTouch) {
        if (!this.isDinoJumping) {
            this.isDinoJumping = true;

            tween(this.dino)
                .to(
                    0.4, // with 0.45 game is working smoothly like easy mode
                    {
                        position: new Vec3(this.dino.getPosition().x + 14, this.dino.getPosition().y + 400, 0),
                    },
                    { easing: "circOut" } //  with quint it is working very smoothly like easy game. //circout is also working fine but better.
                )
                .to(
                    0.4,
                    {
                        position: new Vec3(this.dino.getPosition().x + 28, this.dino.getPosition().y, 0),
                    },
                    { easing: "circIn", onComplete: () => (this.isDinoJumping = false) }
                )
                .start();
        }
    }
    checkCollision() {
        for (const cactus of this.instanceNode) {
            const dinoWorld = this.dino.getComponent(UITransform).getBoundingBoxToWorld();
            const cactusWorld = cactus.getComponent(UITransform).getBoundingBoxToWorld();

            if (Intersection2D.rectRect(dinoWorld, cactusWorld)) {
                console.error("Game over!");
                this.gameOver = true; // Ensure you've declared this property in your component
                this.node.destroy();
            }
        }
    }
}
