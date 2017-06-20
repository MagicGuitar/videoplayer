'use strict';
const express = require('express');
const app = express();
app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler);
});
app.listen(8080,()=>{
   console.log("服务器启动");
});