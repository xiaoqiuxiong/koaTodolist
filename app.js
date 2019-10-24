const Koa = require('koa')
const Router = require('koa-router')
const StaticCache = require('koa-static-cache')
const Swig = require('koa-swig')
const Co = require('co')
const bodyparser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()
let datas = {
  appName: 'Todolist',
  tasks: [{
      id: 1,
      title: '测试任务1',
      isDon: true
    },
    {
      id: 2,
      title: '测试任务2',
      isDon: false
    },
    {
      id: 3,
      title: '测试任务3',
      isDon: false
    }
  ]
}

app.context.render = Co.wrap(Swig({
  root: __dirname + '/views',
  autoescape: true,
  cache: false,
  ext: 'html'
}))

app.use(bodyparser())

app.use(StaticCache(__dirname + '/static', {
  prefix: '/static'
}))

router.get('/', async ctx => {
  ctx.body = await ctx.render('index.html', {
    datas
  })
})

router.get('/add', async ctx => {
  ctx.body = await ctx.render('add.html', {
    datas
  })
})

router.post('/addToServer', async ctx => {
  let title = ctx.request.body.title
  if (title) {
    datas.tasks.push({
      id: datas.tasks.length + 1,
      title,
      status: false
    })
    ctx.body = await ctx.render('msg', {
      datas: {
        appName: datas.appName,
        msg: '添加新任务成功',
        type: 'success',
        linkHref: '/',
      }
    })
  } else {
    ctx.body = await ctx.render('msg', {
      datas: {
        appName: datas.appName,
        msg: '请输入新任务',
        type: 'danger',
        linkHref: 'javascript:history.go(-1)',
      }
    })
  }
})

router.get('/change/:id', ctx => {
  let id = ctx.params.id
  datas.tasks.forEach(task => {
    if (task.id === Number(id)) {
      task.isDon = !task.isDon
    }
  })
  ctx.redirect('/')
})

router.get('/del/:id', async ctx => {
  let id = ctx.params.id
  datas.tasks = datas.tasks.filter(item => item.id != id)
  ctx.body = await ctx.render('msg', {
    datas: {
      appName: datas.appName,
      msg: '删除任务成功',
      type: 'success',
      linkHref: '/',
    }
  })
})

app.use(router.routes()).use(router.allowedMethods())

app.on('error', (err, ctx) => {
  console.log(666);
})

app.listen(3000)