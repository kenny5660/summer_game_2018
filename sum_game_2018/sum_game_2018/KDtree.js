var KDtree = (function () {
    function KDtree() {
        this.root = null;
    }
    KDtree.prototype.nearest = function (obj) {
        this.minDist = Number.MAX_VALUE;
        return this._nearest(this.root, obj, 0, null).obj;
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
        if (node == null) {
            return;
        }
        callback(node.obj);
        this._preOrderTravers(node.left, callback);
        this._preOrderTravers(node.right, callback);
    };
    KDtree.prototype._nearest = function (node, obj, depth, minNode) {
        if (node == null) {
            return minNode;
        }
        if (this.minDist > obj.pos.distToPoint(node.obj.pos)) {
            this.minDist = obj.pos.distToPoint(node.obj.pos);
            minNode = node;
        }
        if (node.left == null && node.right == null) {
            return minNode;
        }
        var curD = depth % 2;
        if (curD == 0) {
            if (obj.pos.X < node.obj.pos.X) {
                minNode = this._nearest(node.left, obj, depth + 1, minNode);
                if (obj.pos.X + this.minDist >= node.obj.pos.X) {
                    minNode = this._nearest(node.right, obj, depth + 1, minNode);
                }
            }
            else {
                minNode = this._nearest(node.right, obj, depth + 1, minNode);
                if (obj.pos.X - this.minDist <= node.obj.pos.X) {
                    minNode = this._nearest(node.left, obj, depth + 1, minNode);
                }
            }
        }
        else {
            if (obj.pos.Y < node.obj.pos.Y) {
                minNode = this._nearest(node.left, obj, depth + 1, minNode);
                if (obj.pos.Y + this.minDist >= node.obj.pos.Y) {
                    minNode = this._nearest(node.right, obj, depth + 1, minNode);
                }
            }
            else {
                minNode = this._nearest(node.right, obj, depth + 1, minNode);
                if (obj.pos.Y - this.minDist <= node.obj.pos.Y) {
                    minNode = this._nearest(node.right, obj, depth + 1, minNode);
                }
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
            if (node.right != null) {
                var min = this._findMin(node.right, curD, 0);
                if (curD == 0) {
                    console.log("minNode:%d", min.obj.pos.X);
                }
                else {
                    console.log("minNode:%d", min.obj.pos.Y);
                }
                node.obj = min.obj;
                node.right = this._del(node.right, min.obj, depth + 1);
            }
            else if (node.left != null) {
                var min = this._findMin(node.left, curD, 0);
                node.obj = min.obj;
                if (curD == 0) {
                    console.log("minNode:%d", min.obj.pos.X);
                }
                else {
                    console.log("minNode:%d", min.obj.pos.Y);
                }
                node.right = this._del(node.left, min.obj, depth + 1);
                node.left = null;
            }
            else {
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
        if (d == 0) {
            console.log("D:%d node:%d", d, node.obj.pos.X);
        }
        else {
            console.log("D:%d node:%d", d, node.obj.pos.Y);
        }
        var curD = depth % 2;
        if (curD == d) {
            console.log("D:%d curD == d", d);
            ;
            if (node.left == null) {
                return node;
            }
            return this._findMin(node.left, d, depth + 1);
        }
        return this._minNode(node, this._findMin(node.left, d, depth + 1), this._findMin(node.right, d, depth + 1), d);
    };
    KDtree.prototype._minNode = function (x, y, z, d) {
        var res = x;
        if (d == 0) {
            if (y != null && y.obj.pos.X < res.obj.pos.X) {
                res = y;
            }
            if (z != null && z.obj.pos.X < res.obj.pos.X) {
                res = z;
            }
            console.log("D:%d X: %d Y:%d Z:%d Res:%d", d, x != null ? x.obj.pos.X : null, y != null ? y.obj.pos.X : null, z != null ? z.obj.pos.X : null, res != null ? res.obj.pos.X : null);
        }
        else {
            if (y != null && y.obj.pos.Y < res.obj.pos.Y) {
                res = y;
            }
            if (z != null && z.obj.pos.Y < res.obj.pos.Y) {
                res = z;
            }
            console.log("D:%d X: %d Y:%d Z:%d Res:%d", d, x != null ? x.obj.pos.Y : null, y != null ? y.obj.pos.Y : null, z != null ? z.obj.pos.Y : null, res != null ? res.obj.pos.Y : null);
        }
        return res;
    };
    return KDtree;
}());
var KDtreeNode = (function () {
    function KDtreeNode(obj) {
        this.obj = null;
        this.left = null;
        this.right = null;
        this.obj = obj;
    }
    return KDtreeNode;
}());
