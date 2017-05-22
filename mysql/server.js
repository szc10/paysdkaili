var net = require('net');
var mysql = require('mysql');

var HOST = '127.0.0.1';
var PORT = 6063;

// var pool  = mysql.createPool({//创建连接池
//     host: '183.236.9.27',
//     user: 'sdkadmin',
//     password: '123456',
//     // database: database,
//     port: 3306
// });
// 

var pool  = mysql.createPool({//创建连接池
    host:"590c3a64a7745.sh.cdb.myqcloud.com",
    user:"cdb_outerroot",
    password:"wusedou123",
    port:13194
});

function query(sql) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, conn) {
            if (err) {
                reject(err);
                //console.log("error",err);
            } else {
                conn.query(sql, function(qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    if(!qerr){
                    resolve(vals || []);
                    // console.log("ret",qerr);
                  } else {
                    resolve(qerr);
                  }
                });
            }
        });
    });
}

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(sock) {

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(sql) {

        // 回发该数据，客户端将收到来自服务端的数据
        query(sql.toString("utf-8")).then(function(data){
            // console.log(data);
            // console.log(sql.toString("utf-8"));
            sock.write(JSON.stringify(data));
        });


    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        // console.log('CLOSED: ' +
        //     sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
