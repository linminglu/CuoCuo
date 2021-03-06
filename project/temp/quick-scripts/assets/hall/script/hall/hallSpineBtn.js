(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/hall/hallSpineBtn.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '901c6WQHSRIZYrvloF8eqYJ', 'hallSpineBtn', __filename);
// hall/script/hall/hallSpineBtn.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        min: {
            default: 2
        },

        max: {
            default: 5
        }
    },

    onLoad: function onLoad() {
        this.allReady = true;
        this.nextTime = fun.utils.random(this.min, this.max);
        this.node.children.forEach(function (v) {
            v.ready = true;
            var anim = v.getComponent(sp.Skeleton);
            if (anim) {
                anim.timeScale = 0;
                anim.setCompleteListener(function () {
                    v.ready = true;
                    anim.timeScale = 0;
                });
            }
        });
    },
    update: function update(dt) {
        if (this.allReady) {
            this.nextTime -= dt;
            if (this.nextTime > 0) {
                return;
            }
            this.node.children.forEach(function (v) {
                v.ready = false;
                var anim = v.getComponent(sp.Skeleton);
                if (anim) {
                    anim.timeScale = 1;
                }
            });
            this.allReady = false;
            this.nextTime = fun.utils.random(this.min, this.max);
        } else {
            var readySum = 0;
            this.node.children.forEach(function (v) {
                if (v.ready) {
                    readySum++;
                }
            });
            if (this.node.childrenCount === readySum) {
                this.allReady = true;
            }
        }
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
        //# sourceMappingURL=hallSpineBtn.js.map
        