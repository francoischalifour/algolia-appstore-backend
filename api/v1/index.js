const router = require('koa-router')()
const apps = require('./apps')

router
  .use('/apps', apps.routes())

module.exports = router
