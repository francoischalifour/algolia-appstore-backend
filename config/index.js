require('dotenv').config()

module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.APP_SERVER_HOST || '0.0.0.0',
  PORT: process.env.APP_SERVER_PORT || 9000,
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
  ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
  ALGOLIA_APPS_INDEX: 'apps'
}
