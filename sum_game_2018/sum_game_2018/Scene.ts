class Camera {
    pos: Point;
    private width: number;
    private height: number;
    private canvas: HTMLCanvasElement;
    private followObject: GameObject = null;
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
        if (this.followObject != null) {
            this.pos.X = Math.floor(-this.followObject.pos.X * Point.globalScale + this.canvas.width / 2);
            this.pos.Y = Math.floor(-this.followObject.pos.Y * Point.globalScale + this.canvas.height / 2);
        }
        Point.globalOffset = this.pos;
        Point.globalScale = 1 / Math.max(this.width / this.canvas.width, this.height / this.canvas.height);
    }
    setFollowObject(followObject: GameObject) {
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

        for (var i = this.GameObjects.length - 1; i >= 0; --i) {
            this.GameObjects[i].Update(dT);
        }
        this.Camera.Update(dT);
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

    constructor(canvas: HTMLCanvasElement, backgroundColor: string | CanvasPattern) {
        var gameCamera = new Camera(canvas, new Point(0, 0), GameConfig.defaultCanvasWidth, GameConfig.defaultCanvasHeght);
        super(canvas, gameCamera, backgroundColor);
        this.eaters = [];
        this.foods = [];
        var player = new PlayerGameObject(canvas, "green");
        this.eaters.push(player);
        gameCamera.setFollowObject(player);
        for (var i = 0; i < 20; i++) {
            this.foods.push(new Food(new Point(Math.abs(Math.random() * canvas.width), Math.abs(Math.random() * canvas.height)), GameConfig.eatedSize, "purple"));
        }

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
    private collisions() {
        for (var i = this.eaters.length - 1; i >= 0; --i) {
            for (var j = this.eaters.length - 1; j >= 0; --j) {
                if (i != j) {
                    if (Collisions.CircleInCircle(this.eaters[i].pos, this.eaters[i].Size, this.eaters[j].pos, this.eaters[j].Size)) {
                        if (this.eaters[i].Size > this.eaters[j].Size) {
                            this.eaters[i].Size += this.eaters[j].Size;
                            this.eaters.splice(j, 1);
                        }
                        if (this.eaters[i].Size < this.eaters[j].Size) {
                            this.eaters[j].Size += this.eaters[i].Size;
                            this.eaters.splice(i, 1);
                        }
                    }
                }
            }

            for (var j = this.foods.length - 1; j >= 0; --j) {
                if (Collisions.CircleInCircle(this.eaters[i].pos, this.eaters[i].Size, this.foods[j].pos, this.foods[j].Size)) {
                    this.eaters[i].Size += this.foods[j].Size * GameConfig.deafultFoodCost;
                    this.foods.splice(j, 1);

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