<?php
  header("Content-type:text/html;charset=utf-8");
  header("Access-Control-Allow-Origin: *");
  if(!$_POST['data']){
  $postdata = "\"\"";
  } else{
       $postdata = $_POST['data'];
    }
?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
    <title>支付控件</title>
    <!--<link href="css/Reset.css" rel="stylesheet" type="text/css">
    <link href="css/h5_DEMO.css" rel="stylesheet" type="text/css">-->
    <script src="js/jquery-1.11.3.min.js"></script>
    <script src="js/mtjsencrypt.min.js"></script>
    <script type="text/javascript" src="js/jsBox.js"></script>

<style>
    form{
        display:none;
    }
</style>    
</head>


<body>
    <form id="form" action="http://trans.palmf.cn/sdk/api/v1.0/cli/order_h5/0" method="post">
        <input type="hidden" id="orderInfo" name="orderInfo" value="">
        <input type="submit" name="">
    </form>
</body>
<script type="text/javascript">

   var postJson =null;
   var dataJson = null;
    //获取post数据
    postJson ='<?=$postdata?>';
     if(window.Andrord){
            dataJson = window.Andrord.getMsg();
        }else if(postJson){
        //判断postJson是否是空，如果不空则为post传输
            dataJson = postJson;
        }else{
        //获取get方法的数据
          dataJson = GET();   
        }
        var dataOb = JSON.parse(dataJson);  //将对象序列换


Jajax({
    url: 'https://www.pay.jhelllo.cn/curl/comData/managerComData',
    data: dataOb,
    json_back:true,
    complete: function(data) {
    	// alert(data.errcode);
    	console.log(data);
    	if(data.errcode==10000){
    		     submit(data.data);
    	}

        //Request successfunlly
   
    },
    error:function(){

    }
});
function submit(test) {
    var json = JSON.stringify(test);
    var result = mtEncryptAndMD5(json);
    $("#orderInfo").val(result);
    document.getElementById('form').submit();
}
// submit();
 /**
     * 
     * 获取get方法传过来的参数.
     * @returns obj.
     * @author wgq.
     * 
     */
    function GET(){
        var url = window.document.location.href.toString();
        var u = url.split("?");
        if(typeof(u[1]) == "string"){
            u = u[1].split("&");
            var get = {};
            for(var i in u){
                var j = u[i].split("=");
                j[1] = decodeURIComponent(j[1]);
                get[j[0]] = j[1];
                     
            }
            return get;
        } else {
            return {};
        }
    }
</script>

</html>
