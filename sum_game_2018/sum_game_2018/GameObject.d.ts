interface KeyBoardListener {
    keydown(e: KeyboardEvent): any;
    keyup(e: KeyboardEvent): any;
}
declare class Point {
    X: number;
    Y: number;
    constructor(X: number, Y: number);
}
declare abstract class GameObject {
    abstract Draw(ctx: CanvasRenderingContext2D): any;
    abstract Update(dT: number): any;
}
declare class PlayerGameObject extends GameObject implements KeyBoardListener {
    pos: Point;
    Size: number;
    Color: string;
    Speed: Point;
    MaxSpeed: number;
    SpeedUp: number;
    SpeedDown: number;
    VectorSpeedUp: Point;
    constructor(pos: Point, Size: number, Color: string);
    keydown(e: KeyboardEvent): void;
    keyup(e: KeyboardEvent): void;
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
