(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/phone/JSPhoneNetBattery.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8591du7QZtENp678nRlptS8', 'JSPhoneNetBattery', __filename);
// phone/JSPhoneNetBattery.js

'use strict';

var className = 'org/cocos2dx/javascript/AppActivity';
var netBattery = {

    //== 获取手机网络和电池状态 (进入游戏界面时调用)
    getNetBatteryStatus: function getNetBatteryStatus() {
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'getNetBatteryStatus', '()V');else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneNetBattery', 'getNetBatteryStatus');
    },

    //-- 返回手机电池状态 ( 必须要先调用一次 getNetBatteryStatus() )
    reBattery: function reBattery(status, level) {
        console.log('---* js reBattery *---');
        console.log('status: ' + status); // status = 0-未知情况 1-未充电状态  2-正在充电但未充满 3-已充满电
        console.log('level:  ' + level); // 电池电量 0-100
        fun.event.dispatch('PhoneBattery', { status: parseInt(status), level: parseInt(level) });
    },

    //返回手机网络状态和运营商 ( 必须要先调用一次 getNetBatteryStatus() )
    reNet: function reNet(status, strength, signal) {
        console.log('---* js reNet *---');
        console.log('status:   ' + status); // status = 5 Wifi  2/3/4 流量   0/其他 无网络
        console.log('strength: ' + strength); // Wifi强度  ios:1-3  android 1-4
        console.log('signal:   ' + signal); // 手机信号强度 0网络错误 1网络很差 2网络还行 3网络不错 4网络很好
        if (status === 5 && cc.sys.os === cc.sys.OS_IOS) strength = parseInt(strength) + 1;
        fun.event.dispatch('PhoneNet', { status: parseInt(status), strength: parseInt(strength), signal: parseInt(signal) });
    }

};

module.exports = netBattery;

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
        //# sourceMappingURL=JSPhoneNetBattery.js.map
        