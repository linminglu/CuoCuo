cc.Class({
    extends: cc.Component,

    properties: {
        saiziPerfab: {
            type: cc.Prefab,
            default: null,
        },

        disbandRoomPerfab: {
            type: cc.Prefab,
            default: null,
        }
    },

    onLoad () {
        fun.event.add('commonWahuaSaiziEnd', 'wahuaSaiziEnd', this.initSaizi.bind(this));
        fun.event.add('commonWahuaDisbandRoom', 'wahuaDisbandRoom', this.initDisbandRoom.bind(this));
    },

    onDestroy() {
        fun.event.remove('commonWahuaSaiziEnd');
        fun.event.remove('commonWahuaDisbandRoom');
    },

    initSaizi(data) {
        let saizi = cc.instantiate(this.saiziPerfab);
        saizi.parent = this.node;
        saizi.getComponent('mjSaiziUI').wahuaPlay(data.point, function(){
            saizi.removeFromParent();
            cc.log('--- 1. saizi: ', saizi);
            data.callback();
        }, this);
        cc.log('--- 2. saizi: ', saizi)
    },

    initDisbandRoom() {
        cc.log('--- initDisbandRoom ---')
        if (!this.disbandRoom) {
            this.disbandRoom = cc.instantiate(this.disbandRoomPerfab);
            this.disbandRoom.parent = this.node;
            this.disbandRoom.getComponent('mjVotingPopUI').enabled = false;
            // this.disbandRoom.addComponent('wahuaVotingPopUI');
        }

    },

});
