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
    static globalOffset = new Point(0,0);
    static globalScale = 1;
    constructor(X: number, Y: number) {
        this.X = X;
        this.Y = Y;
    }
    toWorld_Point(): Point{
        var X = (this.X + Point.globalOffset.X) / Point.globalScale;
        var Y = (this.Y + Point.globalOffset.Y) / Point.globalScale;
        return new Point(X, Y);
    }
    toCanvas_Point(): Point {
        var X = Math.round(this.X * Point.globalScale) + Point.globalOffset.X;
        var Y = Math.round(this.Y * Point.globalScale) + Point.globalOffset.Y;
        return new Point(X,Y);
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
    canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement, Color: string) {
        super();
        this.canvas = canvas;
        this.Size = GameConfig.startPlayerSize;
        this.Color = Color;
        this.pos = new Point(canvas.width / 2, canvas.height / 2).toWorld_Point();
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
        var canvasPos = this.pos.toCanvas_Point();
        var playerVector = new Vector(canvasPos.X, canvasPos.Y);
    //    this.VectorSpeedUp = mouseVector.sub(playerVector).normalize();
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
        if (e.keyCode == Key.R) {
            Point.globalScale = 0.5;
        }
    }

    Draw(ctx: CanvasRenderingContext2D) {
        var canvasPos = this.pos.toCanvas_Point();
        var canvasSize = this.Size * Point.globalScale;
        ctx.fillStyle = this.Color;
        ctx.beginPath();
        ctx.arc(canvasPos.X, canvasPos.Y, canvasSize, 0, 2 * Math.PI, false);
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
        Point.globalOffset.X += this.Speed.X * dT;
        Point.globalOffset.Y += this.Speed.Y * dT;
        this.pos = new Point(this.canvas.width / 2, this.canvas.height / 2).toWorld_Point();
    }
}

class eatedObject extends GameObject {
    pos: Point;
    Size: number;
    Color: string;
    constructor(pos:Point,Size: number,Color: string) {
        super();
        this.Size = Size;
        this.pos = pos;
        this.Color = Color;
    }
    Draw(ctx: CanvasRenderingContext2D) {
        var canvasPos = this.pos.toCanvas_Point();
        var canvasSize = this.Size * Point.globalScale;
        ctx.fillStyle = this.Color;
        ctx.beginPath();
        ctx.arc(canvasPos.X, canvasPos.Y, canvasSize, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
    Update(dT: number) {
    }
}