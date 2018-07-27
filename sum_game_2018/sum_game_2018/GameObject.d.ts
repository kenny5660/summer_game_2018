declare function sign(x: number): number;
declare class Vector {
    X: number;
    Y: number;
    constructor(X: number, Y: number);
    sub(b: Vector): Vector;
    normalize(): Vector;
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
}
declare abstract class GameObject {
    pos: Point;
    abstract Draw(ctx: CanvasRenderingContext2D): any;
    abstract Update(dT: number): any;
}
declare abstract class Eater extends GameObject {
    Size: number;
    Color: string;
    Speed: Vector;
    MaxSpeed: number;
    SpeedUp: number;
    SpeedDown: number;
    VectorSpeedUp: Vector;
    canvas: HTMLCanvasElement;
}
declare class PlayerGameObject extends Eater {
    constructor(canvas: HTMLCanvasElement, Color: string);
    mouseMove(e: MouseEvent): void;
    keydown(e: KeyboardEvent): void;
    keyup(e: KeyboardEvent): void;
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
declare class Food extends GameObject {
    Size: number;
    Color: string;
    Cost: number;
    constructor(pos: Point, Size: number, Color: string);
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
