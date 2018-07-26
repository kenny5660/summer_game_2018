interface KeyBoardListener {
    keydown(e: KeyboardEvent): any;
    keyup(e: KeyboardEvent): any;
}
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
    toWorld_Point(): Point;
    toCanvas_Point(): Point;
}
declare abstract class GameObject {
    abstract Draw(ctx: CanvasRenderingContext2D): any;
    abstract Update(dT: number): any;
}
declare class PlayerGameObject extends GameObject implements KeyBoardListener {
    pos: Point;
    Size: number;
    Color: string;
    Speed: Vector;
    MaxSpeed: number;
    SpeedUp: number;
    SpeedDown: number;
    VectorSpeedUp: Vector;
    canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement, Color: string);
    mouseMove(e: MouseEvent): void;
    keydown(e: KeyboardEvent): void;
    keyup(e: KeyboardEvent): void;
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
declare class eatedObject extends GameObject {
    pos: Point;
    Size: number;
    Color: string;
    constructor(pos: Point, Size: number, Color: string);
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
