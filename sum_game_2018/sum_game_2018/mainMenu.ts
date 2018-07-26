class MenuButton extends GameObject {
    pos: Point;
    width: number;
    height: number;
    color: string;
    colorText: string;
    text: string;
    font: string;
    fontSize: number;
    posText: Point;
    padingText: number;
    constructor(text: string, pos: Point) {
        super();
        this.text = text;
        this.pos = pos;
        this.width = 200;
        this.height = 80;
        this.color = "green";
        this.fontSize = 30;
        this.font = "italic " + this.fontSize + "pt Arial";
        this.colorText = "white";
        this.padingText = 5;
          }
    Draw(ctx: CanvasRenderingContext2D) {
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.X, this.pos.Y, this.width, this.height);
        ctx.fillStyle = this.colorText;
        ctx.font = this.font;
        ctx.textAlign = "middle";
        this.posText = new Point(this.width / 2 - (ctx.measureText(this.text).width + this.padingText) / 2, this.height / 2 + this.fontSize / 2);
        ctx.fillText(this.text, this.pos.X + this.posText.X, this.pos.Y + this.posText.Y, this.width - this.padingText);
    }
    Update(dT: number) {

    }
}