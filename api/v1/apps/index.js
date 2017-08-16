const router = require('koa-router')()
const { makeInvoker } = require('awilix-koa')
const logger = require('../../../helpers/logger')

const AppApi = ({ appsService }) => ({
  get: async ctx => {
    const appId = ctx.params.id
    const result = await appsService.getApp(appId)
    ctx.body = result

    logger.info(JSON.stringify(result))
  },
  add: async ctx => {
    const result = await appsService.addApp(ctx.request.body)
    ctx.body = result

    logger.info(`The app #${result} was added to the Algolia "apps" index.`)
  },
  delete: async ctx => {
    const appId = ctx.params.id
    const result = await appsService.deleteApp(appId)
    ctx.body = result

    logger.info(result.message)
  }
})

const api = makeInvoker(AppApi)

router
  .get('/:id', api('get'))
  .post('/', api('add'))
  .del('/:id', api('delete'))

module.exports = router
