
var request = require('request');
module.exports = function(reqUrl, obj) {
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

