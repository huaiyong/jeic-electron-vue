var http=require('http');
var config = require('../config')


class httpUtils{
    /**
     * 该方法为post 参数为json
     * @param url
     * @param body
     */
    static httpPostJSON(url,body) {

        var bodyString = JSON.stringify(body);

        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyString.length
        };

        var options = {
            host: config.adminServerIp,
            port: config.adminServerPort,
            path: url,
            method: 'POST',
            headers: headers
        };

        var req=http.request(options,function(res){

            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function(data) {
                responseString += data;
                console.log(data);
            });

            res.on('end', function(res) {
                //这里接收的参数是字符串形式,需要格式化成json格式使用
                //var resultObject = JSON.parse(responseString);
                console.log(res);
            });

            req.on('error', function(e) {
                // TODO: handle error.
                console.log('-----error-------',e);
            });
        });
        req.write(bodyString);
        req.end();
    }
}


module.exports = httpUtils
