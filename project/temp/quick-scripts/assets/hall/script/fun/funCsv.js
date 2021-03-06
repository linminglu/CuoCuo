(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/fun/funCsv.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '11039km1IVCort92eATlgfJ', 'funCsv', __filename);
// hall/script/fun/funCsv.js

'use strict';

var papaparse = require('papaparse.min');

var csv = {

    turnCsvToJson: function turnCsvToJson(csvname, callback) {
        var toJson = function toJson(csvData) {
            var csvJson = {};
            for (var i = 1; i < csvData.length; ++i) {
                var rowJson = {};
                for (var j = 0; j < csvData[0].length; ++j) {
                    rowJson[csvData[0][j].trim()] = csvData[i][j];
                    csvJson[i] = rowJson;
                }
            }
            return csvJson;
        };
        cc.loader.loadRes(csvname, function (err, csvData) {
            if (err) {
                cc.error(err.message || err);
                return;
            } else {
                var jsData = papaparse.parse(csvData, {
                    complete: function complete(parsedCsv) {
                        callback(toJson(parsedCsv.data));
                    }
                });
            }
        });
    },

    getHuoDong: function getHuoDong(type, callback) {
        this.turnCsvToJson('csv/huodong.csv', function (csvJson) {
            for (var i = 0; i < fun.utils.getLength(csvJson); ++i) {
                if (csvJson[i + 1].STR_HuoDong === type) {
                    callback(csvJson[i + 1]);
                }
            }
        });
    },

    getItem: function getItem(itemId, callback) {
        this.turnCsvToJson('csv/item.csv', function (csvJson) {
            for (var i = 0; i < fun.utils.getLength(csvJson); ++i) {
                if (parseInt(csvJson[i + 1].INT_ItemID) === itemId) {
                    callback(csvJson[i + 1]);
                }
            }
        });
    }

};

module.exports = csv;

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
        //# sourceMappingURL=funCsv.js.map
        