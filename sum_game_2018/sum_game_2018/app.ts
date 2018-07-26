document.addEventListener("DOMContentLoaded", ready);
function ready() {
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game_canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    var gameScene = new Scene(canvas, "white");
    var curScene = gameScene;
    var player = new PlayerGameObject(canvas, "green");
    curScene.GameObjects.push(player);
    //addEventListener("keydown", KeyBoardListener_keydown);
    //addEventListener("keyup", KeyBoardListener_keyup);
    //function KeyBoardListener_keydown(e: KeyboardEvent) {
    //    player.keydown(e);
    //}
    //function KeyBoardListener_keyup(e: KeyboardEvent) {
    //    player.keyup(e);
    //}
    var mainMenuScene = new Scene(canvas, "grey");
  //  var curScene = gameScene;
    var curScene = mainMenuScene;
    var startButton = new MenuButton("START", new Point(300, 300));
    startButton.width = 400;
    startButton.height = 150;
    startButton.fontSize = 5;
    mainMenuScene.GameObjects.push(startButton);
    mainMenuScene.GameObjects.push(new MenuButton("EXIT", new Point(400, 490)));
    var player = new PlayerGameObject(new Point(30, 30), 20, "green");
    gameScene.GameObjects.push(player);
    addEventListener("keydown",KeyBoardListener_keydown);
    addEventListener("keyup", KeyBoardListener_keyup);
    function KeyBoardListener_keydown(e: KeyboardEvent) {
        player.keydown(e);
    }
    function KeyBoardListener_keyup(e: KeyboardEvent) {
        player.keyup(e);
    }
  
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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