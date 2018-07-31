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
var Camera = /** @class */ (function () {
    function Camera(canvas, pos, width, height) {
        this.followObject = null;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.pos = pos;
    }
    Camera.prototype.DrawObjects = function (GameObjects) {
        for (var i = GameObjects.length - 1; i >= 0; --i) {
            GameObjects[i].Draw(this.canvas.getContext('2d'));
        }
    };
    Camera.prototype.Update = function (dT) {
        if (this.followObject.Size * Point.globalScale > GameConfig.maxCameraPlayerSize) {
            var deltaSizeCoef = (GameConfig.minCameraPlayerSize) / (this.followObject.Size);
            this.width /= deltaSizeCoef;
            this.height /= deltaSizeCoef;
        }
        if (this.followObject.Size * Point.globalScale < GameConfig.minCameraPlayerSize) {
            var deltaSizeCoef = this.followObject.Size / GameConfig.minCameraPlayerSize;
            this.width /= deltaSizeCoef;
            this.height /= deltaSizeCoef;
        }
        Point.globalScale = 1 / Math.max(this.width / this.canvas.width, this.height / this.canvas.height);
        if (this.followObject != null) {
            this.pos.X = Math.floor(-this.followObject.pos.X * Point.globalScale + this.canvas.width / 2);
            this.pos.Y = Math.floor(-this.followObject.pos.Y * Point.globalScale + this.canvas.height / 2);
        }
        Point.globalOffset = this.pos;
    };
    Camera.prototype.setFollowObject = function (followObject) {
        this.followObject = followObject;
    };
    return Camera;
}());
var Scene = /** @class */ (function () {
    function Scene(canvas, Camera, backgroundColor) {
        this.GameObjects = [];
        this.Canvas = canvas;
        this.BackgroundColor = backgroundColor;
        this.ctx = this.Canvas.getContext('2d');
        this.Camera = Camera;
    }
    Scene.prototype.UpdateObjects = function (dT) {
        this.Camera.Update(dT);
        for (var i = this.GameObjects.length - 1; i >= 0; --i) {
            this.GameObjects[i].Update(dT);
        }
    };
    Scene.prototype.DrawObjects = function () {
        this.ctx.fillStyle = this.BackgroundColor;
        this.ctx.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.ctx.restore();
        this.Camera.DrawObjects(this.GameObjects);
    };
    return Scene;
}());
var SceneGame = /** @class */ (function (_super) {
    __extends(SceneGame, _super);
    function SceneGame(canvas, width, height, backgroundColor) {
        var _this = this;
        var gameCamera = new Camera(canvas, new Point(0, 0), GameConfig.canvasWidthDefault, GameConfig.canvasHeghtDefault);
        _this = _super.call(this, canvas, gameCamera, backgroundColor) || this;
        _this.eaters = [];
        _this.foods = [];
        _this.width = width;
        _this.height = height;
        _this.foodMass = GameConfig.foodMass;
        _this.generateEaters();
        _this.generateFood();
        return _this;
    }
    SceneGame.prototype.UpdateObjects = function (dT) {
        for (var i = this.foods.length - 1; i >= 0; --i) {
            this.foods[i].Update(dT);
        }
        for (var i = this.eaters.length - 1; i >= 0; --i) {
            this.eaters[i].Update(dT);
        }
        _super.prototype.UpdateObjects.call(this, dT);
        this.collisions();
        this.generateFood();
    };
    SceneGame.prototype.DrawObjects = function () {
        this.ctx.fillStyle = this.BackgroundColor;
        this.ctx.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.ctx.restore;
        for (var i = this.foods.length - 1; i >= 0; --i) {
            this.foods[i].Draw(this.ctx);
        }
        for (var i = this.eaters.length - 1; i >= 0; --i) {
            this.eaters[i].Draw(this.ctx);
        }
    };
    SceneGame.prototype.generateEaters = function () {
        this.player = new Player(this, new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), "green");
        this.foodMass -= this.player.Size;
        this.eaters.push(this.player);
        for (var i = 0; i < GameConfig.botNumber; ++i) {
            var bot = new Bot(this, new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), "red");
            this.foodMass -= bot.Size;
            this.eaters.push(bot);
        }
        this.Camera.setFollowObject(this.player);
        // this.Camera.setFollowObject(this.eaters[2]);
    };
    SceneGame.prototype.generateFood = function () {
        for (; this.foodMass >= 1;) {
            var foodSizeDB = Math.abs(Math.random()) < GameConfig.food2xChance ? 2 : 1;
            this.foods.push(new Food(new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), foodSizeDB * GameConfig.foodSize, GameConfig.foodCost * foodSizeDB, "purple"));
            this.foodMass -= GameConfig.foodCost * foodSizeDB;
        }
    };
    SceneGame.prototype.collisions = function () {
        for (var i = this.eaters.length - 1; i >= 0; --i) {
            for (var j = this.foods.length - 1; j >= 0; --j) {
                if (Collisions.CircleInCircle(this.eaters[i].pos, this.eaters[i].Size, this.foods[j].pos, this.foods[j].Size)) {
                    this.eaters[i].Size += this.foods[j].Cost;
                    this.foods.splice(j, 1);
                }
            }
            for (var j = this.eaters.length - 1; j >= 0; --j) {
                if (i != j) {
                    if (Collisions.CircleInCircle(this.eaters[i].pos, this.eaters[i].Size, this.eaters[j].pos, this.eaters[j].Size)) {
                        if (this.eaters[i].Size > this.eaters[j].Size) {
                            this.eaters[i].Size += this.eaters[j].Size;
                            this.eaters.splice(j, 1);
                            break;
                        }
                        if (this.eaters[i].Size < this.eaters[j].Size) {
                            this.eaters[j].Size += this.eaters[i].Size;
                            this.eaters.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
    };
    return SceneGame;
}(Scene));
var Collisions = /** @class */ (function () {
    function Collisions() {
    }
    Collisions.CircleInCircle = function (posA, rA, posB, rB) {
        //(x2-x1)^2 + (y1-y2)^2 <= (r1-r2)^2
        return (posA.X - posB.X) * (posA.X - posB.X) + (posA.Y - posB.Y) * (posA.Y - posB.Y) <= (rA - rB) * (rA - rB);
    };
    return Collisions;
}());
//# sourceMappingURL=Scene.js.map