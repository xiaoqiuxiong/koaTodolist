const Koa = require('koa')
const Router = require('koa-router')
const StaticCache = require('koa-static-cache')
const Swig = require('koa-swig')
const Co = require('co')

const app = new Koa()
const router = new Router()
const render = Swig({
  root: __dirname + '/views',
  cache: false,
  ext: '.html'
})
app.context.render = Co.wrap(render)

app.use(StaticCache(__dirname + '/static'), {
  prefix: 'public'
})

router.get('/', async ctx => {
  ctx.body = await ctx.render('index.html')
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)