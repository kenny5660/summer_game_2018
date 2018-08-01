document.addEventListener("DOMContentLoaded", ready);
window.document.hasFocus = function () { return true; };
function ready() {
    var canvas = document.getElementById("game_canvas");
    var foodKDtree = new KDtree();
    var firstFood = new Food(new Point(30, 40), 10, 10, "red");
    foodKDtree.insert(firstFood);
    foodKDtree.insert(new Food(new Point(5, 25), 10, 10, "red"));
    foodKDtree.insert(new Food(new Point(70, 70), 10, 10, "red"));
    foodKDtree.insert(new Food(new Point(10, 12), 10, 10, "red"));
    foodKDtree.insert(new Food(new Point(50, 30), 10, 10, "red"));
    foodKDtree.insert(new Food(new Point(35, 45), 10, 10, "red"));
    // foodKDtree.deleteNode(firstFood);
    var foodNEarest = foodKDtree.nearest(new Food(new Point(20, 20), 10, 10, "red"));
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
        var mainMenuScene = new Scene(canvas, new Camera(canvas, new Point(0, 0), GameConfig.canvasWidthDefault, GameConfig.canvasHeghtDefault), "grey");
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
        window.onfocus = function () {
            lastTime = Date.now();
        };
        function drawStuff() {
            //    Game.CurScene.UpdateObjects(0);
            Game.CurScene.DrawObjects();
        }
        var lastTime = Date.now();
        function GameLoop() {
            var now = Date.now();
            var dT = (now - lastTime) / 1000.0;
            if (dT < 0.35) {
                Game.CurScene.UpdateObjects(dT);
                Game.CurScene.DrawObjects();
            }
            else {
                console.log(dT);
            }
            lastTime = now;
            window.requestAnimationFrame(GameLoop);
        }
        ;
        window.requestAnimationFrame(GameLoop);
    };
    return Game;
}());
//# sourceMappingURL=app.js.map