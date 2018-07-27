document.addEventListener("DOMContentLoaded", ready);
function ready() {
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game_canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    var gameCamera = new Camera(canvas, new Point(0, 0), GameConfig.defaultCanvasWidth, GameConfig.defaultCanvasHeght);
    var gameScene = new Scene(canvas, gameCamera, "white");
    var curScene = gameScene;
    var player = new PlayerGameObject(canvas, "green");
    curScene.GameObjects.push(player);

    gameCamera.setFollowObject(player);
    var mainMenuScene = new Scene(canvas, new Camera(canvas, new Point(0, 0), GameConfig.defaultCanvasWidth, GameConfig.defaultCanvasHeght), "grey");

    var curScene = gameScene;
   // var curScene = mainMenuScene;
    var startButton = new MenuButton("START", new Point(300, 300));
    startButton.width = 400;
    startButton.height = 150;
    startButton.fontSize = 5;
    mainMenuScene.GameObjects.push(startButton);
    mainMenuScene.GameObjects.push(new MenuButton("EXIT", new Point(400, 490)));

    var player = new PlayerGameObject(canvas,"green");
    gameScene.GameObjects.push(player);

    for (var i = 0; i < 20; i++) {
        gameScene.GameObjects.push(new eatedObject(new Point(Math.abs(Math.random() * canvas.width), Math.abs(Math.random() * canvas.height)), GameConfig.eatedSize,"red"));
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