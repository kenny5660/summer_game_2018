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
    GameEngine.Start(canvas);
}
var GameEngine = /** @class */ (function () {
    function GameEngine() {
    }
    GameEngine.Start = function (canvas) {
        this.Canvas = canvas;
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        var ctx = this.Canvas.getContext('2d');
        this.MainMenu = new MainMenu();
        this.MainMenu.show();
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
            GameEngine.CurScene.DrawObjects();
        }
        var lastTime = Date.now();
        function GameLoop() {
            var now = Date.now();
            var dT = (now - lastTime) / 1000.0;
            if (dT < 0.35) {
                GameEngine.CurScene.UpdateObjects(dT);
                GameEngine.CurScene.DrawObjects();
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
    GameEngine.changeScene = function (Scene) {
        this.CurScene = Scene;
    };
    return GameEngine;
}());
//# sourceMappingURL=app.js.map