(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/common/mjReplayMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3d58fAbncdId5MT+4GObS1v', 'mjReplayMgr', __filename);
// mahjong/script/game/common/mjReplayMgr.js

"use strict";

var mjDataMgr = require("mjDataMgr");
var log = cc.log;
var GameDefine = require("mjGameDefine");
var pregameManager = require("mjGameManager");

//战斗回放
var gameReplayMgr = {};
//hy麻将 opt list
var REPLAYOPT = {
	MP: 1, /*摸牌*/GMP: 2, /*杠后摸牌*/CP: 3, /*出牌*/CHI: 4, /*吃牌*/PENG: 5, /*碰牌*/MGT: 6, /*明杠2*/PTH: 7, /*普通胡*/
	MGO: 8, /*明杠1*/AG: 9, /*暗杠2 */ZM: 10, /*自摸*/QGH: 11, /*抢杠胡*/GCHZ: 12, /*过出牌组合*/GMPZ: 13, /*过摸排组合*/GQQH: 14 /*过抢杠胡*/


	//黄岩是重新生成新的消息
};var hymjReplay = function hymjReplay() {
	this.initData = function (data) {
		this.meDeskIndex = 0;
		this.replayData = data.record;
		this.startPai = [];
		this.zhuangIndex = 0;
		for (var i = 0; i < 4; i++) {
			this.startPai.push(data.record["p" + i]);
			if (data.record["p" + i].length == 14) {
				this.zhuangIndex = i;
			}
		}
		var RoomInfo = { meIdx: this.meDeskIndex, GameType: gameConst.gameType.maJiangHuangYan,
			players: data.record.uif, RoomInformation: data.record.room_info, RoomId: data.record.room_id };
		fun.db.setData('RoomInfo', RoomInfo);
		this.resulteData = data.record.zhanji;
		this.registerOptFunclist();
		this.optList = data.record.opts.slice();
		this.optList.reverse();
		cc.director.loadScene('majiang');
	};

	this.onDestroy = function () {
		this.replayData = undefined;
		this.resulteData = undefined;
		this.meDeskIndex = undefined;
		this.optFuncList = undefined;
		this.optTagList = undefined;
		this.optList = [];
	};
	this.registerOptFunclist = function () {
		var defineList = REPLAYOPT;
		var optFuncList = {};
		optFuncList[defineList.MP] = this.mopaiOpt;
		optFuncList[defineList.GMP] = this.mopaiOpt;
		optFuncList[defineList.CP] = this.chupaiOpt;
		optFuncList[defineList.CHI] = this.chuPaiZuHeOpt;
		optFuncList[defineList.PENG] = this.chuPaiZuHeOpt;
		optFuncList[defineList.MGT] = this.chuPaiZuHeOpt;
		optFuncList[defineList.PTH] = this.showResultOpt;
		optFuncList[defineList.MGO] = this.chuPaiZuHeOpt;
		optFuncList[defineList.AG] = this.chuPaiZuHeOpt;
		optFuncList[defineList.ZM] = this.showResultOpt;
		optFuncList[defineList.QGH] = this.showResultOpt;
		optFuncList[defineList.GCHZ] = this.guoPaiOpt;
		optFuncList[defineList.GMPZ] = this.guoPaiOpt;
		optFuncList[defineList.GQQH] = this.guoPaiOpt;
		this.optFuncList = optFuncList;
		var optTagList = {};
		var eatType = GameDefine.EATPAI_TYPE;
		optTagList[defineList.CHI] = Math.pow(2, eatType.ChiPai);
		optTagList[defineList.PENG] = Math.pow(2, eatType.PengPai);
		optTagList[defineList.MGT] = Math.pow(2, eatType.MingGang2);
		optTagList[defineList.MGO] = Math.pow(2, eatType.MingGang1);
		optTagList[defineList.AG] = Math.pow(2, eatType.AnGang);
		this.optTagList = optTagList;
	};
	this.creatOptData = function (opt) {
		var data = {};
		data.PlayerIdx = opt.i;
		data.Atile = opt.t;
		data.Opts = this.getOptTag(opt.o);
		data.Data = opt.d;
		if (data.Data) {
			data.Data.push(require("mjGameManager").lastChuPaiID);
		}
		return data;
	};
	this.mopaiOpt = function (opt) {
		require("mjGameManager").MoPaiNotice(this.creatOptData(opt));
	};

	this.chupaiOpt = function (opt) {
		var gameManager = require("mjGameManager");
		gameManager.ChuPaiNotice(this.creatOptData(opt));
	};

	this.guoPaiOpt = function (opt) {
		this.nextOpt();
	};

	this.chuPaiZuHeOpt = function (opt) {
		var gameManager = require("mjGameManager");
		gameManager.ChuPaiZuHeNotice(this.creatOptData(opt));
	};

	this.showResultOpt = function () {
		if (this.ShowResulted) {
			return;
		}
		this.ShowResulted = true;
		var gameManager = require("mjGameManager");
		/*  结算战绩  */
		gameManager.ZhanJiNoticeHy(this.resulteData);
		gameReplayMgr._ReplayUI.hdieReplay();
	};

	this.setStartPai = function () {
		var directionList = [];
		var DirectType = GameDefine.DIRECTION_TYPE;
		directionList.push(DirectType.DONG);
		directionList.push(DirectType.NAN);
		directionList.push(DirectType.XI);
		directionList.push(DirectType.BEI);
		var meDirection;
		for (var i = 0; i < 4; i++) {
			var tempIndex = (i + this.zhuangIndex) % 4;
			if (tempIndex == this.meDeskIndex) {
				meDirection = directionList[i];
				break;
			}
		}
		var gameManager = require("mjGameManager");
		gameManager.initReplayPai(this.startPai);
		gameManager.CaiShenPai = [this.replayData.cs];
		gameManager.meDirection = meDirection;
	};

	this.initRound = function () {
		this.setStartPai();
		var gameManager = require("mjGameManager");
		gameManager.initRoundData();
		gameManager.gameUICB.setCaiShenPai(gameManager.CaiShenPai);
		gameManager.faPaiNoAnim(false);
		gameManager.gameUICB.showReduceNode();
		gameManager.setBtnBackVisi(false);
		this.ShowResulted = false;
	};

	this.getOptTag = function (tag) {
		return this.optTagList[tag];
	};

	this.nextOpt = function () {
		if (this.optList.length < 1) {
			this.showResultOpt();
			gameReplayMgr.stop();
			return;
		}
		var opt = this.optList.pop();
		log("cur Opt", opt);
		var optFunc = this.optFuncList[opt.o];
		optFunc.call(this, opt);
	};
};

//温岭麻将是将消息分装起来，这里重放就是伪装发消息
var wlmjReplay = function wlmjReplay() {
	this.initData = function (data) {
		for (var i = 0; i < data.record.length; i++) {
			data.record[i].Data = JSON.parse(fun.base64.decode(data.record[i].Data));
		}
		this.optList = data.record;
		var RoomInfo = this.optList.shift();
		cc.log("RoomInfo     --<", RoomInfo);
		fun.db.setData('RoomInfo', RoomInfo.Data);
		cc.director.loadScene('majiang');
	};

	this.initRound = function () {
		// this.setStartPai();
		var gameManager = require('mjGameManager');
		gameManager.zhuangNotify(this.optList.shift().Data);
		var startPai = [];
		var paiData = this.optList.shift().Data;
		var moPaiData = this.optList.shift().Data;
		paiData.Players[moPaiData.UserId].Cards.push(moPaiData.Card);
		for (var UserId in paiData.Players) {
			var Idx = gameManager.getplayerByUserID(UserId).PlayerIdx;
			startPai[Idx] = paiData.Players[UserId].Cards;
		}
		gameManager.initReplayPai(startPai);
		gameManager.initRoundData();
		gameManager.caiShengPai(this.optList.shift().Data.Card);
		gameManager.gameUICB.setCaiShenPai(gameManager.CaiShenPai);
		gameManager.gameUICB.showReduceNode();
		gameManager.faPaiNoAnim(false);
		gameManager.fapaiMo = true;
		// gameManager. 
	};

	this.nextOpt = function () {
		if (this.optList.length < 1) {
			return;
		}
		var opt = this.optList.shift();
		opt.data = opt.Cmd + JSON.stringify(opt.Data);
		fun.net._onMessage(opt);
	};
};

gameReplayMgr.endReplay = function () {
	this._IsReplay = false;
	//var Audio           = require("Audio");
	//Audio.playSystemSound("button_nomal.mp3", false)
	var gameManager = require("mjGameManager");
	gameManager.cleanPlayerPaiData();
	gameManager.exiteRoom();
};

gameReplayMgr.startPlay = function () {
	this._CurIns.initRound();
	this._ReplayUI.showReplay();
};

gameReplayMgr.refreDelayTime = function () {
	this._RealDelayTime = this._OptDelayTime / this._Speed;
};

gameReplayMgr.setSpeedScale = function (speed) {
	this._Speed = speed;
	this.refreDelayTime();
};

gameReplayMgr.nextOpt = function () {
	this._CurIns.nextOpt();
};

gameReplayMgr.stop = function () {
	this._Replaying = false;
};

gameReplayMgr.resume = function () {
	this._Replaying = true;
	this._RddDt = 0;
	this.refreDelayTime();
	this.nextOpt();
};

gameReplayMgr.update = function (dt) {
	if (!this._Replaying || !this.isReplayPai()) {
		return;
	}
	this._RddDt += dt;
	if (this._RddDt >= this._RealDelayTime) {
		this._RddDt -= this._RealDelayTime;
		this.nextOpt();
	}
};

gameReplayMgr.onDestroy = function () {
	this._IsReplay = false;
	this._Replaying = false;
	this._Speed = undefined;
};

gameReplayMgr.isReplayPai = function () {
	return this._IsReplay;
};

gameReplayMgr.initTypeCfg = function () {
	this._TypeCfg = {};
	this._TypeCfg[gameConst.gameType.maJiangWenLing] = wlmjReplay;
	this._TypeCfg[gameConst.gameType.maJiangHuangYan] = hymjReplay;
};

gameReplayMgr.init = function (replayUI) {
	this._ReplayUI = replayUI;
	this._RddDt = 0;
	this._Speed = 1;
	this._RealDelayTime = this._OptDelayTime = 2;
};

gameReplayMgr.setReplayData = function (gameType, data) {
	this.initTypeCfg();
	this._CurIns = new this._TypeCfg[gameType]();
	this._CurIns.initData(data);
	this._IsReplay = true;
	this._Replaying = false;
};

module.exports = gameReplayMgr;

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
        //# sourceMappingURL=mjReplayMgr.js.map
        