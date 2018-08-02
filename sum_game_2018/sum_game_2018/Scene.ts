class Camera {
    pos: Point;
    public width: number;
    public height: number;
    private canvas: HTMLCanvasElement;
    private followObject: Eater = null;
    constructor(canvas: HTMLCanvasElement, pos: Point, width: number, height: number) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.pos = pos;
    }
    DrawObjects(GameObjects: GameObject[]) {
        for (var i = GameObjects.length - 1; i >= 0; --i) {
            GameObjects[i].Draw(this.canvas.getContext('2d'));
        }
    }
    Update(dT: number) {
        if (this.followObject.Size * Point.globalScale > GameConfig.maxCameraPlayerSize) {
            var deltaSizeCoef = (GameConfig.minCameraPlayerSize + 5) / this.followObject.Size;
            this.width = this.canvas.width / deltaSizeCoef;
            this.height = this.canvas.height / deltaSizeCoef;
        }
        if (this.followObject.Size * Point.globalScale < GameConfig.minCameraPlayerSize) {
            var deltaSizeCoef = this.followObject.Size / GameConfig.minCameraPlayerSize;
            this.width = this.canvas.width / deltaSizeCoef;
            this.height = this.canvas.height / deltaSizeCoef;
        }

        Point.globalScale = 1 / Math.max(this.width / this.canvas.width, this.height / this.canvas.height);
        if (this.followObject != null) {
            this.pos.X = Math.floor(-this.followObject.pos.X * Point.globalScale + this.canvas.width / 2);
            this.pos.Y = Math.floor(-this.followObject.pos.Y * Point.globalScale + this.canvas.height / 2);
        }
        Point.globalOffset = this.pos;
    }
    setFollowObject(followObject: Eater) {
        this.followObject = followObject;
    }
}


class Scene {
    public Canvas: HTMLCanvasElement;
    public BackgroundColor: string | CanvasPattern;
    protected ctx: CanvasRenderingContext2D;
    public GameObjects: GameObject[] = [];
    public Camera: Camera;
    constructor(canvas: HTMLCanvasElement, Camera: Camera, backgroundColor: string | CanvasPattern) {
        this.Canvas = canvas;
        this.BackgroundColor = backgroundColor;
        this.ctx = this.Canvas.getContext('2d');
        this.Camera = Camera;
    }
    UpdateObjects(dT: number) {
        this.Camera.Update(dT);
        for (var i = this.GameObjects.length - 1; i >= 0; --i) {
            this.GameObjects[i].Update(dT);
        }

    }
    DrawObjects() {
        this.ctx.fillStyle = this.BackgroundColor;
        this.ctx.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.ctx.restore();
        this.Camera.DrawObjects(this.GameObjects);
    }
}
class SceneGame extends Scene {
    eaters: Eater[];
    foods: Food[];
    width: number;
    height: number;
    foodMass: number;
    foodMassFirst: number;
    nickName: string
    protected player: Player;

    constructor(canvas: HTMLCanvasElement, width: number, height: number, foodMassFirst: number, nickName: string, backgroundColor: string | CanvasPattern) {
        var gameCamera = new Camera(canvas, new Point(0, 0), GameConfig.canvasWidthDefault, GameConfig.canvasHeghtDefault);
        super(canvas, gameCamera, backgroundColor);
        this.eaters = [];
        this.foods = [];
        this.width = width;
        this.height = height;
        this.foodMassFirst = foodMassFirst;
        this.foodMass = this.foodMassFirst;
        this.nickName = nickName;
        this.generateEaters();
        this.generateFood();
  
    }
     restart() {
        this.eaters.splice(0, this.eaters.length);
        this.foods.splice(0, this.foods.length);

        this.foodMass = this.foodMassFirst;
        this.generateEaters();
        this.generateFood();
    }

    UpdateObjects(dT: number) {

        for (var i = this.foods.length - 1; i >= 0; --i) {
            this.foods[i].Update(dT);
        }
        for (var i = this.eaters.length - 1; i >= 0; --i) {
            this.eaters[i].Update(dT);
        }
        super.UpdateObjects(dT);
        this.collisions();
        this.generateFood();

    }

    DrawObjects() {
        this.ctx.fillStyle = this.BackgroundColor;
        this.ctx.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.ctx.restore;
        for (var i = this.foods.length - 1; i >= 0; --i) {
            this.foods[i].Draw(this.ctx);
        }
        for (var i = this.eaters.length - 1; i >= 0; --i) {
            this.eaters[i].Draw(this.ctx);
        }
    }

    protected generateEaters() {
        this.player = new Player(this, new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), "green", this.nickName);
        this.foodMass -= this.player.Size;
        this.eaters.push(this.player);

        for (var i = 0; i < GameConfig.botNumber; ++i) {
            var bot = new Bot(this, new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), "red");
            this.foodMass -= bot.Size;
            this.eaters.push(bot);
        }
        this.Camera.setFollowObject(this.player);
        // this.Camera.setFollowObject(this.eaters[2]);
    }

    private generateFood() {
        for (; this.foodMass >= 1;) {

            var foodSizeDB = Math.abs(Math.random()) < GameConfig.food2xChance ? 2 : 1
            this.foods.push(new Food(new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), foodSizeDB * GameConfig.foodSize, GameConfig.foodCost * foodSizeDB, "purple"));
            this.foodMass -= GameConfig.foodCost * foodSizeDB;
        }
    }

    protected eaterEaterCollision(big: Eater, small: Eater): boolean {
        if (small == this.player) {
            //game over
            this.restart();
            return false;
        }
        return true;
    }
    protected eaterFoodCollision(eater: Eater, food: Food): boolean {
        if (eater == this.player) {
            //game win
        }
        return true;
    }
    private collisions() {
        for (var i = this.eaters.length - 1; i >= 0; --i) {
            for (var j = this.foods.length - 1; j >= 0; --j) {
                if (Collisions.CircleInCircle(this.eaters[i].pos, this.eaters[i].Size, this.foods[j].pos, this.foods[j].Size)) {

                    this.eaters[i].Size += this.foods[j].Cost;
                    this.foods.splice(j, 1);
                    this.eaterFoodCollision(this.eaters[i], this.foods[j]);
                }
            }
            for (var j = this.eaters.length - 1; j >= 0; --j) {
                if (i != j) {
                    if (Collisions.CircleInCircle(this.eaters[i].pos, this.eaters[i].Size, this.eaters[j].pos, this.eaters[j].Size)) {
                        if (this.eaters[i].Size > this.eaters[j].Size) {
                            if (this.eaterEaterCollision(this.eaters[j], this.eaters[i])) {
                                this.eaters[i].Size += this.eaters[j].Size;
                                this.eaters.splice(j, 1);
                            }
                            break;
                        }
                        if (this.eaters[i].Size < this.eaters[j].Size) {
                            if (this.eaterEaterCollision(this.eaters[j], this.eaters[i])) {
                                this.eaters[j].Size += this.eaters[i].Size;
                                this.eaters.splice(i, 1);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
}

class Collisions {

    static CircleInCircle(posA: Point, rA: number, posB: Point, rB: number): boolean {
        //(x2-x1)^2 + (y1-y2)^2 <= (r1-r2)^2
        return (posA.X - posB.X) * (posA.X - posB.X) + (posA.Y - posB.Y) * (posA.Y - posB.Y) <= (rA - rB) * (rA - rB);
    }
}

