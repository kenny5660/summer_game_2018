﻿function sign(x: number): number { return x ? x < 0 ? -1 : 1 : 0; }
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
    negative():Vector {
        this.X = -this.X;
        this.Y = -this.Y;
        return this;
    }

}
class Point {
    X: number;
    Y: number;
    static globalOffset = new Point(0, 0);
    static globalScale = 1;
    constructor(X: number, Y: number) {
        this.X = X;
        this.Y = Y;
    }
    static zoom(newScale: number, scalePoint: Point) {
        var dScale = this.globalScale - newScale;

        this.globalScale = newScale;
        //this.globalOffset = new Point(
        //    Math.round((this.globalOffset.X - scalePoint.X) * this.globalScale / (this.globalScale + dScale)) + scalePoint.X,
        //    Math.round((this.globalOffset.Y - scalePoint.Y) * this.globalScale / (this.globalScale + dScale)) + scalePoint.Y);
    }
    toWorld_Point(): Point {
        var X = (this.X + Point.globalOffset.X) / Point.globalScale;
        var Y = (this.Y + Point.globalOffset.Y) / Point.globalScale;
        return new Point(X, Y);
    }
    toCanvas_Point(): Point {
        var X = Math.floor(this.X * Point.globalScale) + Point.globalOffset.X;
        var Y = Math.floor(this.Y * Point.globalScale) + Point.globalOffset.Y;
        return new Point(X, Y);
    }
    distToPoint(b: Point): number {
        return Math.sqrt((this.X - b.X) * (this.X - b.X) + (this.Y - b.Y) * (this.Y - b.Y));
    }
}
abstract class GameObject {
    pos: Point;
    abstract Draw(ctx: CanvasRenderingContext2D);
    abstract Update(dT: number);
}
class Eater extends GameObject {
    Size: number;
    Scene: SceneGame;
    Color: string;
    Speed: Vector;
    MaxSpeed: number = GameConfig.eaterStartMaxSpeed;
    SpeedUp: number = GameConfig.eaterStartSpeedUp;
    SpeedDown: number = GameConfig.eaterStartSpeedDown;
    VectorSpeedUp: Vector;

    constructor(Scene: SceneGame, pos: Point, Color: string) {
        super();
        this.Scene = Scene;
        this.Size = GameConfig.eaterStartSize;
        this.Color = Color;
        this.pos = pos;
        this.VectorSpeedUp = new Vector(0, 0);
        this.Speed = new Vector(0, 0);
    }


    Draw(ctx: CanvasRenderingContext2D) {
        var canvasPos = this.pos.toCanvas_Point();// new Point(this.pos.X * Point.globalScale, this.pos.Y * Point.globalScale);
        var canvasSize = this.Size * Point.globalScale;

        ctx.fillStyle = this.Color;
        ctx.beginPath();
        ctx.arc(canvasPos.X, canvasPos.Y, canvasSize, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.font = Math.floor(this.Size * GameConfig.eaterSizeTextFontSizeCoef * Point.globalScale) + "px " + GameConfig.eaterSizeTextFont;
        ctx.textAlign = "middle";
        ctx.fillStyle = GameConfig.eaterSizeTextFontColor;
        var posText = new Point(this.pos.toCanvas_Point().X - ctx.measureText(Math.floor(this.Size).toString()).width / 2, this.pos.toCanvas_Point().Y + Math.floor(this.Size * GameConfig.eaterSizeTextFontSizeCoef * Point.globalScale) / 2);
        ctx.fillText(Math.floor(this.Size).toString(), posText.X, posText.Y);
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

        var newPosX = this.pos.X + this.Speed.X * dT;
        var newPosY = this.pos.Y + this.Speed.Y * dT;
        this.pos.X = newPosX < this.Scene.width ? newPosX < 0 ? 0 : newPosX : this.Scene.width;
        this.pos.Y = newPosY < this.Scene.height ? newPosY < 0 ? 0 : newPosY : this.Scene.height;

        var loseSize = this.Size - this.Size * GameConfig.eaterCoefSpeedLoseSize * dT < GameConfig.eaterStartSize ? this.Size - GameConfig.eaterStartSize : this.Size * GameConfig.eaterCoefSpeedLoseSize * dT;
        this.Size -= loseSize;
        this.Scene.foodMass += loseSize;
    }
}
class Bot extends Eater {
    constructor(Scene: SceneGame, pos: Point, Color: string) {
        super(Scene, pos, Color);
    }
    Update(dT: number) {
        var nearestEater: Eater = null;
        var minDistEater = Number.MAX_VALUE
        var nearestFood: Food = null;
        var minDistFood = Number.MAX_VALUE

        for (var i = this.Scene.eaters.length - 1; i >= 0; --i) {
            var dist = this.pos.distToPoint(this.Scene.eaters[i].pos);
            if (minDistEater > dist && this != this.Scene.eaters[i]) {
                minDistEater = dist;
                nearestEater = this.Scene.eaters[i];
            }
        }
        for (var i = this.Scene.foods.length - 1; i >= 0; --i) {
            var dist = this.pos.distToPoint(this.Scene.foods[i].pos);
            if (minDistFood > dist) {
                minDistFood = dist;
                nearestFood = this.Scene.foods[i];
            }
        }

        if (minDistEater - this.Size / 2 < GameConfig.botDistAtackEater) {
            if (nearestEater != null) {
                var eaterVector = new Vector(nearestEater.pos.X, nearestEater.pos.Y);
                var thisVector = new Vector(this.pos.X, this.pos.Y);
                if (nearestEater.Size + GameConfig.botAngry < this.Size) {
                    this.VectorSpeedUp = eaterVector.sub(thisVector).normalize();
                }
                else {
                    this.VectorSpeedUp = eaterVector.sub(thisVector).normalize().negative();
                }
            }
        }
        else {
            if (nearestFood != null) {
                var foodVector = new Vector(nearestFood.pos.X, nearestFood.pos.Y);
                var thisVector = new Vector(this.pos.X, this.pos.Y);
                this.VectorSpeedUp = foodVector.sub(thisVector).normalize();
            }
        }
        super.Update(dT);
    }

}
class Player extends Eater {

    constructor(Scene: SceneGame, pos: Point, Color: string) {
        super(Scene, pos, Color);
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
        this.VectorSpeedUp = mouseVector.sub(playerVector).normalize();
    }
    keydown(e: KeyboardEvent) {
        if (e.keyCode == Key.UpArrow) {
            this.VectorSpeedUp.Y = -1;
        }
        if (e.keyCode == Key.DownArrow) {
            this.VectorSpeedUp.Y = 1;
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
            this.VectorSpeedUp.Y = 0;
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

}

class Food extends GameObject {
    Size: number;
    Color: string;
    Cost: number;
    constructor(pos: Point, Size: number, Color: string) {
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