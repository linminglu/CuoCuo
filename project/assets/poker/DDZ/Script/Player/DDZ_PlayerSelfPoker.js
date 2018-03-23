cc.Class({
    extends: cc.Component,

    properties: {
        _selfPlayerHandPoker: [],
        _scale: 1,
        _pokerMargin: 50,
        pokerPrefab: {
            type: cc.Prefab,
            default: null,
        }
    },


    onLoad () {
        this._pos = cc.p(30, -193);
        this._cardsList = [];
        this._cardsPool = new cc.NodePool();
        for (var i = 0; i < 20; i++) {
            var card = cc.instantiate(this.pokerPrefab);
            this._cardsPool.put(card);
        }
        this.node.getComponent(cc.Layout).spacingX = this._pokerMargin;
    },
    clearHandPoker: function () {
        for (var i = 0; i < this._cardsList.length; i++) {
            this._cardsPool.put(this._cardsList[i]);
        }
        this._cardsList.splice(0, this._cardsList.length);
    },
    initHandPoker: function (handPokerListID) {
        this.clearHandPoker();
        this._selfPlayerHandPoker = [];
        handPokerListID = cc.YL.DDZTools.SortPoker(handPokerListID);
        for (var i = 0; i < handPokerListID.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(handPokerListID[i]);
            this._selfPlayerHandPoker.push(pokerObj);
        }
        this._selfPlayerHandPoker = this._sortPokerArrObj(this._selfPlayerHandPoker);
        cc.YL.DDZHandPokerList = this._selfPlayerHandPoker;
        this._updateHandPoker(this._selfPlayerHandPoker);
    },
    _sortPokerArrObj: function(selfPlayerHandPoker){
        return selfPlayerHandPoker.sort(function (a, b) { return a.Num - b.Num });

    },
    _updateHandPoker: function (pokerList) {
        for (var i = 0; i < pokerList.length; i++) {
            var pokerNode = this._cardsPool.get();
            pokerNode.getComponent("DDZ_Poker").initPoker(pokerList[i]);
            pokerNode.setScale(this._scale);
            pokerNode.setPositionY(0);
            pokerNode.setTag(i);
            this.node.addChild(pokerNode);
            this._cardsList.push(pokerNode);
        }
        this.node.setPosition(this._pos);
    },

});
