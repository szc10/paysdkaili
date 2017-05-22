// inputCharset={inputCharset}&pageUrl={pageUrl}&bgUrl={bgUrl}&version={version}&language={language}&signType={signType}&merchantAcctId={merchantAcctId}&terminalId={terminalId}&payerName={payerName}&payerContactType={payerContactType}&payerContact={payerContact}&payerIdentityCard={payerIdentityCard}&mobileNumber={mobileNumber}&cardNumber={cardNumber}&customerId={customerId}&orderId={orderId}&orderAmount={orderAmount}&orderTime={orderTime}&productName={productName}&productNum={productNum}&productId={productId}&productDesc={productDesc}&ext1={ext1}&ext2={ext2}&payType={payType}&bankId={bankId}&redoFlag={redoFlag}


//
//
/**
 * 协议参数
 */




function addPro(protocolData,shopData,businessData){
        var  formObj={};
       for(var i in protocolData){
        if(protocolData[i]){
           formObj[i]=protocolData[i]; 
         }
        }
        for(var i in shopData){
        if(shopData[i]){
           formObj[i]=shopData[i]; 
         }
        }
        for(var i in businessData){
        if(businessData[i]){
           formObj[i]=businessData[i]; 
         }
       }
      return formObj;
}

// var o = {
//   inputCharset: 1, //字符集 默认1 为utf8
//   pageUrl: "", //接收支付结果的页面地址
//   bgUrl: "", //服务器接收支付结果的后台地址
//   version: 2.0, //网关版本 固定值 2.0
//   language: 1, //默认为1 代表就是显示的是中文
//   signType: 4 //签名类型 默认为4 RSA方式
//   merchantAcctld: "1223", //会员账号
//   terminalld: "23322", // 终端号
//   payerName: "szc", //支付人的姓名
//   payerContactType: "1", //1 电子邮件 2 其他方式
//   payerContact: "sh098@gmailc.com", //联系方式
//   payerIdentityCard: "", //支付人的 11 位身份证号码
//   mobileNumber: "13645713824", //支付人的手机号码
//   cardNumber: "6228480328747144470", // 支付人银行卡号
//   customerld: "", //支付人所在系统的客户编号
//   orderId: "15205ndjjhdif", //字符串 订单好 32位 唯一
//   orderAmount: "1000", //商户的订单金额 以分为单位
//   orderTime: "201402151542565", //商户订单的提交时间 一共14位
//   productName: "大坏蛋", //商品名称
//   productNum: 8, //商品的数量
//   productId: "商品的代码", //可以为空
//   productDesc: "商品的描述", //可以空 商品的描述
//   ext1: "扩展字段1",
//   ext2: "扩展字段2",
//   payType: 20, // 支付方式 20 为银联卡支付
//   bankId: "", //银行代码 可以为空
//   redoFlag: "", //可以为空  同一订单禁止重复提交的标志
// }


/**
 * [createSign 创建待签名的字段]
 * @param  {[type]} protocolData [description]
 * @param  {[type]} shopData     [description]
 * @return {[type]}              [description]
 */
function createSign(protocolData, shopData, businessData) {
    var waitSign = "";
    dealArr(protocolData);
    dealArr(shopData);
    dealArr(businessData);
    return waitSign.substring(0,waitSign.length-1);

    function dealArr(Arr) {
        for (var k in Arr) {
            var str = createSignStr(k, Arr[k]);
            if (str) {
                waitSign += str;
                waitSign += "&";
            }
        }
    }

    function createSignStr(key, value) {
        var str = key + "={" + value + "}";
        if (value) {
            return str;
        } else {
            return false;
        }
    }
}




/**
 * 陈森
 * [createSign 创建待签名的字段]
 * @param  {[type]} protocolData [description]
 * @param  {[type]} shopData     [description]
 * @return {[type]}              [description]
 */
function createSigniture(jsonObj){
       var signStr="";
       for(var i in jsonObj){
          if(jsonObj[i]){
            var str = i+"="+jsonObj[i];
            signStr += str;
            signStr +="&";
          }
       }        
  return signStr.substring(0,signStr.length-1);
}

module.exports ={
     createSign :  createSign,
     addPro : addPro,
     createSigniture :createSigniture
};