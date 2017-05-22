var mysql = require('../mysql/index')('sdkdb');
var table = "user";






module.exports.select = function (id) {
    /**
     * 挑选一条支付记录
     */
    var promise = new Promise(function (resolve, reject) {
        var pdata = {};
        pdata.table = table;  //设计传入的表
        pdata.index = {
            mcId:id
        }
        mysql.select(pdata).then(function (data) {
            resolve(data);
        }).catch(function(data){
            reject(data);
        });
    });
    return promise;
}