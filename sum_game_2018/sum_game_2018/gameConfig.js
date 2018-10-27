var GameConfig = (function () {
    function GameConfig() {
    }
    GameConfig.maxCameraPlayerSize = 100;
    GameConfig.minCameraPlayerSize = 48;
    GameConfig.eaterStartSize = 50;
    GameConfig.eaterStartMaxSpeed = 10000000;
    GameConfig.eaterStartSpeedUp = 650;
    GameConfig.eaterStartSpeedDown = 450;
    GameConfig.eaterFrictionSpeedDownCoef = 0.008;
    GameConfig.eaterAccelerateSpeedUp = 3500;
    GameConfig.eaterAccelerateSpeedLoseSizeCoef = 0.15;
    GameConfig.eaterSizeTextFont = "Arial";
    GameConfig.eaterSizeTextFontSizeCoef = 0.5;
    GameConfig.eaterSizeTextNickNameCoef = 0.3;
    GameConfig.eaterPointTextSize = new Point(0, 0);
    GameConfig.eaterPointTextNickName = new Point(0, -25);
    GameConfig.eaterSizeTextFontColor = "white";
    GameConfig.eaterCoefSpeedLoseSize = 0.003;
    GameConfig.foodSize = 10;
    GameConfig.foodCost = 2;
    GameConfig.canvasWidthDefault = 1536;
    GameConfig.canvasHeghtDefault = 732;
    GameConfig.gameSceneWidth = 20000;
    GameConfig.gameSceneHeight = 20000;
    GameConfig.foodMass = 20000;
    GameConfig.food2xChance = 0.05;
    GameConfig.botNumber = 15;
    GameConfig.botDistAtackEater = 800;
    GameConfig.botAngry = 10;
    GameConfig.botAngryAccelerateDistCoef = 0.1;
    return GameConfig;
}());
