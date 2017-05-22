var NodeRSA = require('node-rsa');
var fs = require('fs');
var request = require('request');
var express = require('express');
var error = require('./model/error')();
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var sign = require('./sign');
var mysql = require('./mysql/index')('sdkdb');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//var jsonParser = bodyParser.json();

/**
 * 获取json的参数
 */
app.post("/post",function(req,res){
    res.header('Access-Control-Allow-Origin', '*');  //可以进行全局跨域
    console.log("json",req.body);
    res.send("ok");
});

//监听客户端-- comData.js  comData.json
app.post('*', multipartMiddleware, function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    var url = req.originalUrl;
    console.log("当前的传输报文", req.body);
    var urlArr = url.split("/");
    var project = urlArr[1]; //curl
    var model = urlArr[2]; //comData
    var action = urlArr[3]; //managerComData

    var resRet = "this is test"; //data 1.error 对象 2.formObj对象,不管是什么都要返回给客户端的
    require("./" + model + ".js")()[action](req.body).then(function(data) {
        //console.log("data"+data.postObj); 
        if (data.postObj) { //说明是errObj
            var postDataObj = data.postObj;
            var reqUrl = data.reqUrl;
            console.log(reqUrl);
            //console.log("chensen"+JSON.stringify(postDataObj));         
            res.send(error.ok()); //返回给银联的服务器
            postData(reqUrl, postDataObj); //返回给成都服务器的对象
        } else {
            res.send(data); //可以是formObj 或者是错误
        }
    });
});


app.listen(9300);


//发送给成都的服务器
function postData(reqUrl, obj) {
    request.post({
        url: reqUrl,
        form: obj,
        encoding: 'utf8'
    }, function(error, response, body) {
        if (response.statusCode == 200) {
            // console.log("chensen");
            console.log(body);
        } else {
            console.log(response.statusCode);
        }

    });
}

console.log("服务开启，正常");