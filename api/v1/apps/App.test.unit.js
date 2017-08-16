import test from 'ava'
import AppFactory from './App'
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

test('[addApp] adds an app to the index', async t => {
  const mock = () => ({
    initIndex: () => ({
      addObject: () => Promise.resolve(APP_CONTENT)
    })
  })
  const controller = AppFactory({ algoliasearch: mock })

  const actual = await controller.addApp(APP_CONTENT)
  const expected = APP_ID

  t.is(actual, expected)
})

test('[addApp] throws when the schema is not valid', async t => {
  const mock = () => ({
    initIndex: () => ({
      addObject: () => Promise.reject(new APIError({ code: 400, message: 'should have required property \'name\'' }))
    })
  })
  const controller = AppFactory({ algoliasearch: mock })

  try {
    await controller.addApp({
      INVALID_PROPERTY: 'Reddit',
      category: 'News',
      image: 'http://is5.mzstatic.com/image/thumb/Purple7/v4/55/62/4f/55624f73-0bdd-f8ca-d02b-ba5d8fde67ae/source/175x175bb.jpg',
      link: 'https://itunes.apple.com/us/app/reddit-official-app-trending-news-and-hot-topics/id1064216828',
      price: '0 USD',
      rating: 5,
      ratingCount: 77207,
      objectID: APP_ID
    })
    t.fail()
  } catch (err) {
    t.is(err.code, 400)
    t.is(err.message, 'should have required property \'name\'')
  }
})

test('[getApp] returns the correct app schema', async t => {
  const mock = () => ({
    initIndex: () => ({
      getObject: () => Promise.resolve(APP_CONTENT)
    })
  })
  const controller = AppFactory({ algoliasearch: mock })

  const actual = await controller.getApp(APP_ID)
  const expected = APP_CONTENT

  t.deepEqual(actual, expected)
})

test('[getApp] throws when get a non existant app from the index', async t => {
  const mock = () => ({
    initIndex: () => ({
      getObject: () => Promise.reject(new APIError({ code: 404, message: 'ObjectID does not exist' }))
    })
  })
  const controller = AppFactory({ algoliasearch: mock })

  try {
    await controller.getApp('unknown-id')
  } catch (err) {
    t.is(err.code, 404)
    t.is(err.message, 'ObjectID does not exist')
  }
})

test('[deleteApp] deletes an app from the index', async t => {
  const mock = () => ({
    initIndex: () => ({
      getObject: () => Promise.resolve(APP_CONTENT),
      deleteObject: () => Promise.resolve()
    })
  })
  const controller = AppFactory({ algoliasearch: mock })

  const actual = await controller.deleteApp(APP_ID)
  const expected = {
    meta: {
      type: 'success',
      code: 200
    },
    message: `The app #${APP_ID} was deleted from the Algolia "apps" index.`
  }

  t.deepEqual(actual, expected)
})

test('[deleteApp] throws when delete a non existant app from the index', async t => {
  const mock = () => ({
    initIndex: () => ({
      getObject: () => Promise.reject(new APIError({ code: 404, message: 'ObjectID does not exist' })),
      deleteObject: () => Promise.resolve()
    })
  })
  const controller = AppFactory({ algoliasearch: mock })

  try {
    await controller.deleteApp(APP_ID)
  } catch (err) {
    t.is(err.code, 404)
    t.is(err.message, 'ObjectID does not exist')
  }
})
