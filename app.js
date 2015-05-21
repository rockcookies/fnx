var directory = require('serve-index');
var express = require('express');

var app = express();
var port = 1001;

/*====================初始化服务器====================*/
//设置监听端口
app.listen(port, function () {
	console.log('Listening on ' + port + '...............');
});

app.use(directory('./', {
	icons : true
}));
app.use(express.static('./'));


module.exports = app;