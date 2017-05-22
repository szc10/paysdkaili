module.exports = function() {
    var fs = require('fs');
    var sign = require('./sign');
    var key = require('./key')(); //对象
    var error = require('./model/error')();
    var mysql = require('./mysql/index')('sdkdb');
    var path = './comData.json';
    return {
        saveData: function(jsonObj, formObj) {
            return new Promise(function(resolve, reject) {
                var key = jsonObj.mchntOrderNo; //订单号作为主键
                jsonObj.errCode = 10000;
                jsonObj.errMsg = '提交正确';
                jsonObj.data = formObj; //传回给客户端的字段

                var promise = new Promise(function(resolve, reject) {
                    fs.readFile(path, function(err, data) {
                        if (err) {
                            resolve(error.error(10008, '文件读出不正确'));
                        } else {
                            var dataObj = JSON.parse(data.toString('utf-8'));
                            dataObj[key] = jsonObj;
                            var str = JSON.stringify(dataObj);
                            resolve(str);
                        }
                    });
                });
                promise.then(function(data) {
                    if (!data.errCode) { //说明是str
                        //console.log("data"+data);
                        fs.writeFile(path, data, function(err) {
                            if (err) {
                                resolve(error.error(10011, "保存客户端json写进文件出错"));
                            } else {
                                resolve(error.ok());
                            }
                        });
                    } else {
                        resolve(data); //data为一个错误对象
                    }
                });
            });
        }, //savaData  

        getData: function(pathfile, transacteOrderId, payAmount, payContext, ext, mcId,payWay) {
            return new Promise(function(resolve, reject) {
                fs.readFile(pathfile, function(err, data) {
                    //console.log(pathfile);
                    //console.log(transacteOrderId);
                    if (err) {
                        resolve(error.error(10009, '文件读出不正确'));
                    } else {
                        var dataObj = JSON.parse(data.toString()); // var dataObj = JSON.parse(data.toString('utf-8'));
                        var businessData = dataObj.businessData;
                        var shopData = dataObj.shopData;
                        var dbDataObj = {
                            index: {
                                mcId: mcId
                            },
                            database: "user"
                        };
                        mysql.select(dbDataObj).then(function(data) {
                            console.log(data);
                            if (data[0].merchantAcctId) {
                                shopData.merchantAcctId = data[0].merchantAcctId;
                            }
                            businessData.orderId = transacteOrderId;
                            businessData.orderAmount = payAmount;
                            businessData.productName = payContext;
                            businessData.ext1 = ext;
                            businessData.ext2 = payContext;
                            businessData.payWay=payWay;
                            console.log(dataObj);
                            var str = JSON.stringify(dataObj);
                            // console.log("saveData"+str);
                            resolve(str); //默认请求报文
                        });
                    }
                });
            });
        }, //getData 

        encrpData: function(data) {
            var dataObj = JSON.parse(data.toString('utf-8'));
            var protocolData = dataObj.protocolData;
            var shopData = dataObj.shopData;
            var businessData = dataObj.businessData;
            var formObj = sign.addPro(protocolData, shopData, businessData); //去除空字段，生成对象
            // console.log("formObj"+formObj);
            var encryp = key.encryption(sign.createSign(protocolData, shopData, businessData)); //密文
            formObj.signMsg = encryp; //返回的对象加上signMsg 字段
            return formObj;
        }, //encrpData

        //判断交易订单号是否已经存在
        uniqueData: function(key) { //key为transacteOrderId
                return new Promise(function(resolve, reject) {
                    fs.readFile(path, function(err, data) {
                        if (err) {
                            resolve(error.error(10008, '文件读出不正确'));
                        } else {
                            var dataObj = JSON.parse(data.toString('utf-8'));
                            if (dataObj[key]) { //如果comData里面存在这个key值
                                resolve(error.error(10014, '交易订单号已存在'));
                            } else {
                                resolve(error.ok());
                            }
                        }
                    });
                });
            } //uniqueData

    } //return
}
