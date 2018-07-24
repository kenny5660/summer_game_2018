document.addEventListener("DOMContentLoaded", ready);
function ready() {
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game_canvas");
    var ctx = canvas.getContext('2d');
    var gameScene = new Scene(canvas, "white");
    var curScene = gameScene;
    var player = new PlayerGameObject(new Point(30, 30), 20, "green");
    curScene.GameObjects.push(player);
    addEventListener("keydown",KeyBoardListener_keydown);
    addEventListener("keyup", KeyBoardListener_keyup);
    function KeyBoardListener_keydown(e: KeyboardEvent) {
        player.keydown(e);
    }
    function KeyBoardListener_keyup(e: KeyboardEvent) {
        player.keyup(e);
    }
  
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        /**
         * Your drawings need to be inside this function otherwise they will be reset when 
         * you resize the browser window and the canvas goes will be cleared.
         */
        drawStuff();
    }
    resizeCanvas();

    function drawStuff() {
        curScene.DrawObjects();
    }
    var lastTime = Date.now();
    function GameLoop() {
        var now = Date.now();
        var dT = (now - lastTime) / 1000.0;

        curScene.UpdateObjects(dT);
        curScene.DrawObjects();

        lastTime = now;
        window.requestAnimationFrame(GameLoop);
    };
    window.requestAnimationFrame(GameLoop);
}
