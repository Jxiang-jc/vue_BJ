const http = require('http');
const request = require('request');

const hostname = '127.0.0.1';
const port = 8010;
const imgPort = 8011;

// 创建一个 API 代理服务
const apiServer = http.createServer((req, res) => {
    const url = 'http://news-at.zhihu.com/api/4' + req.url;
    const options = {
        url: url
    };

    function callback (error, response, body) {
        if (!error && response.statusCode === 200) {
            // 设置编码类型，否则中文会显示为乱码
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            // 设置所有域允许跨域
            res.setHeader('Access-Control-Allow-Origin', '*');
            // 返回代理后的内容
            res.end(body);
        }
    }
    request.get(options, callback);
});
// 监听 8010 端口
apiServer.listen(port, hostname, () => {
    console.log(`接口代理运行在 http://${hostname}:${port}/`);
});
// 创建一个图片代理服务
const imgServer = http.createServer((req, res) => {
    const url = req.url.split('/img/')[1];
    const options = {
        url: url,
        encoding: null
    };

    function callback (error, response, body) {
        if (!error && response.statusCode === 200) {
            const contentType = response.headers['content-type'];
            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(body);
        }
    }
    request.get(options, callback);
});
// 监听 8011 端口
imgServer.listen(imgPort, hostname, () => {
    console.log(`图片代理运行在 http://${hostname}:${imgPort}/`);
});

/* 
	监听了两个端口： 8010 和 8011. 8010用于接口代理， 8011用于图片代理。 比如请求的真实接口 http: //news-at.zhihu com api news 3892357， 开发时改写为: http:// 127 .0.0.1:801 O/news/3892357; 
	代理的核心是在返回的头部（response header）中添加一项 Access-Control-Allow-Origin 为 '*'， 也就是允许所有的域访问
	最后在终端使用Node启动代理服务器
	node proxy.js
	如果成功，就会在终端显示两行日志
	接口代理运行在 http://127 .0.0.1:8010/
	图片代理运行在 http://127.0.0.1 :8011/
 */