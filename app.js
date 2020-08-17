const Koa = require('koa');
const app = new Koa();
const KoaRouter = require('koa-router');

// 创建 router 实例对象
const router = new KoaRouter();

// logger
app.use(async (ctx, next) => {
  console.log('step1');
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('step5');
});

// x-response-time
app.use(async (ctx, next) => {
  console.log('step2');
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('step4');
});

app.keys = ['im a newer secret', 'i like turtle'];

// cookie
app.use(async (ctx, next) => {  
  console.log('cookie set');
  ctx.cookies.set('name', 'tobi', { signed: true });
  await next();
});

// // response
// app.use(async ctx => {
//   console.log('step3');

//   // 新鲜度检查需要状态20x或304
//   ctx.status = 200;

//   const etag = Math.floor(Date.now() / 3000);

//   console.log('etag', etag);

//   ctx.set('ETag', etag);

//   // 缓存是好的
//   if (ctx.fresh) {
//     ctx.status = 304;
//     return;
//   }

//   ctx.body = 'Hello World2';
// });

console.log('app', app);
console.log('env', app.env);
console.log('keys', app.keys);
console.log('proxy', app.proxy);
console.log('proxyIpHeader', app.proxyIpHeader);
console.log('maxIpsCount', app.maxIpsCount);

//注册路由
router.get('/', async (ctx, next) => {
  console.log('index');
  ctx.body = 'index2';
});

//动态路由  http://localhost:3000/newscontent/xxxx
router.get('/newscontent/:aid',async (ctx)=>{
    //获取动态路由的传值
    console.log(ctx.params);  //{ aid: '456' }
    ctx.body="新闻详情1";
});

//动态路由里面可以传入多个值
//http://localhost:3000/package/123/456
router.get('/package/:aid/:cid',async (ctx)=>{
    //获取动态路由的传值
    console.log(ctx.params);  //{ aid: '123', cid: '456' }
    ctx.body="新闻详情2";
});

app.use(router.routes());  // 添加路由中间件
app.use(router.allowedMethods()); // 对请求进行一些限制处理



console.log('server start http://localhost:3000');
app.listen(3000);