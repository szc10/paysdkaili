module.exports = function(){
	var fs = require('fs');
    var error = require('./model/error')();
    var getReqUrl = require('./getReqUrl')();
    var path = './saveData.json';
    var sign = require('./sign');
    var key = require('./key')();
    var mysql = require('./mysql/index')('sdkdb');


    return{
    	saveData:function(req_body){
    		return new Promise(function(resolve,reject){
                transacteOrderId = req_body.mchntOrderNo;
                payWay = req_body.payChannelId;
                var obj = req_body;
                switch(obj.paySt){
                    case 0 :
                    var updateObj = {
                        data:{
                            state : 0
                        },
                        index:{
                            transacteOrderId: transacteOrderId
                        },
                        database: "pay"
                    }
                    mysql.update(updateObj).then(function(data){
                        if(data.length==0){
                            resolve(error.error("8",'update数据库失败'));
                        }
                    });
                    break;

                    case 1 :
                    var updateObj = {
                        data:{
                            state : 1
                        },
                        index:{
                            transacteOrderId: transacteOrderId
                        },
                        database: "pay"
                    }
                    mysql.update(updateObj).then(function(data){
                        if(data.length==0){
                            resolve(error.error("8",'update数据库失败'));
                        }
                    });
                    break;

                    case 2 :
                    var updateObj = {
                        data:{
                            state : 2
                        },
                        index:{
                            transacteOrderId: transacteOrderId
                        },
                        database: "pay"
                    }
                    mysql.update(updateObj).then(function(data){
                        if(data.length==0){
                            resolve(error.error("8",'update数据库失败'));
                        }
                    });
                    break;

                    case 3 :
                    var updateObj = {
                        data:{
                            state : 3
                        },
                        index:{
                            transacteOrderId: transacteOrderId
                        },
                        database: "pay"
                    }
                    mysql.update(updateObj).then(function(data){
                        if(data.length==0){
                            resolve(error.error("8",'update数据库失败'));
                        }
                    });
                    break;

                    case 4 :
                    var updateObj = {
                        data:{
                            state : 4
                        },
                        index:{
                            transacteOrderId: transacteOrderId
                        },
                        database: "pay"
                    }
                    mysql.update(updateObj).then(function(data){
                        if(data.length==0){
                            resolve(error.error("8",'update数据库失败'));
                        }
                    });
                    break;

                } //switch
            }
                var postObj = {
                    transacteOrderId : transacteOrderId,        //商户订单号
                    appid : obj.appid, 
                    orderId: obj.orderNo,                   //平台订单号
                    state:obj.paySt,                    //支付状态
                    dealTime:obj.paidTime,                  //完成支付时间
                };
                var signature = key.md5(sign.createSigniture(postObj));
                postObj.signature = signature;
                var dbDataObj = {
                    data:{
                        wcdata:JSON.stringify(obj),
                        postdata: JSON.stringify(postObj),
                        create_time : new Date().getTime()
                    },
                    index:{
                        transacteOrderId : transacteOrderId
                    },
                    database:"paydetail"
                };
                mysql.update(dbDataObj).then(function(data) {
                    if (data.length == 0) {
                        resolve(error.error("8", "update数据库失败"));
                    } else {
                        var errObj = error.ok();
                        errObj.postObj = postObj;
                        var dataobj = {
                            index: {
                                transacteOrderId: transacteOrderId
                            },
                            database: "pay"
                        }
                        mysql.select(dataobj).then(function(data) {
                            console.log(1111111111111,data);
                            if (data.length == 0) {
                                resolve(error.error("7", "select数据库失败"));
                            } else {
                                if (data[0].requrl) {
                                    errObj.reqUrl = data[0].requrl;
                                }
                                resolve(dataObj);
                            }
                        });
                    } //else
                });
            });
    	}
    }
}