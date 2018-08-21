/**
 * router.js 入门模块
 * 职责：
 *    处理路由
 *    根据不同的请求方法+请求路径设置具体请求处理函数
 * 模块的职责要单一，不要乱写
 *    目的：便于维护，提高开发效率
 */

var fs = require('fs')
var Student = require('./student')

//Express 提供了一个种更好的方式
//专门用来包装路由的
var express =  require('express')

// 1.创建一个路由容器
var router = express.Router()

// 2.把路由都挂载到router路由容器中
// 2.1 渲染首页
router.get('/students',function (req,res) {
  //readFile的第二个参数是可选的
  //传入utf8就是告诉它：把读取到的文件直接按照utf8编码来读
  //除了这样来转换，也可以通过 data.toString()的方式

  Student.find(function (err,students) {
    if(err){
      return res.status(500).send('Server error')
    }
    res.render('index.html',{
      fruits: [
        '苹果',
        '香蕉',
        '橘子',
        '芒果'
      ],
      //将data字符串转为对象
      students: students
    })
  })
})

// 2.2 渲染添加学生页面
router.get('/students/new',function(req,res){
  res.render('new.html')
})

// 2.3 处理添加学生请求
router.post('/students/new',function(req,res){
  // 1.获取表单数据
  // 2.处理：将数据保存到db.json文件中用以持久化
  //   1）先读取出来，转成对象
  //   2）接着往对象中 push 数据
  //   3）然后把对象转为字符串
  //   4）最后把字符串再次写入文件
  // 3.发布响应
  new Student(req.body).save(function (err) {
    if(err){
      return res.status(500).send('Server error.')
    }
    res.redirect('/students')
  })
})

// 2.4 渲染编辑页面
router.get('/students/edit',function(req,res){
  //1.在客户端的列表页中处理连接问题（需要有id参数）
  //2.获取要编辑的学生id
  //3.渲染编辑页面
  //  1）根据id把学生信息查出来
  //  2）使用模版引擎渲染页面
  Student.findById(req.query.id.replace(/"/g,''),function (err,student) {
    if(err){ return res.status(500).send('Server error') }
    res.render('edit.html',{
      student:student
    })
  })
})

// 2.5 处理编辑请求
router.post('/students/edit',function(req,res){
  //1.获取表单数据
  //2.更新
  //   Student.update()
  //3.发送响应
  var id = req.body.id.replace(/"/g,'')
  Student.findByIdAndUpdate(req.body,function (err) {
    if(err){
      return res.status(500).send('Server error')
    }
    res.redirect('/students')
  })
})

// 2.6 处理删除请求
router.get('/students/delete',function(req,res){
  //1. 获取要删除的id
  //2. 根据id执行删除操作
  //3. 根据操作结果发送响应数据
  var id = req.query.id.replace(/"/g, '')
  Student.findByIdAndRemove(id,function(err){
    if(err){
      return res.status(500).send('Server error')
    }
    res.redirect('/students')
  })
})

// 3. 把router导出
module.exports= router

