module.exports=function(){
   var fs = require('fs');
   var error = require('./model/error')();
   var path = './comData.json';
  return {

    getUrl : function(transacteOrderId){
       return new  Promise(function(resolve, reject) {
        fs.readFile(path,function(err,data) {
          if(err){
            resolve(error.error(10008,'文件读出不正确'));
          }else{
	           var dataObj = JSON.parse(data.toString('utf-8'));
	           var obj = dataObj[transacteOrderId];
	           if(!obj){//如果记录不存在报错
	           	resolve(error.error(10001,'交易订单号不合法'));
	           }
	           var reqUrlStr = obj.reqUrl;
	           resolve(reqUrlStr);
          } 
       });
      });
    }//getUrl 
  }
}