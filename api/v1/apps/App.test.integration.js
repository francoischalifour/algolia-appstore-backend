import test from 'ava'
import request from 'supertest-koa-agent'
import { createContainer, asFunction, asValue } from 'awilix'
import App from '../../../app'
import AppsService from './App'
import APIError from '../../../helpers/APIError'

const APP_ID = '1'
const APP_CONTENT = {
  name: 'Reddit',
  category: 'News',
  image: 'http://is5.mzstatic.com/image/thumb/Purple7/v4/55/62/4f/55624f73-0bdd-f8ca-d02b-ba5d8fde67ae/source/175x175bb.jpg',
  link: 'https://itunes.apple.com/us/app/reddit-official-app-trending-news-and-hot-topics/id1064216828',
  price: '0 USD',
  rating: 5,
  ratingCount: 77207,
  objectID: APP_ID
}
const APPS_ENDPOINT = '/api/1/apps'
const APPS_ENDPOINT_ID = `${APPS_ENDPOINT}/${APP_ID}`
const APPS_ENDPOINT_WRONG_ID = `${APPS_ENDPOINT}/unknown-id`

const fakeApi = algoliasearchMock => {
  const container = createContainer()
  container.register({
    algoliaAppId: asValue(''),
    algoliaApiKey: asValue(''),
    algoliaAppsIndex: asValue(''),
    algoliasearch: asValue(algoliasearchMock),
    appsService: asFunction(AppsService).scoped()
  })
  const app = App({ container })
  const api = request(app)

  return api
}

test.cb(`POST ${APPS_ENDPOINT} without correct app props should return 400`, t => {
  const mock = () => ({
    initIndex: () => ({
      addObject: () => Promise.resolve({ INVALID_PROPERTY: 'Reddit' })
    })
  })

  fakeApi(mock)
    .post(APPS_ENDPOINT)
    .expect(400)
    .end((err, res) => {
      if (err) {
        throw err
      }

      const actual = res.body
      const expected = {
        error: {
          code: 400,
          message: 'should have required property \'name\'',
          url: 'https://github.com/francoischalifour/algolia-appstore-backend'
        }
      }

      t.deepEqual(actual, expected)
      t.end()
    })
})

test.cb(`POST ${APPS_ENDPOINT} with correct app should return 200`, t => {
  const mock = () => ({
    initIndex: () => ({
      addObject: () => Promise.resolve(APP_CONTENT)
    })
  })

  fakeApi(mock)
    .post(APPS_ENDPOINT)
    .send(APP_CONTENT)
    .expect(200)
    .end((err, res) => {
      if (err) {
        throw err
      }

      const actual = res.text
      const expected = APP_ID

      t.is(actual, expected)
      t.end()
    })
})

test.cb(`GET ${APPS_ENDPOINT_WRONG_ID} should return 404`, t => {
  const mock = () => ({
    initIndex: () => ({
      getObject: () => Promise.reject(new APIError({ code: 404, message: 'ObjectID does not exist' }))
    })
  })

  fakeApi(mock)
    .get(APPS_ENDPOINT_WRONG_ID)
    .expect(404)
    .end((err, res) => {
      if (err) {
        throw err
      }

      const actual = res.body
      const expected = {
        error: {
          code: 404,
          message: 'ObjectID does not exist',
          url: 'https://github.com/francoischalifour/algolia-appstore-backend'
        }
      }

      t.deepEqual(actual, expected)
      t.end()
    })
})

test.cb(`GET ${APPS_ENDPOINT_ID} should return 200`, t => {
  const mock = () => ({
    initIndex: () => ({
      getObject: () => Promise.resolve(APP_CONTENT)
    })
  })

  fakeApi(mock)
    .get(APPS_ENDPOINT_ID)
    .expect(200)
    .end((err, res) => {
      if (err) {
        throw err
      }

      const actual = res.body
      const expected = APP_CONTENT

      t.deepEqual(actual, expected)
      t.end()
    })
})

test.cb(`DELETE ${APPS_ENDPOINT_ID} should return 200`, t => {
  const mock = () => ({
    initIndex: () => ({
      getObject: () => Promise.resolve(APP_CONTENT),
      deleteObject: () => Promise.resolve()
    })
  })

  fakeApi(mock)
    .del(APPS_ENDPOINT_ID)
    .expect(200)
    .end((err, res) => {
      if (err) {
        throw err
      }

      const actual = res.body
      const expected = {
        meta: {
          type: 'success',
          code: 200
        },
        message: 'The app #1 was deleted from the Algolia "apps" index.'
      }

      t.deepEqual(actual, expected)
      t.end()
    })
})

test.cb(`DELETE ${APPS_ENDPOINT_WRONG_ID} should return 404`, t => {
  const mock = () => ({
    initIndex: () => ({
      getObject: () => Promise.reject(new APIError({ code: 404, message: 'ObjectID does not exist' })),
      deleteObject: () => Promise.resolve()
    })
  })

  fakeApi(mock)
    .del(APPS_ENDPOINT_WRONG_ID)
    .expect(404)
    .end((err, res) => {
      if (err) {
        throw err
      }

      const actual = res.body
      const expected = {
        error: {
          code: 404,
          message: 'ObjectID does not exist',
          url: 'https://github.com/francoischalifour/algolia-appstore-backend'
        }
      }

      t.deepEqual(actual, expected)
      t.end()
    })
})
