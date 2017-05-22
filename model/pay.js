var mysql = require('../mysql/index')('sdkdb');
var table = "pay";

/**
 * 创建一条支付记录
 */
module.exports.create = function (ob) {
    // console.log(123);
    /**
     * 创建的一条新的请求支付记录
     */
    var promise = new Promise(function (resolve, reject) {
        var pdata = {};
        pdata.table = table;  //设计传入的表
        var data = {
            mcId: ob.mcId,
            transacteOrderId: ob.transacteOrderId,
            state: 0, //支付中
            paycontext: ob.payContext,
            payamount: ob.payAmount,
            requrl: ob.reqUrl,
            ext: ob.ext,
            payway: ob.payWay,
        }
        data.create_time = parseInt((Date.parse(new Date())) / 1);
        pdata.data = data;
        mysql.insert(pdata).then(function (data) {
            resolve(data);
        }).catch(function(data){
            reject(data);
        });
    });
    return promise;
}

module.exports.select = function (id) {
    /**
     * 挑选一条支付记录
     */
    var promise = new Promise(function (resolve, reject) {
        var pdata = {};
        pdata.table = table;  //设计传入的表
        pdata.index = {
            transacteorderId:id
        }
        mysql.select(pdata).then(function (data) {
            resolve(data);
        }).catch(function(data){
            reject(data);
        });
    });
    return promise;
}


module.exports.update = function (id,data) {
    /**
     * 更新支付记录
     */
var promise = new Promise(function (resolve, reject) {
        var pdata = {};
        pdata.table = table;  //设计传入的表
        var index = {
            transacteOrderId: id          
        }
        pdata.data = data;
        pdata.index = index;
        mysql.update(pdata).then(function (data) {
            resolve(data);
        }).catch(function(data){
            reject(data);
        });
    });
    return promise;
}
