class Scene {
    public Canvas: HTMLCanvasElement;
    public BackgroundColor: string;
    private ctx: CanvasRenderingContext2D;
    public GameObjects: GameObject[] = [];
    constructor(canvas: HTMLCanvasElement, backgroundColor: string) {
        this.Canvas = canvas;
        this.BackgroundColor = backgroundColor;
        this.ctx = this.Canvas.getContext('2d');
    }
    UpdateObjects(dT: number) {
        for (var i = 0; i < this.GameObjects.length; ++i) {
            this.GameObjects[i].Update(dT);
        }
    }
    DrawObjects() {
        this.ctx.fillStyle = this.BackgroundColor;
        this.ctx.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.ctx.restore();
        for (var i = 0; i < this.GameObjects.length; ++i) {
            this.GameObjects[i].Draw(this.ctx);
        }
    }
}