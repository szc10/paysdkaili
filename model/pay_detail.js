var mysql = require('../mysql/index')('sdkdb');
var table = "pay_detail";

/**
 * 创建一条支付的详情表
 */
module.exports.create = function (ob) {
    /**
     * 创建的一条新的请求支付记录
     */
    var promise = new Promise(function (resolve, reject) {
        var pdata = {};
        pdata.table = table;  //设计传入的表
        var data = {
            transacteOrderId: ob.transacteOrderId,
            client_post_data: JSON.stringify(ob)            
        }
        // data.create_time = parseInt((Date.parse(new Date())) / 1000);
        pdata.data = data;
        mysql.insert(pdata).then(function (data) {
            resolve(data);
        }).catch(function(data){
            reject(data);
        });
    });
    return promise;
}

module.exports.update = function (id,data) {
    /**
     * 更新pay详情表的数据
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