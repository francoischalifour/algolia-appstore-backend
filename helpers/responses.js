const { repository } = require('../package')

const createError = ({
  code = 500,
  message = 'Internal server error',
  url = `https://github.com/${repository}`
} = {}) => ({
  error: {
    code,
    message,
    url
  }
})

module.exports = {
  createError
}
