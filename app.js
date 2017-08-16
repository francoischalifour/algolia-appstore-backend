const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const { scopePerRequest } = require('awilix-koa')
const errorHandler = require('./middlewares/errorHandler')
const api = require('./api')

module.exports = ({ container }) => {
  const app = new Koa()

  app
    // Middleware to retrieve POST content (e.g. to add an app to the Algolia index)
    .use(bodyparser())
    // Custom middleware to set correct code statuses when an error is thrown
    .use(errorHandler)
    // Dependency injection with Awilix
    .use(scopePerRequest(container))
    .use(api.routes())
    .use(api.allowedMethods())

  return app
}
