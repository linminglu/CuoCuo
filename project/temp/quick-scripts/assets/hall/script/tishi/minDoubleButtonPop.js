(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/tishi/minDoubleButtonPop.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '37fecnKCOhAiIKQU1ZJTcuX', 'minDoubleButtonPop', __filename);
// hall/script/tishi/minDoubleButtonPop.js

'use strict';

var Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {
        btnOk: {
            type: cc.Node,
            default: null
        },

        btnOkLabel: {
            type: cc.Label,
            default: null
        },

        btnClose: {
            type: cc.Node,
            default: null
        },

        btnCloseLabel: {
            type: cc.Label,
            default: null
        },

        contentLabel: {
            type: cc.Label,
            default: null
        }
    },

    init: function init(data) {
        this.okCb = data.okCb;
        this.closeCb = data.closeCb;
        if (data.okBtnStr) {
            this.btnOkLabel.string = data.okBtnStr;
        }
        if (data.closeBtnStr) {
            this.btnCloseLabel.string = data.closeBtnStr;
        }
        if (data.contentStr) {
            this.contentLabel.string = data.contentStr;
        }
    },
    onLoad: function onLoad() {
        this.btnOk.once('click', this.onBtnOkClick, this);
        this.btnClose.once('click', this.onBtnCloseClick, this);
    },
    onEnable: function onEnable() {
        this.node.getComponent(cc.Animation).play('popScaleAnim');
    },
    onBtnOkClick: function onBtnOkClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var animState = this.node.getComponent(cc.Animation).play('popScaleOut');
        animState.once('finished', function () {
            if (this.okCb) {
                this.okCb();
            }
            this.node.destroy();
        }.bind(this));
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        var animState = this.node.getComponent(cc.Animation).play('popScaleOut');
        animState.once('finished', function () {
            if (this.closeCb) {
                this.closeCb();
            }
            this.node.destroy();
        }.bind(this));
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=minDoubleButtonPop.js.map
        