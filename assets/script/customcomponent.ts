import {
    __private,
    _decorator,
    Component,
    director,
    EventTouch,
    Input,
    input,
    instantiate,
    Intersection2D,
    Node,
    Prefab,
    random,
    randomRangeInt,
    RigidBody,
    Sprite,
    SpriteFrame,
    Tween,
    tween,
    UITransform,
    Vec2,
    Vec3,
    view,
} from "cc";
import { hurdle } from "./hurdle";

const { ccclass, property } = _decorator;
class Vec3toVec2Converter {
    x: number;
    y: number;
    constructor(vec3: Vec3) {
        this.x = vec3.x;
        this.y = vec3.y;
    }
}

@ccclass("component")
export class component extends Component {
    @property({ type: Node })
    dino: Node = null;
    @property({ type: Prefab })
    nodePrefab: Prefab = null;
    instanceNode: Node[] = [];
    gameOver: boolean = false;
    insNode: Node;
    isDinoJumping = false;
    @property({ type: Node })
    road: Node = null;
    roadPos: number;
    diff: number;
    cactusDiff = randomRangeInt(810, 1100);
    roadRange = 0.5;

    onLoad() {
        if (this.road) {
            this.roadPos = this.road.getPosition().y;
            console.log(this.roadPos);
        }
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

        for (let i = 0; i < 5; i++) {
            this.insNode = instantiate(this.nodePrefab);
            this.node.addChild(this.insNode);
            this.instanceNode.push(this.insNode);
            this.insNode.getComponent(hurdle).setHurdle();

            if (this.roadPos > 0) {
                this.dino.setPosition(
                    -view.getDesignResolutionSize().x / 2 + this.dino.getComponent(UITransform).width,
                    0 + (this.roadPos + this.road.getComponent(UITransform).height),
                    0
                );
                this.insNode.setPosition(
                    view.getDesignResolutionSize().x / 2 + i * this.cactusDiff,
                    0 +
                        (this.roadPos +
                            this.road.getComponent(UITransform).height +
                            this.road.getComponent(UITransform).height * this.roadRange),
                    0
                );
            } else {
                this.dino.setPosition(
                    -view.getDesignResolutionSize().x / 2 + this.dino.getComponent(UITransform).width,
                    this.roadPos + this.road.getComponent(UITransform).height,
                    0
                );
                this.insNode.setPosition(
                    view.getDesignResolutionSize().x / 2 + i * this.cactusDiff,
                    this.roadPos +
                        this.road.getComponent(UITransform).height +
                        this.road.getComponent(UITransform).height * this.roadRange,

                    0
                );
            }
        }
    }

    onTouchStart(event: EventTouch) {
        if (!this.isDinoJumping) {
            this.isDinoJumping = true;

            tween(this.dino)
                .to(
                    0.45,
                    {
                        position: new Vec3(this.dino.getPosition().x + 14, this.dino.getPosition().y + 450, 0),
                    },
                    { easing: "cubicInOut" }
                )
                .to(
                    0.45,
                    {
                        position: new Vec3(this.dino.getPosition().x + 28, this.dino.getPosition().y, 0),
                    },
                    { easing: "cubicInOut", onComplete: () => (this.isDinoJumping = false) }
                )
                .start();
        }
    }

    startMove() {
        this.roadPos = this.road.getWorldPosition().y;
        this.diff = 0 - this.roadPos;
        for (let index = 0; index < this.instanceNode.length; index++) {
            const element = this.instanceNode[index];
            element.setPosition(element.getPosition().x - 16, element.getPosition().y, 0);
        }
        for (const cactus of this.instanceNode) {
            if (cactus.getPosition().x < -view.getDesignResolutionSize().x) {
                if (this.roadPos > 0) {
                    cactus.setPosition(
                        view.getDesignResolutionSize().x + cactus.getComponent(UITransform).width + this.cactusDiff,
                        cactus.getPosition().y,
                        0
                    );
                } else {
                    cactus.setPosition(
                        view.getDesignResolutionSize().x + cactus.getComponent(UITransform).width + this.cactusDiff,
                        cactus.getPosition().y,
                        0
                    );
                }
                // -view.getDesignResolutionSize().y  -
                //     element.getComponent(UITransform).contentSize.height -
                //     this.node.getChildByName("road").getComponent(UITransform).height,
                // -view.getDesignResolutionSize().y / 2 +
                //     element.getComponent(UITransform).contentSize.height +
                //     this.road.getWorldPosition().y,
            }
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

    // secondCheckCollision() {
    //     for (const cactus of this.instanceNode) {
    //         const dinoWorld = this.dino.getComponent(UITransform).getBoundingBoxToWorld();

    //         const cactusWorld = cactus.getWorldPosition();
    //         const dinoVec2 = new Vec2(dinoWorld.x, dinoWorld.y);
    //         const cactusVec2 = new Vec2(cactusWorld.x, cactusWorld.y);

    //         if (Intersection2D.polygonPolygon(dinoVec2, cactusVec2)) {
    //         }
    //     }
    // }

    update(deltaTime: number) {
        this.startMove();
        this.checkCollision();
        if (this.gameOver) {
            //here i will show message when game over/restart game
            setTimeout(() => director.loadScene(director.getScene().name), 1000);
        }
    }
}
