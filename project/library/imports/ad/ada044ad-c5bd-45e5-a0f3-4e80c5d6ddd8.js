"use strict";
cc._RF.push(module, 'ada04Stxb1F5aDzToDF1t3Y', 'PukeSkin');
// poker/script/prefab/PukeSkin.js

"use strict";

var PukeUtils = require("PukeUtils");
var PukeData = require("PukeData");
var PukeDefine = require("PukeDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        Skin1: cc.Sprite,
        Skin2: cc.Sprite,
        SkinChoose1: cc.Node,
        SkinChoose2: cc.Node,
        SkinNumber: 2
    },

    onLoad: function onLoad() {
        this.initSkin();
        this.initSkinChoose();
        var curSkin = PukeData.getSkin();
        this["SkinChoose" + curSkin].active = true;
    },

    initSkin: function initSkin() {
        var self = this;

        var _loop = function _loop(i) {
            var spriteName = PukeDefine.BACKGROUND[i];
            PukeUtils.LoadRes(spriteName, "SpriteName", function (frame) {
                self["Skin" + (i + 1)].spriteFrame = frame;
            });
        };

        for (var i = 0; i < this.SkinNumber; i++) {
            _loop(i);
        }
    },

    initSkinChoose: function initSkinChoose() {
        for (var i = 1; i <= this.SkinNumber; i++) {
            this["SkinChoose" + i].active = false;
        }
    },

    onBtnSkinClicked: function onBtnSkinClicked(sender, num) {
        this.initSkinChoose();
        this["SkinChoose" + num].active = true;
        PukeData.setSkin(num);
        fun.event.dispatch('PukeSkin', num);
    },

    onBtnQuitClicked: function onBtnQuitClicked() {
        require('Audio').playEffect('hall', 'button_close.mp3');
        this.node.active = false;
    }
});

cc._RF.pop();