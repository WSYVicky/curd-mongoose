/**
 * app.js 入门模块
 * 职责：
 *    1.启动服务
 *    2.一些服务相关的配置
 *      1)模版引擎
 *      2)body-parser 解析表单 post 请求体
 *      3)提供静态资源服务
 *    3.启动路由
 *    4.监听端口，启动服务
 */

var express= require('express')
var router = require('./router')
var bodyParser = require('body-parser')



var app = express()

//配置body-parser,一定要在 app.use之前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//把路由容器挂在到app容器中
app.use(router)

app.use('/node_modules/',express.static('./node_modules'))
app.use('/public/',express.static('./public/'))

app.engine('html',require('express-art-template'))

app.listen(3000,function () {
  console.log('running 3000...')
})

module.exports = app