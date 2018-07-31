var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MenuButton = /** @class */ (function (_super) {
    __extends(MenuButton, _super);
    function MenuButton(text, pos) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.pos = pos;
        _this.width = 200;
        _this.height = 80;
        _this.color = "green";
        _this.fontSize = 30;
        _this.font = "italic " + _this.fontSize + "pt Arial";
        _this.colorText = "white";
        _this.padingText = 5;
        return _this;
    }
    MenuButton.prototype.Draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.X, this.pos.Y, this.width, this.height);
        ctx.fillStyle = this.colorText;
        ctx.font = this.font;
        ctx.textAlign = "middle";
        this.posText = new Point(this.width / 2 - (ctx.measureText(this.text).width + this.padingText) / 2, this.height / 2 + this.fontSize / 2);
        ctx.fillText(this.text, this.pos.X + this.posText.X, this.pos.Y + this.posText.Y, this.width - this.padingText);
    };
    MenuButton.prototype.Update = function (dT) {
    };
    return MenuButton;
}(GameObject));
//# sourceMappingURL=mainMenu.js.map