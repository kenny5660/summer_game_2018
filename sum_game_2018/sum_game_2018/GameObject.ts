interface KeyBoardListener {
    keydown(e: KeyboardEvent);
    keyup(e: KeyboardEvent);
}
function sign(x: number): number { return x ? x < 0 ? -1 : 1 : 0; }
class Vector {
    X: number;
    Y: number;
    constructor(X: number, Y: number) {
        this.X = X;
        this.Y = Y;
    }
    sub(b: Vector): Vector {
        return new Vector(this.X - b.X, this.Y - b.Y)
    }
    normalize(): Vector {
        var d = Math.sqrt(this.X * this.X + this.Y * this.Y);
        this.X /= d;
        this.Y /= d;
        return this;
    }
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
    Speed: Vector;
    MaxSpeed: number = 150;
    SpeedUp: number = 170;
    SpeedDown: number = 200;
    VectorSpeedUp: Vector;
    constructor(pos: Point, Size: number, Color: string) {
        super();
        this.Size = Size;
        this.Color = Color;
        this.pos = pos;
        this.VectorSpeedUp = new Vector(0, 0);
        this.Speed = new Vector(0, 0);
        var input = this;
        addEventListener("keydown", KeyBoardListener_keydown);
        addEventListener("keyup", KeyBoardListener_keyup);
        addEventListener("mousemove", MouseListener_Move);
        function KeyBoardListener_keydown(e: KeyboardEvent) {
            input.keydown(e);
        }
        function MouseListener_Move(e: MouseEvent) {
            input.mouseMove(e);
        }
        function KeyBoardListener_keyup(e: KeyboardEvent) {
            input.keyup(e);
        }
    }
    mouseMove(e: MouseEvent) {
        var mouseVector = new Vector(e.x, e.y);
        var playerVector = new Vector(this.pos.X, this.pos.Y);
        this.VectorSpeedUp = mouseVector.sub(playerVector).normalize();
    }
    keydown(e: KeyboardEvent) {
        if (e.keyCode == Key.UpArrow) {
            this.VectorSpeedUp.Y = -1;
        }
        if (e.keyCode == Key.DownArrow) {
            this.VectorSpeedUp.Y =  1;
        }
        if (e.keyCode == Key.RightArrow) {
            this.VectorSpeedUp.X = 1;
        }
        if (e.keyCode == Key.LeftArrow) {
            this.VectorSpeedUp.X = -1;
        }
    }
    keyup(e: KeyboardEvent) {
        if (e.keyCode == Key.DownArrow) {
            this.VectorSpeedUp.Y =0;
        }
        if (e.keyCode == Key.UpArrow) {
            this.VectorSpeedUp.Y = 0;
        }
        if (e.keyCode == Key.LeftArrow) {
            this.VectorSpeedUp.X = 0;
        }
        if (e.keyCode == Key.RightArrow) {
            this.VectorSpeedUp.X = 0;
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
        this.Speed.X = this.Speed.X <= this.MaxSpeed && this.Speed.X >= -this.MaxSpeed ? this.Speed.X + this.SpeedUp * this.VectorSpeedUp.X * dT : this.MaxSpeed * sign(this.Speed.X);
        this.Speed.Y = this.Speed.Y <= this.MaxSpeed && this.Speed.Y >= -this.MaxSpeed ? this.Speed.Y + this.SpeedUp * this.VectorSpeedUp.Y * dT : this.MaxSpeed * sign(this.Speed.Y);
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