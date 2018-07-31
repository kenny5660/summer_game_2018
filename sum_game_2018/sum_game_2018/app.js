document.addEventListener("DOMContentLoaded", ready);
function ready() {
    var canvas = document.getElementById("game_canvas");
    Game.Start(canvas);
}
var Game = /** @class */ (function () {
    function Game() {
    }
    Game.Start = function (canvas) {
        this.Canvas = canvas;
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        var ctx = this.Canvas.getContext('2d');
        var gameScene = new SceneGame(canvas, GameConfig.gameSceneWidth, GameConfig.gameSceneHeight, "white");
        this.CurScene = gameScene;
        var mainMenuScene = new Scene(canvas, new Camera(canvas, new Point(0, 0), GameConfig.defaultCanvasWidth, GameConfig.defaultCanvasHeght), "grey");
        var startButton = new MenuButton("START", new Point(300, 300));
        startButton.width = 400;
        startButton.height = 150;
        startButton.fontSize = 5;
        mainMenuScene.GameObjects.push(startButton);
        mainMenuScene.GameObjects.push(new MenuButton("EXIT", new Point(400, 490)));
        window.addEventListener('resize', resizeCanvas, false);
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawStuff();
        }
        resizeCanvas();
        function drawStuff() {
            Game.CurScene.DrawObjects();
        }
        var lastTime = Date.now();
        function GameLoop() {
            var now = Date.now();
            var dT = (now - lastTime) / 1000.0;
            Game.CurScene.UpdateObjects(dT);
            Game.CurScene.DrawObjects();
            lastTime = now;
            window.requestAnimationFrame(GameLoop);
        }
        ;
        window.requestAnimationFrame(GameLoop);
    };
    return Game;
}());
var GameAgar = /** @class */ (function () {
    function GameAgar() {
    }
    return GameAgar;
}());
//# sourceMappingURL=app.js.map