﻿class GUIelement {
    container: HTMLElement;
}
class Menu {
    container: HTMLElement;
    show() {
        this.container.style.display = "block";
    }
    hide() {
        this.container.style.display = "none";
    }
}
class GameOverMenu extends Menu {
    score: number;
    restartBut: HTMLElement;
    scoreField: HTMLSpanElement;
    Scene: SceneGame;
    constructor(score: number, Scene: SceneGame) {
        super();
        this.container = document.getElementById("game_over_menu");
        this.score = score;
        this.restartBut = document.getElementById("restart_button");
        this.scoreField = document.getElementById("game_over_score");
        this.Scene = Scene;
        var input = this;
        this.restartBut.addEventListener("click", (e: Event) => input.clickReStartBut());
    }
    show() {
        super.show();
        this.scoreField.innerHTML = this.score.toString();
    }
    clickReStartBut() {
        this.Scene.restart();
        this.hide();
    }
}
class MainMenu extends Menu {
    startBut: HTMLElement;
    FieldNickName: HTMLInputElement;
    sceneBackWidth = 15000;
    sceneBackHeight = 15000;
    sceneBackFoodMass = 15000;
    constructor() {
        super();
        this.container = document.getElementById("main_menu");
        this.startBut = document.getElementById("start_button");
        this.FieldNickName = <HTMLInputElement>document.getElementById("textFieldNickName");
        var input = this;
        this.startBut.addEventListener("click", (e: Event) => input.clickStartBut());
    }
    show() {
        var gameScene = new SceneBackMainMenu(GameEngine.Canvas, this.sceneBackWidth, this.sceneBackHeight, this.sceneBackFoodMass, "white");
        GameEngine.changeScene(gameScene);
        super.show();
    }
    private clickStartBut() {
        var gameScene = new SceneGame(GameEngine.Canvas, GameConfig.gameSceneWidth, GameConfig.gameSceneHeight, GameConfig.foodMass, this.FieldNickName.value, "white");
        GameEngine.changeScene(gameScene);
        this.hide();
    }
}
class SceneBackMainMenu extends SceneGame {
    mainBot: Bot;
    constructor(canvas: HTMLCanvasElement, width: number, height: number, foodMassFirst: number, backgroundColor: string | CanvasPattern) {
        super(canvas, width, height, foodMassFirst,"",backgroundColor);
    }

    generateEaters() {
        this.mainBot = new Bot(this, new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), "red");
        this.foodMass -= this.mainBot.Size;
        this.eaters.push(this.mainBot);
        for (var i = 0; i < GameConfig.botNumber; ++i) {
            var bot = new Bot(this, new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), "red");
            this.foodMass -= bot.Size;
            this.eaters.push(bot);
        }
        this.Camera.setFollowObject(this.mainBot);
    }

    protected eaterEaterCollision(big: Eater, small: Eater): boolean {
        if (small == this.mainBot) {
            this.restart();
            return false;
        }
        return true;
    }
    protected eaterFoodCollision(eater: Eater, food: Food): boolean {
        if (eater.Size > this.foodMassFirst * 0.6 && eater == this.mainBot) {
            this.restart();
        }
        return true;
    }
}
class MenuButton extends GameObject {
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