const { createContainer, asFunction, asValue } = require('awilix')
const algoliasearch = require('algoliasearch')
const App = require('./app')
const AppsService = require('./api/v1/apps/App')
const config = require('./config')
const logger = require('./helpers/logger')

const { HOST, PORT } = config

const container = createContainer()

container.register({
  algoliaAppId: asValue(config.ALGOLIA_APP_ID),
  algoliaApiKey: asValue(config.ALGOLIA_API_KEY),
  algoliaAppsIndex: asValue(config.ALGOLIA_APPS_INDEX),
  algoliasearch: asValue(algoliasearch),
  appsService: asFunction(AppsService).scoped()
})

const app = App({ container })

app.listen(PORT, HOST, () =>
  logger.info(`Server running at http://${HOST}:${PORT}`))
