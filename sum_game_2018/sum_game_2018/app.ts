document.addEventListener("DOMContentLoaded", ready);
window.document.hasFocus = function () { return true; }
function ready() {

    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game_canvas");

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

class GameEngine {
    public static CurScene: Scene;
    public static Canvas: HTMLCanvasElement;
    public static MainMenu: MainMenu;
    static Start(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        var ctx = this.Canvas.getContext('2d');
        this.MainMenu = new MainMenu(document.getElementById("main_menu"));
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
        };
        window.requestAnimationFrame(GameLoop);

    }
    static changeScene(Scene: Scene) {
        this.CurScene = Scene;
    }
}