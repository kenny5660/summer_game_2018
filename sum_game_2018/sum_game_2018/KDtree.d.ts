declare class KDtree {
    root: KDtreeNode;
    private minDist;
    nearest(obj: GameObject): GameObject;
    insert(obj: GameObject): KDtree;
    deleteNode(obj: GameObject): KDtree;
    preOrderTravers(callback: (obj: GameObject) => void): void;
    private _preOrderTravers(node, callback);
    private _nearest(node, obj, depth, minNode);
    private _del(node, obj, depth);
    private _insert(node, obj, depth);
    private _findMin(node, d, depth);
    private _minNode(x, y, z, d);
}
declare class KDtreeNode {
    obj: GameObject;
    left: KDtreeNode;
    right: KDtreeNode;
    constructor(obj: GameObject);
}
