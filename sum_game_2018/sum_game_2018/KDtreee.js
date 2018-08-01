var KDtree = /** @class */ (function () {
    function KDtree() {
        this.root = null;
    }
    KDtree.prototype.nearest = function (obj) {
        return this._nearest(this.root, obj, 0, Number.MAX_VALUE, null).obj;
    };
    KDtree.prototype.insert = function (obj) {
        this.root = this._insert(this.root, obj, 0);
        return this;
    };
    KDtree.prototype.deleteNode = function (obj) {
        this.root = this._del(this.root, obj, 0);
        return this;
    };
    KDtree.prototype.preOrderTravers = function (callback) {
        this._preOrderTravers(this.root, callback);
    };
    KDtree.prototype._preOrderTravers = function (node, callback) {
        callback(node.obj);
        this._preOrderTravers(node.left, callback);
        this._preOrderTravers(node.right, callback);
    };
    KDtree.prototype._nearest = function (node, obj, depth, minDist, minNode) {
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
    };
    KDtree.prototype._del = function (node, obj, depth) {
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
    };
    KDtree.prototype._insert = function (node, obj, depth) {
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
    };
    KDtree.prototype._findMin = function (node, d, depth) {
        if (node == null) {
            return null;
        }
        var curD = depth % 2;
        if (curD == d) {
            if (node.left == null)
                return node;
            return this._findMin(node.left, d, depth + 1);
        }
        return this._minNode(node, this._findMin(node.left, d, depth + 1), this._findMin(node.right, d, depth + 1), d);
    };
    KDtree.prototype._minNode = function (x, y, z, d) {
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
    };
    return KDtree;
}());
var KDtreeNode = /** @class */ (function () {
    function KDtreeNode(obj) {
        this.obj = null;
        this.left = null;
        this.right = null;
        this.obj = obj;
    }
    return KDtreeNode;
}());
//# sourceMappingURL=KDtreee.js.map