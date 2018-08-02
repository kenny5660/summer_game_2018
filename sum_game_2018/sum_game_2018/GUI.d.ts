declare class GUIelement {
    container: HTMLElement;
}
declare class Menu {
    container: HTMLElement;
    show(): void;
    hide(): void;
}
declare class GameOverMenu extends Menu {
    score: number;
    restartBut: HTMLElement;
    scoreField: HTMLSpanElement;
    Scene: SceneGame;
    constructor(score: number, Scene: SceneGame);
    show(): void;
    clickReStartBut(): void;
}
declare class MainMenu extends Menu {
    startBut: HTMLElement;
    FieldNickName: HTMLInputElement;
    sceneBackWidth: number;
    sceneBackHeight: number;
    sceneBackFoodMass: number;
    constructor();
    show(): void;
    private clickStartBut();
}
declare class SceneBackMainMenu extends SceneGame {
    mainBot: Bot;
    constructor(canvas: HTMLCanvasElement, width: number, height: number, foodMassFirst: number, backgroundColor: string | CanvasPattern);
    generateEaters(): void;
    protected eaterEaterCollision(big: Eater, small: Eater): boolean;
    protected eaterFoodCollision(eater: Eater, food: Food): boolean;
}
declare class MenuButton extends GameObject {
    width: number;
    height: number;
    color: string;
    colorText: string;
    text: string;
    font: string;
    fontSize: number;
    posText: Point;
    padingText: number;
    constructor(text: string, pos: Point);
    Draw(ctx: CanvasRenderingContext2D): void;
    Update(dT: number): void;
}
