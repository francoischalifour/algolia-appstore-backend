const Ajv = require('ajv')
const APIError = require('../../../helpers/APIError')
const appSchema = require('./App.schema')

const ajv = new Ajv()

const AppsService = ({
  algoliasearch,
  algoliaAppId,
  algoliaApiKey,
  algoliaAppsIndex
}) => {
  const client = algoliasearch(algoliaAppId, algoliaApiKey)
  const index = client.initIndex(algoliaAppsIndex)

  return {
    async getApp (id) {
      try {
        const content = await index.getObject(id)

        return content
      } catch (err) {
        const { statusCode: code = 404, message } = err

        throw new APIError({ code, message })
      }
    },
    async addApp (app) {
      // Check the app's schema
      const isAppValid = ajv.validate(appSchema, app)
      if (!isAppValid) {
        const firstErrorMessage = ajv.errors.find(err => err.message).message
        throw new APIError({ code: 400, message: firstErrorMessage })
      }

      try {
        const content = await index.addObject(app)
        const { objectID } = content

        return objectID
      } catch (err) {
        const { statusCode: code, message } = err

        throw new APIError({ code, message })
      }
    },
    async deleteApp (id) {
      // Check if the app exists
      try {
        await index.getObject(id)
      } catch (err) {
        const { message } = err
        throw new APIError({ code: 404, message })
      }

      try {
        await index.deleteObject(id)

        const result = {
          meta: {
            type: 'success',
            code: 200
          },
          message: `The app #${id} was deleted from the Algolia "apps" index.`
        }

        return result
      } catch (err) {
        const { statusCode: code, message } = err

        throw new APIError({ code, message })
      }
    }
  }
}

module.exports = AppsService
