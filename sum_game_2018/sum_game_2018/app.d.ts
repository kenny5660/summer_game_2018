declare function ready(): void;
declare class Game {
    static CurScene: Scene;
    static Canvas: HTMLCanvasElement;
    static Start(canvas: HTMLCanvasElement): void;
}
declare class GameAgar {
    gameScene: Scene;
}
