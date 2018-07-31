document.addEventListener("DOMContentLoaded", ready);
window.document.hasFocus = function () { return true; }
function ready() {

    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game_canvas");
    Game.Start(canvas);
}

class Game {
    public static CurScene: Scene;
    public static Canvas: HTMLCanvasElement;
    static Start(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        var ctx = this.Canvas.getContext('2d');
        var gameScene = new SceneGame(canvas, GameConfig.gameSceneWidth, GameConfig.gameSceneHeight, "white");
        this.CurScene = gameScene
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
            if (dT < 1) {
                Game.CurScene.UpdateObjects(dT);
                Game.CurScene.DrawObjects();
            }
            lastTime = now;
            window.requestAnimationFrame(GameLoop);
        };
        window.requestAnimationFrame(GameLoop);

    }
}
class GameAgar {

    gameScene: Scene;
    
}