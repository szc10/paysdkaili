
module.exports = function (){
    return {
         ok:function(){
         	var err = {};
             err.errcode = 10000;
             err.msg = "提交正确";
            return err;
         },
         error:function(code,msg){
         	var err = {};
             err.errcode = code;
             err.msg = msg;
            return err;
         }
    }
}