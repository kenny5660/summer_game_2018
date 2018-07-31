declare function sign(x: number): number;
declare class Vector {
    X: number;
    Y: number;
    constructor(X: number, Y: number);
    sub(b: Vector): Vector;
    normalize(): Vector;
    negative(): Vector;
}
declare class Point {
    X: number;
    Y: number;
    static globalOffset: Point;
    static globalScale: number;
    constructor(X: number, Y: number);
    static zoom(newScale: number, scalePoint: Point): void;
    toWorld_Point(): Point;
    toCanvas_Point(): Point;
    distToPoint(b: Point): number;
}
declare abstract class GameObject {
    pos: Point;
    abstract Draw(ctx: CanvasRenderingContext2D): any;
    abstract Update(dT: number): any;
}
declare class Eater extends GameObject {
    Size: number;
    Scene: SceneGame;
    Color: string;
    Speed: Vector;
    MaxSpeed: number;
    SpeedUp: number;
    SpeedDown: number;
    VectorSpeedUp: Vector;
    isForcing: boolean;
    constructor(Scene: SceneGame, pos: Point, Color: string);
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
    private forcing(dT);
}
declare class Bot extends Eater {
    constructor(Scene: SceneGame, pos: Point, Color: string);
    Update(dT: number): void;
}
declare class Player extends Eater {
    constructor(Scene: SceneGame, pos: Point, Color: string);
    private touchStart(e);
    private touchCancel(e);
    private touchMove(e);
    private mouseMove(e);
    private mouseDown(e);
    private mouseUp(e);
    private keydown(e);
    private keyup(e);
}
declare class Food extends GameObject {
    Size: number;
    Color: string;
    Cost: number;
    constructor(pos: Point, Size: number, Cost: number, Color: string);
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
