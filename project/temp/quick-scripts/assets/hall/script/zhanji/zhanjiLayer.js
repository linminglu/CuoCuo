(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/zhanji/zhanjiLayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '82ff7fROUlM1LsyMzxo7HU4', 'zhanjiLayer', __filename);
// hall/script/zhanji/zhanjiLayer.js

'use strict';

var Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {

        noZhanji: {
            type: cc.Node,
            default: null
        },

        toggleGroupNode: {
            type: cc.Node,
            default: null
        },

        btnClose: {
            type: cc.Node,
            default: null
        },

        btnView: {
            type: cc.Node,
            default: null
        },

        viewPlaybackPre: {
            type: cc.Prefab,
            default: null
        },

        pukeZhanjiPre: {
            type: cc.Prefab,
            default: null
        },

        majiangZhanjiPre: {
            type: cc.Prefab,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
        this.btnView.on('click', this.onBtnViewClick, this);
        this.btnClose.on('click', this.onBtnCloseClick, this);
    },
    init: function init(gameType, data) {
        this.toggleGroupNode.children.forEach(function (toggleNode) {
            toggleNode.getComponentInChildren('zhanjiScv').init();
            if (gameType === gameConst.gameType[toggleNode.name]) {
                toggleNode.getComponent(cc.Toggle).check();
                toggleNode.getComponentInChildren('zhanjiScv').initWithData(data);
            } else {
                toggleNode.getComponentInChildren('zhanjiScv').enableCheck(true);
            }
        });
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    onBtnToggleClicked: function onBtnToggleClicked() {
        Audio.playEffect('hall', 'button_nomal.mp3');
    },
    onBtnViewClick: function onBtnViewClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var viewPlaybackPre = cc.instantiate(this.viewPlaybackPre);
        viewPlaybackPre.parent = this.node;
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.toggleGroupNode.children.forEach(function (toggleNode) {
            toggleNode.getComponentInChildren('zhanjiScv').enableCheck(false);
        });
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
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
        //# sourceMappingURL=zhanjiLayer.js.map
        