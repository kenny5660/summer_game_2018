declare class Scene {
    Canvas: HTMLCanvasElement;
    BackgroundColor: string;
    private ctx;
    GameObjects: GameObject[];
    constructor(canvas: HTMLCanvasElement, backgroundColor: string);
    UpdateObjects(dT: number): void;
    DrawObjects(): void;
}
