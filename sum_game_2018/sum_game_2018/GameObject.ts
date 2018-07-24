interface KeyBoardListener {
    keydown(e: KeyboardEvent);
    keyup(e: KeyboardEvent);
}

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
class PlayerGameObject extends GameObject implements KeyBoardListener {
    pos: Point;
    Size: number;
    Color: string;
    Speed: Point;
    MaxSpeed: number = 100;
    SpeedUp: number = 100;
    SpeedDown: number = 150;
    VectorSpeedUp: Point;
    constructor(pos: Point, Size: number, Color: string) {
        super();
        this.Size = Size;
        this.Color = Color;
        this.pos = pos;
        this.VectorSpeedUp = new Point(0, 0);
        this.Speed = new Point(0, 0);
    }
    keydown(e: KeyboardEvent) {
        if (e.keyCode == Key.UpArrow) {
            this.VectorSpeedUp.Y = this.VectorSpeedUp.Y <= -1 ? -1 : this.VectorSpeedUp.Y - 1;
        }
        if (e.keyCode == Key.DownArrow) {
            this.VectorSpeedUp.Y = this.VectorSpeedUp.Y >= 1 ? 1 : this.VectorSpeedUp.Y + 1;
        }
        if (e.keyCode == Key.RightArrow) {
            this.VectorSpeedUp.X = this.VectorSpeedUp.X >= 1 ? 1 : this.VectorSpeedUp.X + 1;
        }
        if (e.keyCode == Key.LeftArrow) {
            this.VectorSpeedUp.X = this.VectorSpeedUp.X <= -1 ? -1 : this.VectorSpeedUp.X - 1;
        }
    }
    keyup(e: KeyboardEvent) {
        if (e.keyCode == Key.DownArrow) {
            this.VectorSpeedUp.Y = this.VectorSpeedUp.Y <= -1 ? -1 : this.VectorSpeedUp.Y - 1;
        }
        if (e.keyCode == Key.UpArrow) {
            this.VectorSpeedUp.Y = this.VectorSpeedUp.Y >= 1 ? 1 : this.VectorSpeedUp.Y + 1;
        }
        if (e.keyCode == Key.LeftArrow) {
            this.VectorSpeedUp.X = this.VectorSpeedUp.X >= 1 ? 1 : this.VectorSpeedUp.X + 1;
        }
        if (e.keyCode == Key.RightArrow) {
            this.VectorSpeedUp.X = this.VectorSpeedUp.X <= -1 ? -1 : this.VectorSpeedUp.X - 1;
        }
    }

    Draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.Color;
        ctx.beginPath();
        ctx.arc(this.pos.X, this.pos.Y, this.Size, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
    Update(dT: number) {
        this.Speed.X = this.Speed.X <= this.MaxSpeed && this.Speed.X >= -this.MaxSpeed  ? this.Speed.X + this.SpeedUp * this.VectorSpeedUp.X * dT : this.Speed.X;
        this.Speed.Y = this.Speed.Y <= this.MaxSpeed && this.Speed.Y >= -this.MaxSpeed ? this.Speed.Y + this.SpeedUp * this.VectorSpeedUp.Y * dT : this.Speed.Y;
        if (this.VectorSpeedUp.X == 0) {
            this.Speed.X = this.Speed.X > 0 ? this.Speed.X - this.SpeedDown * dT : this.Speed.X;
            this.Speed.X = this.Speed.X < 0 ? this.Speed.X + this.SpeedDown * dT : this.Speed.X;
        }
        if (this.VectorSpeedUp.Y == 0) {
            this.Speed.Y = this.Speed.Y > 0 ? this.Speed.Y - this.SpeedDown * dT : this.Speed.Y;
            this.Speed.Y = this.Speed.Y < 0 ? this.Speed.Y + this.SpeedDown * dT : this.Speed.Y;
        }
        this.pos.X += this.Speed.X * dT;
        this.pos.Y += this.Speed.Y * dT;
    }
}