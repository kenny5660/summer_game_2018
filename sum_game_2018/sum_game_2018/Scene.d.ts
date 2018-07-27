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
    BackgroundColor: string;
    private ctx;
    GameObjects: GameObject[];
    Camera: Camera;
    constructor(canvas: HTMLCanvasElement, Camera: Camera, backgroundColor: string);
    UpdateObjects(dT: number): void;
    DrawObjects(): void;
}
