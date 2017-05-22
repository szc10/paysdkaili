module.exports = function (str) {
    var crypto = require('crypto');
            var decipher = crypto.createHash('md5')
            return decipher.update(str).digest('hex').toString('utf-8');
}