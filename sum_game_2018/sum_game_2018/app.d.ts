declare function ready(): void;
declare class GameEngine {
    static CurScene: Scene;
    static Canvas: HTMLCanvasElement;
    static MainMenu: MainMenu;
    static Start(canvas: HTMLCanvasElement): void;
    static changeScene(Scene: Scene): void;
}
