const { createError } = require('../helpers/responses')
const logger = require('../helpers/logger')

const errorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    const { code = 500, message } = err
    const formattedError = createError({ code, message })

    ctx.status = code
    ctx.body = formattedError

    logger.error(JSON.stringify(formattedError))
  }
}

module.exports = errorHandler
