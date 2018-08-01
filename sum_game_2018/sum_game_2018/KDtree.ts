class KDtree {
    root: KDtreeNode = null;
    nearest(obj: GameObject): GameObject {
        return this._nearest(this.root, obj, 0, Number.MAX_VALUE, null).obj;
    }
    insert(obj: GameObject): KDtree {
        this.root = this._insert(this.root, obj, 0);
        return this;
    }
    deleteNode(obj: GameObject): KDtree {
        this.root = this._del(this.root, obj, 0);
        return this;
    }
    preOrderTravers(callback: (obj: GameObject) => void) {
        this._preOrderTravers(this.root, callback);
    }
    private _preOrderTravers(node: KDtreeNode, callback: (obj: GameObject) => void) {
        callback(node.obj);
        this._preOrderTravers(node.left, callback);
        this._preOrderTravers(node.right, callback);
    }
    private _nearest(node: KDtreeNode, obj: GameObject, depth: number, minDist: number, minNode: KDtreeNode): KDtreeNode {
        if (node == null) {
            return minNode;
        }


        if (minDist > obj.pos.distToPoint(node.obj.pos)) {
            minDist = obj.pos.distToPoint(node.obj.pos);
            minNode = node;
        }
        if (node.left == null && node.right) {
            return minNode;
        }
        var curD = depth % 2;
        if (curD == 0) {
            if (obj.pos.X < node.obj.pos.X) {
                minNode = this._nearest(node.left, obj, depth + 1, minDist, minNode);
            }
            else {
                minNode = this._nearest(node.right, obj, depth + 1, minDist, minNode);
            }
        }
        else {
            if (obj.pos.Y < node.obj.pos.Y) {
                minNode = this._nearest(node.left, obj, depth + 1, minDist, minNode);
            }
            else {
                minNode = this._nearest(node.right, obj, depth + 1, minDist, minNode);
            }
        }
        return minNode;
    }
    private _del(node: KDtreeNode, obj: GameObject, depth: number): KDtreeNode {
        if (node == null) {
            return null;
        }
        var curD = depth % 2;
        if (node.obj == obj) {
            // 2.b) If right child is not NULL
            if (node.right != null) {
                // Find minimum of root's dimension in right subtree
                var min = this._findMin(node.right, curD, 0);

                // Copy the minimum to root
                node.obj = JSON.parse(JSON.stringify(min.obj));

                // Recursively delete the minimum
                node.right = this._del(node.right, min.obj, depth + 1);
            }
            else if (node.left != null) // same as above
            {
                var min = this._findMin(node.left, curD, 0);
                node.obj = JSON.parse(JSON.stringify(min.obj));

                node.right = this._del(node.left, min.obj, depth + 1);
            }
            else // If node to be deleted is leaf node
            {
                return null;
            }
            return node;
        }

        if (curD == 0) {
            if (obj.pos.X < node.obj.pos.X) {
                node.left = this._del(node.left, obj, depth + 1);
            }
            else {
                node.right = this._del(node.right, obj, depth + 1);
            }
        }
        else {
            if (obj.pos.Y < node.obj.pos.Y) {
                node.left = this._del(node.left, obj, depth + 1);
            }
            else {
                node.right = this._del(node.right, obj, depth + 1);
            }
        }
        return node;

    }

    private _insert(node: KDtreeNode, obj: GameObject, depth: number): KDtreeNode {
        if (node == null) {
            return new KDtreeNode(obj);
        }

        var curD = depth % 2;
        if (curD == 0) {
            if (obj.pos.X < node.obj.pos.X) {
                node.left = this._insert(node.left, obj, depth + 1);
            }
            else {
                node.right = this._insert(node.right, obj, depth + 1);
            }
        }
        else {
            if (obj.pos.Y < node.obj.pos.Y) {
                node.left = this._insert(node.left, obj, depth + 1);
            }
            else {
                node.right = this._insert(node.right, obj, depth + 1);
            }
        }
        return node;
    }
    private _findMin(node: KDtreeNode, d: number, depth: number): KDtreeNode {
        if (node == null) {
            return null;
        }
        var curD = depth % 2;
        if (curD == d) {
            if (node.left == null)
                return node;
            return this._findMin(node.left, d, depth + 1);
        }
        return this._minNode(node,
            this._findMin(node.left, d, depth + 1),
            this._findMin(node.right, d, depth + 1), d);
    }
    private _minNode(x: KDtreeNode, y: KDtreeNode, z: KDtreeNode, d: number): KDtreeNode {
        var res = x;
        if (d == 0) {
            if (y != null && y.obj.pos.X < res.obj.pos.X)
                res = y;
            if (z != null && z.obj.pos.X < res.obj.pos.X)
                res = z;
        }
        else {
            if (y != null && y.obj.pos.Y < res.obj.pos.Y)
                res = y;
            if (z != null && z.obj.pos.Y < res.obj.pos.Y)
                res = z;
        }
        return res;
    }


}
class KDtreeNode {
    obj: GameObject = null;
    left: KDtreeNode = null;
    right: KDtreeNode = null;
    constructor(obj: GameObject) {
        this.obj = obj;
    }
}