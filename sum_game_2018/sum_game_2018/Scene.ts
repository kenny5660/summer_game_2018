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
    public BackgroundColor: string;
    private ctx: CanvasRenderingContext2D;
    public GameObjects: GameObject[] = [];
    public Camera: Camera;
    constructor(canvas: HTMLCanvasElement, Camera: Camera, backgroundColor: string) {
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