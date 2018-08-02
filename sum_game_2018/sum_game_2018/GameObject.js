var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }
var Vector = /** @class */ (function () {
    function Vector(X, Y) {
        this.X = X;
        this.Y = Y;
    }
    Vector.prototype.sub = function (b) {
        return new Vector(this.X - b.X, this.Y - b.Y);
    };
    Vector.prototype.normalize = function () {
        var d = Math.sqrt(this.X * this.X + this.Y * this.Y);
        this.X /= d;
        this.Y /= d;
        return this;
    };
    Vector.prototype.negative = function () {
        this.X = -this.X;
        this.Y = -this.Y;
        return this;
    };
    return Vector;
}());
var Point = /** @class */ (function () {
    function Point(X, Y) {
        this.X = X;
        this.Y = Y;
    }
    Point.zoom = function (newScale, scalePoint) {
        var dScale = this.globalScale - newScale;
        this.globalScale = newScale;
        //this.globalOffset = new Point(
        //    Math.round((this.globalOffset.X - scalePoint.X) * this.globalScale / (this.globalScale + dScale)) + scalePoint.X,
        //    Math.round((this.globalOffset.Y - scalePoint.Y) * this.globalScale / (this.globalScale + dScale)) + scalePoint.Y);
    };
    Point.prototype.toWorld_Point = function () {
        var X = (this.X + Point.globalOffset.X) / Point.globalScale;
        var Y = (this.Y + Point.globalOffset.Y) / Point.globalScale;
        return new Point(X, Y);
    };
    Point.prototype.toCanvas_Point = function () {
        var X = Math.floor(this.X * Point.globalScale) + Point.globalOffset.X;
        var Y = Math.floor(this.Y * Point.globalScale) + Point.globalOffset.Y;
        return new Point(X, Y);
    };
    Point.prototype.distToPoint = function (b) {
        return Math.sqrt((this.X - b.X) * (this.X - b.X) + (this.Y - b.Y) * (this.Y - b.Y));
    };
    Point.globalOffset = new Point(0, 0);
    Point.globalScale = 1;
    return Point;
}());
var GameObject = /** @class */ (function () {
    function GameObject() {
    }
    return GameObject;
}());
var Eater = /** @class */ (function (_super) {
    __extends(Eater, _super);
    function Eater(Scene, pos, Color) {
        var _this = _super.call(this) || this;
        _this.MaxSpeed = GameConfig.eaterStartMaxSpeed;
        _this.SpeedUp = GameConfig.eaterStartSpeedUp;
        _this.SpeedDown = GameConfig.eaterStartSpeedDown;
        _this.isAccelerate = false;
        _this.Scene = Scene;
        _this.Size = GameConfig.eaterStartSize;
        _this.Color = Color;
        _this.pos = pos;
        _this.VectorSpeedUp = new Vector(1, 0);
        _this.Speed = new Vector(10, 10);
        return _this;
    }
    Eater.prototype.Draw = function (ctx) {
        var canvasPos = this.pos.toCanvas_Point(); // new Point(this.pos.X * Point.globalScale, this.pos.Y * Point.globalScale);
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
    };
    Eater.prototype.Update = function (dT) {
        this.Accelerate(dT);
        this.Speed.X = this.Speed.X <= this.MaxSpeed && this.Speed.X >= -this.MaxSpeed ? this.Speed.X + this.SpeedUp * this.VectorSpeedUp.X * dT : this.MaxSpeed * sign(this.Speed.X);
        this.Speed.Y = this.Speed.Y <= this.MaxSpeed && this.Speed.Y >= -this.MaxSpeed ? this.Speed.Y + this.SpeedUp * this.VectorSpeedUp.Y * dT : this.MaxSpeed * sign(this.Speed.Y);
        this.Speed.X += this.Speed.X * this.Speed.X * -GameConfig.eaterFrictionSpeedDownCoef * dT * sign(this.Speed.X);
        this.Speed.Y += this.Speed.Y * this.Speed.Y * -GameConfig.eaterFrictionSpeedDownCoef * dT * sign(this.Speed.Y);
        var newPosX = this.pos.X + this.Speed.X * dT;
        var newPosY = this.pos.Y + this.Speed.Y * dT;
        this.pos.X = newPosX < this.Scene.width ? newPosX < 0 ? 0 : newPosX : this.Scene.width;
        this.pos.Y = newPosY < this.Scene.height ? newPosY < 0 ? 0 : newPosY : this.Scene.height;
        var loseSize = this.Size - this.Size * GameConfig.eaterCoefSpeedLoseSize * dT < GameConfig.eaterStartSize ? this.Size - GameConfig.eaterStartSize : this.Size * GameConfig.eaterCoefSpeedLoseSize * dT;
        this.Size -= loseSize;
        this.Scene.foodMass += loseSize;
    };
    Eater.prototype.Accelerate = function (dT) {
        if (this.isAccelerate && this.Size > GameConfig.eaterStartSize) {
            this.SpeedUp = GameConfig.eaterAccelerateSpeedUp;
            var loseSize = this.Size - GameConfig.eaterAccelerateSpeedLoseSize * dT < GameConfig.eaterStartSize ? this.Size - GameConfig.eaterStartSize : GameConfig.eaterAccelerateSpeedLoseSize * dT;
            this.Size -= loseSize;
            this.Scene.foodMass += loseSize;
        }
        else {
            this.SpeedUp = GameConfig.eaterStartSpeedUp;
        }
    };
    return Eater;
}(GameObject));
var Bot = /** @class */ (function (_super) {
    __extends(Bot, _super);
    function Bot(Scene, pos, Color) {
        return _super.call(this, Scene, pos, Color) || this;
    }
    Bot.prototype.Update = function (dT) {
        var nearestEater = null;
        var minDistEater = Number.MAX_VALUE;
        var nearestFood = null;
        var minDistFood = Number.MAX_VALUE;
        for (var i = this.Scene.eaters.length - 1; i >= 0; --i) {
            var dist = this.pos.distToPoint(this.Scene.eaters[i].pos);
            if (minDistEater > dist && this != this.Scene.eaters[i]) {
                minDistEater = dist;
                nearestEater = this.Scene.eaters[i];
            }
        }
        nearestFood = this.Scene.foods.nearest(this);
        if (minDistEater - this.Size / 2 - nearestEater.Size / 2 < GameConfig.botDistAtackEater) {
            if (nearestEater != null) {
                var eaterVector = new Vector(nearestEater.pos.X, nearestEater.pos.Y);
                var thisVector = new Vector(this.pos.X, this.pos.Y);
                if (nearestEater.Size + GameConfig.botAngry < this.Size) {
                    this.VectorSpeedUp = eaterVector.sub(thisVector).normalize();
                    this.isAccelerate = nearestEater.Size + GameConfig.botAngry + GameConfig.botAngryAccelerateDistCoef * minDistEater < this.Size;
                }
                else {
                    this.VectorSpeedUp = eaterVector.sub(thisVector).normalize().negative();
                }
            }
        }
        else {
            this.isAccelerate = false;
            if (nearestFood != null) {
                var foodVector = new Vector(nearestFood.pos.X, nearestFood.pos.Y);
                var thisVector = new Vector(this.pos.X, this.pos.Y);
                this.VectorSpeedUp = foodVector.sub(thisVector).normalize();
            }
        }
        _super.prototype.Update.call(this, dT);
    };
    return Bot;
}(Eater));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(Scene, pos, Color) {
        var _this = _super.call(this, Scene, pos, Color) || this;
        var input = _this;
        addEventListener("keydown", function (e) { return input.keydown(e); });
        addEventListener("keyup", function (e) { return input.keyup(e); });
        addEventListener("touchstart", function (e) { return input.touchStart(e); });
        addEventListener("touchstart", function (e) { return input.touchCancel(e); });
        document.addEventListener("touchmove", function (e) { e.preventDefault(); input.touchMove(e); }, { passive: false });
        addEventListener("mousemove", function (e) { return input.mouseMove(e); });
        addEventListener("mousedown", function (e) { return input.mouseDown(e); });
        addEventListener("mouseup", function (e) { return input.mouseUp(e); });
        return _this;
    }
    Player.prototype.touchStart = function (e) {
        this.isAccelerate = e.touches.length > 1;
    };
    Player.prototype.touchCancel = function (e) {
        this.isAccelerate = e.touches.length > 1;
    };
    Player.prototype.touchMove = function (e) {
        var touchVector = new Vector(e.touches[0].pageX, e.touches[0].pageY);
        var canvasPos = this.pos.toCanvas_Point();
        var playerVector = new Vector(canvasPos.X, canvasPos.Y);
        this.VectorSpeedUp = touchVector.sub(playerVector).normalize();
        this.isAccelerate = e.touches.length > 1;
        return false;
    };
    Player.prototype.mouseMove = function (e) {
        var mouseVector = new Vector(e.x, e.y);
        var canvasPos = this.pos.toCanvas_Point();
        var playerVector = new Vector(canvasPos.X, canvasPos.Y);
        this.VectorSpeedUp = mouseVector.sub(playerVector).normalize();
    };
    Player.prototype.mouseDown = function (e) {
        if (e.which == Key.MauseLeftBut) {
            this.isAccelerate = true;
        }
    };
    Player.prototype.mouseUp = function (e) {
        if (e.which == Key.MauseLeftBut) {
            this.isAccelerate = false;
        }
    };
    Player.prototype.keydown = function (e) {
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
        if (e.keyCode == Key.Space) {
            this.isAccelerate = true;
        }
    };
    Player.prototype.keyup = function (e) {
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
        if (e.keyCode == Key.Space) {
            this.isAccelerate = false;
        }
    };
    return Player;
}(Eater));
var Food = /** @class */ (function (_super) {
    __extends(Food, _super);
    function Food(pos, Size, Cost, Color) {
        var _this = _super.call(this) || this;
        _this.Size = Size;
        _this.pos = pos;
        _this.Cost = Cost;
        _this.Color = Color;
        return _this;
    }
    Food.prototype.Draw = function (ctx) {
        var canvasPos = this.pos.toCanvas_Point();
        var canvasSize = this.Size * Point.globalScale;
        ctx.fillStyle = this.Color;
        ctx.beginPath();
        ctx.arc(canvasPos.X, canvasPos.Y, canvasSize, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    };
    Food.prototype.Update = function (dT) {
    };
    return Food;
}(GameObject));
//# sourceMappingURL=GameObject.js.map