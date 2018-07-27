declare class MenuButton extends GameObject {
    width: number;
    height: number;
    color: string;
    colorText: string;
    text: string;
    font: string;
    fontSize: number;
    posText: Point;
    padingText: number;
    constructor(text: string, pos: Point);
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
