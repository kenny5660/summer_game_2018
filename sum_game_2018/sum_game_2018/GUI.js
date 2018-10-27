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
var GUIelement = (function () {
    function GUIelement() {
    }
    return GUIelement;
}());
var Menu = (function () {
    function Menu() {
    }
    Menu.prototype.show = function () {
        this.container.style.display = "block";
    };
    Menu.prototype.hide = function () {
        this.container.style.display = "none";
    };
    return Menu;
}());
var GameOverMenu = (function (_super) {
    __extends(GameOverMenu, _super);
    function GameOverMenu(score, Scene) {
        var _this = _super.call(this) || this;
        _this.container = document.getElementById("game_over_menu");
        _this.score = score;
        _this.restartBut = document.getElementById("restart_button");
        _this.scoreField = document.getElementById("game_over_score");
        _this.Scene = Scene;
        var input = _this;
        _this.restartBut.addEventListener("click", function (e) { return input.clickReStartBut(); });
        return _this;
    }
    GameOverMenu.prototype.show = function () {
        _super.prototype.show.call(this);
        this.scoreField.innerHTML = this.score.toString();
    };
    GameOverMenu.prototype.clickReStartBut = function () {
        this.Scene.restart();
        this.hide();
    };
    return GameOverMenu;
}(Menu));
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        var _this = _super.call(this) || this;
        _this.sceneBackWidth = 15000;
        _this.sceneBackHeight = 15000;
        _this.sceneBackFoodMass = 15000;
        _this.container = document.getElementById("main_menu");
        _this.startBut = document.getElementById("start_button");
        _this.FieldNickName = document.getElementById("textFieldNickName");
        var input = _this;
        _this.startBut.addEventListener("click", function (e) { return input.clickStartBut(); });
        return _this;
    }
    MainMenu.prototype.show = function () {
        var gameScene = new SceneBackMainMenu(GameEngine.Canvas, this.sceneBackWidth, this.sceneBackHeight, this.sceneBackFoodMass, "white");
        GameEngine.changeScene(gameScene);
        _super.prototype.show.call(this);
    };
    MainMenu.prototype.clickStartBut = function () {
        var gameScene = new SceneGame(GameEngine.Canvas, GameConfig.gameSceneWidth, GameConfig.gameSceneHeight, GameConfig.foodMass, this.FieldNickName.value, "white");
        GameEngine.changeScene(gameScene);
        this.hide();
    };
    return MainMenu;
}(Menu));
var SceneBackMainMenu = (function (_super) {
    __extends(SceneBackMainMenu, _super);
    function SceneBackMainMenu(canvas, width, height, foodMassFirst, backgroundColor) {
        return _super.call(this, canvas, width, height, foodMassFirst, "", backgroundColor) || this;
    }
    SceneBackMainMenu.prototype.generateEaters = function () {
        this.mainBot = new Bot(this, new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), "red");
        this.foodMass -= this.mainBot.Size;
        this.eaters.push(this.mainBot);
        for (var i = 0; i < GameConfig.botNumber; ++i) {
            var bot = new Bot(this, new Point(Math.abs(Math.random() * this.width), Math.abs(Math.random() * this.height)), "red");
            this.foodMass -= bot.Size;
            this.eaters.push(bot);
        }
        this.Camera.setFollowObject(this.mainBot);
    };
    SceneBackMainMenu.prototype.eaterEaterCollision = function (big, small) {
        if (small == this.mainBot) {
            this.restart();
            return false;
        }
        return true;
    };
    SceneBackMainMenu.prototype.eaterFoodCollision = function (eater, food) {
        if (eater.Size > this.foodMassFirst * 0.6 && eater == this.mainBot) {
            this.restart();
        }
        return true;
    };
    return SceneBackMainMenu;
}(SceneGame));
var MenuButton = (function (_super) {
    __extends(MenuButton, _super);
    function MenuButton(text, pos) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.pos = pos;
        _this.width = 200;
        _this.height = 80;
        _this.color = "green";
        _this.fontSize = 30;
        _this.font = "italic " + _this.fontSize + "pt Arial";
        _this.colorText = "white";
        _this.padingText = 5;
        return _this;
    }
    MenuButton.prototype.Draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.X, this.pos.Y, this.width, this.height);
        ctx.fillStyle = this.colorText;
        ctx.font = this.font;
        ctx.textAlign = "middle";
        this.posText = new Point(this.width / 2 - (ctx.measureText(this.text).width + this.padingText) / 2, this.height / 2 + this.fontSize / 2);
        ctx.fillText(this.text, this.pos.X + this.posText.X, this.pos.Y + this.posText.Y, this.width - this.padingText);
    };
    MenuButton.prototype.Update = function (dT) {
    };
    return MenuButton;
}(GameObject));
