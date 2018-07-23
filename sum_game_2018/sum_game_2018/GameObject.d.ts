declare class Point {
    X: number;
    Y: number;
    constructor(X: number, Y: number);
}
declare abstract class GameObject {
    abstract Draw(ctx: CanvasRenderingContext2D): any;
    abstract Update(dT: number): any;
}
declare class PlayerGameObject extends GameObject {
    pos: Point;
    Size: number;
    Color: string;
    constructor(pos: Point, Size: number, Color: string);
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
