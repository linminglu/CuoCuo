let Audio = require('Audio');
const ApplePayResult = cc.Enum({
    'OTHER': 0,
    'SUCCESS': 1,
    'FAILED': 2,
    'PRODUCT_NOT_EXIST': 3,
    'SUCCESSED': 4,
});

cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: {
            type: cc.Label,
            default: null,
        },
    },

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();

        this._isApple = cc.sys.os === cc.sys.OS_IOS ? true : false;
        this.setGameType(gameConst.gameType.maJiangHuangYan);
        fun.event.add('Store_PayResult', 'PhonePayResult', this.onPhonePayResultAck.bind(this));
    },

    start () {
        fun.csv.turnCsvToJson('csv/shop.csv', function(csvJson){
            let data = new Array();
            for(let i=0; i<fun.utils.getLength(csvJson); ++i){
                if(this._gameType === parseInt(csvJson[i+1].INT_Game)){
                    data[data.length] = csvJson[i+1];
                }
            }
            this._csvJson = data;
            this.initShopList();
        }.bind(this));
    },

    onDestroy: function () {
        fun.event.remove('Store_PayResult');
    },

    setGameType(gameType) {
        this._gameType = gameType;
        this.titleLabel.string = gameConst.gameTypeZhNameMap[this._gameType];
    },

    initShopList(){
        let bg = this.node.getChildByName('back');
        let shopList = bg.getChildByName('shopList');
        for (let i = 0; i < shopList.childrenCount; i++) {
            let box = shopList.getChildByName("box" + (i + 1));
            let price, roomCard = box.getChildByName('num').getComponent(cc.Label);
            let songKa = box.getChildByName('label'), songKaBg = box.getChildByName('bg');
            price = '￥' + this._csvJson[i].INT_Price/100;
            roomCard.string = this._csvJson[i].INT_OpValue + 'z';
            if (this._csvJson[i].INT_GiveValue && parseInt(this._csvJson[i].INT_GiveValue)) {
                songKa.getChildByName('num1').getComponent(cc.Label).string = this._csvJson[i].INT_GiveValue;
            } else {
                songKa.active = false;
                songKaBg.active = false;
            }
            let btnShop = box.getChildByName('btnShop');
            btnShop.getChildByName('label').getComponent(cc.Label).string = price;
            btnShop.on('click', this.onBtnShopClick.bind(this, i));
        }
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
    },

    onBtnShopClick (num) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        if (!cc.sys.isNative) return;
        fun.event.dispatch('Zhuanquan', {flag: true, text: '支付中，请稍后...'});
        this._roomCardNum = num;
        if(this._isApple){
            require('JSPhoneDevice').ApplePay(this._csvJson[num].STR_ID);
        }else{
            fun.net.pSend('WxPay', {GameType: this._gameType, Product: this._csvJson[num].INT_Index}, function(data){
                if (data.RetCode && data.RetCode !== 0) return;
                require('JSPhoneWeChat').WxPay(data);
            }.bind(this));
        }
    },

    onPhonePayResultAck (msg) {
        fun.event.dispatch('Zhuanquan', {flag: false});
        if (msg.from === 'apple') {
            if (parseInt(msg.result) === 3) {
                fun.net.pSend('ApPay', {ReceiptStr: msg.receipt}, function(data){
                    if (data.RetCode && data.RetCode !== 0) {
                        setTimeout(function(){
                            this.onPhonePayResultAck(msg);
                        }.bind(this), 2000);
                    } else {
                        if (data.Status && data.Status === ApplePayResult.SUCCESS) {
                            cc.sys.localStorage.setItem('applePayReceiptStr', JSON.stringify({check: false}));
                            fun.event.dispatch('HuangYanAddRoomCard', this._csvJson[this._roomCardNum].INT_OpValue);
                        } else {
                            setTimeout(function(){
                                this.onPhonePayResultAck(msg);
                            }.bind(this), 2000);
                        }
                    }
                }.bind(this));
            }
        } else if (msg.from === 'wechat') {
            if (msg.result && msg.result !== 'false')
                fun.event.dispatch('HuangYanAddRoomCard', this._csvJson[this._roomCardNum].INT_OpValue);
        }
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }

});
