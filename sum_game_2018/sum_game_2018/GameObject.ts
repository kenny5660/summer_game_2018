class Point {
    X: number;
    Y: number;
    constructor(X: number, Y: number) {
        this.X = X;
        this.Y = Y;
    }
}
abstract class GameObject {
    
    abstract Draw(ctx: CanvasRenderingContext2D);
    abstract Update(dT: number);
}
class PlayerGameObject extends GameObject {
    pos: Point;
    Size: number;
    Color: string;
    constructor(pos:Point,Size: number, Color: string) {
        super();
        this.Size = Size;
        this.Color = Color;
        this.pos = pos;
    }

    Draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.Color;
        ctx.beginPath();
        ctx.arc(this.pos.X, this.pos.Y, this.Size, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
    Update(dT: number) {
        this.pos.X += 50 * dT;
    }
}