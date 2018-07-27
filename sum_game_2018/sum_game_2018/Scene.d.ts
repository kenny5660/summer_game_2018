declare class Camera {
    pos: Point;
    private width;
    private height;
    private canvas;
    private followObject;
    constructor(canvas: HTMLCanvasElement, pos: Point, width: number, height: number);
    DrawObjects(GameObjects: GameObject[]): void;
    Update(dT: number): void;
    setFollowObject(followObject: GameObject): void;
}
declare class Scene {
    Canvas: HTMLCanvasElement;
    BackgroundColor: string | CanvasPattern;
    protected ctx: CanvasRenderingContext2D;
    GameObjects: GameObject[];
    Camera: Camera;
    constructor(canvas: HTMLCanvasElement, Camera: Camera, backgroundColor: string | CanvasPattern);
    UpdateObjects(dT: number): void;
    DrawObjects(): void;
}
declare class SceneGame extends Scene {
    eaters: Eater[];
    foods: Food[];
    constructor(canvas: HTMLCanvasElement, backgroundColor: string | CanvasPattern);
    UpdateObjects(dT: number): void;
    DrawObjects(): void;
    private collisions();
}
declare class Collisions {
    static CircleInCircle(posA: Point, rA: number, posB: Point, rB: number): boolean;
}
