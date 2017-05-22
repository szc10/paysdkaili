module.exports = function() {
        var NodeRSA = require('node-rsa');
        var crypto = require('crypto');
        var fs = require('fs');
        var privateKey = new NodeRSA(fs.readFileSync('./RSA/mycert.key'));
        var signKey = new NodeRSA(fs.readFileSync('./RSA/rsa_public_key.pem'));
        var privatekey = new NodeRSA(fs.readFileSync('./RSA/rsa_private_key.pem'));
        var md5 = crypto.createHash('md5'); //
        //var md5 = crypto.createHash('md5');
        //var fs = require('fs');
        return {

            encryption: function(str) {
                var encryptStr = "";
                encryptStr = privateKey.encrypt(str, 'base64');
                return encryptStr;
            },
            encryptString: function(str) {
                /*var  encryptStr ="";
     encryptStr = md5.update(str,'utf-8').digest('base64').toString("utf-8").toUpperCase(); 
     return encryptStr;*/
                encryptStr = md5.update(str + "e431a5cb01a355361adc2357a6c01cbb").digest('hex').toString("utf-8");
                return encryptStr;
            },
            md5: function(str) {
                var decipher = crypto.createHash('md5')
                return decipher.update(str + "e431a5cb01a355361adc2357a6c01cbb").digest('hex').toString('utf-8');
            }
        }
    }
    //var publicKey = new NodeRSA(fs.readFileSync('./key/rsa_public_key.pem'));
    //var encrypted = privateKey.encrypt(signStr,'base64');
    /*var crypto = require('crypto')
    /**
     *@param   str 字符串
     @param   key 秘钥
     */
    /*function md5(str){
        var decipher = crypto.createHash('md5')
        return decipher.update(str).digest('hex')
    }*/
