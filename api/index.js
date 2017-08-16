const router = require('koa-router')()
const v1 = require('./v1')

router
  .use('/api/1', v1.routes())

module.exports = router
