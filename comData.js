module.exports = function () {
    var sign = require('./sign');
    var key = require('./key')();
    var error = require('./model/error')();
    var saveClientJson = require('./saveClientJson')();
    var path = './postData.json';
    var pay = require("./model/pay.js");
    var pay_detail = require("./model/pay_detail.js");

    var request = require("./request.js");

    /**
     * 获取用户的model
     */
    var userM = require("./model/user.js");

    /**
     * 移动支付的相关的参数
     */
    var app_con = {
        ID: '0000000830',
        KEY: 'e431a5cb01a355361adc2357a6c01cbb'
    }

    var md5 = require("./MD5.js");

    return {
        managerComData: function (req_body) {
            return new Promise(function (resolve, reject) {
                var jsonObj = req_body;
                var transacteOrderId = jsonObj.transacteOrderId; //交易订单号               
                if (!transacteOrderId) {
                    resolve(error.error(10001, '交易订单号不合法'));
                }
                var userAccount = jsonObj.userAccount;
                var mcId = jsonObj.mcId; //商户号
                if (!mcId) {
                    resolve(error.error(10002, '商户号不合法'));
                }
                var payContext = jsonObj.payContext;
                if (!payContext) {
                    resolve(error.error(10003, '支付内容不合法'));
                }
                var payAmount = jsonObj.payAmount;
                if (!payAmount) {
                    resolve(error.error(10004, '支付金额不正确'));
                }
                var ext = jsonObj.ext;
                if (!ext) {
                    resolve(error.error(10013, '扩展字段不正确'));
                }
                var reqUrl = jsonObj.reqUrl;
                if (!reqUrl) {
                    resolve(error.error(10005, '服务器回调地址不正确'));
                }
                var payWay = jsonObj.payWay;
                if (!payWay) {
                    resolve(error.error(10006, '支付方式不合法'));
                }

                /**
                 * 创建塞入服务器中的数据
                 */
                var text = {
                    amount: jsonObj.payAmount,
                    appid: app_con.ID,
                    body: jsonObj.payContext,
                    clientIp: "192.168.1.11",
                    mchntOrderNo: jsonObj.transacteOrderId,
                    notifyUrl: "http://122.200.155.41:9300/curl/comData/saveServerJson",
                    returnUrl: "https://www.baidu.com",
                    subject: jsonObj.payContext,
                    signature: "sdadadadasd"
                }



                var waitSign = "amount=" + text.amount + "&appid=" + text.appid + "&body=" + text.body + "&clientIp=" + text.clientIp + "&mchntOrderNo=" + text.mchntOrderNo + "&notifyUrl=" + text.notifyUrl + "&returnUrl=" + text.returnUrl + "&subject=" + text.subject + "&key=" + app_con.KEY;
                text.signature = waitSign;
                /**
                 * 创建支付的数据
                 */
                pay.create(jsonObj).then(function () {
                    return pay_detail.create(jsonObj);  // 创建订单的详情表
                }).then(function () {
                    var resd = error.ok();
                    resd.data = text;
                    /**
                     * 需要传给用户的数据
                     */
                    pay_detail.update(jsonObj.transacteOrderId, {
                        san_post_data: JSON.stringify(text)
                    });
                    resolve(resd);
                }).catch(function () {
                    resolve(error.error(-10007, '数据服务失败'));
                });

            });
        },
        saveServerJson: function (body) {

            console.log("json", body);
            var testData = body;

            try {
               // testData = JSON.parse(body);
            } catch (e) {
                console.log("异常捕获");
            } finally {

            }

            if(!testData){
                return ;  //如果当前的数据不存在则,关闭
            }

            /**
             * 更新详情表的信息
             */
            pay_detail.update(testData.mchntOrderNo, {
                server_re_data: JSON.stringify(testData)
            });

            /**
             * 更新支付表的数据,将支付的信息编程为成功
             */
            pay.update(testData.mchntOrderNo, {
                state: 1,
                pay_time: parseInt((Date.parse(new Date())) / 1)
            });

            /**
             * 项目目标服务器发送目标报文（异步回调）
             */
            Promise.all([pay.select(testData.mchntOrderNo), userM.select(1304)]).then(function (data) {
                var payd = data[0][0];
                var userd = data[1][0];
                //  console.log("回调数据1",payd);
                //  console.log("回调数据2",userd);

                var postData = {
                    transacteOrderId: payd.transacteOrderId,
                    orderId: testData.orderNo,
                    payResult: 10,
                    dealTime: new Date().getTime(),  //通过时间戳来完成相关的访问
                    ext: payd.ext
                }

                //对数据进行md5加密
                var waitSign = "";

                for (var i in postData) {
                    waitSign += i + "=" + postData[i] + "&";
                }
                // 创建等待加签字段
                waitSign = waitSign.substring(0, waitSign.length - 1) + userd.privatekey;

                postData.signMsg = md5(waitSign);

                /**
                 * 修改支付的数据相应的数据
                 */
                pay_detail.update(testData.mchntOrderNo, {
                    client_re_data: JSON.stringify(postData)
                });

                /**
                 * 发送数据字段,想目标服务器发送post的数据
                 */
                request(payd.requrl, postData);

                /**
                 * 开始组织报文
                 */
            });
            /**
             * 给对方的服务器的传输成功的信息 
             */
            return new Promise(function (resolve, reject) {
                resolve('{"success":"true"}');
            });

        }
    }
}
