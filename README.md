# 🖥 Algolia AppStore - Backend

> AppStore backend application to interact with Algolia indices.

*Requirements: Node >= 7.6 ([see why](#design-decisions)).*

## Getting started

* Clone the repo
* Install Node dependencies: `yarn install`
* Run the server: `yarn start`
* Listening on: [`http://0.0.0.0:9000`](http://0.0.0.0:9000)

*You can also use npm.*

## Routes

### `POST /api/1/apps`

Add an app (as a JSON object) to the Algolia `apps` index and return its `id`.

#### Attributes

| Attribute     | Type      | Format      |
| ------------- | --------- | ----------- |
| `name`        | `string`  |             |
| `category`    | `string`  |             |
| `image`       | `string`  | uri         |
| `link`        | `string`  | uri         |
| `price`       | `string`  | "0.99 USD"  |
| `rating`      | `integer` | 0 <= x <= 5 |
| `ratingCount` | `integer` | 0 <= x      |

#### Example

```bash
curl --request POST \
  --url http://localhost:9000/api/1/apps \
  --header 'content-type: application/json' \
  --data '{"name": "Reddit", "category": "News", "image": "http://is5.mzstatic.com/image/thumb/Purple7/v4/55/62/4f/55624f73-0bdd-f8ca-d02b-ba5d8fde67ae/source/175x175bb.jpg", "link": "https://itunes.apple.com/us/app/reddit-official-app-trending-news-and-hot-topics/id1064216828", "price": "0 USD", "rating": 5, "ratingCount": 77207}'
```

#### Possible output

##### Success

```bash
16290372
```

##### Error

```json
{
  "error": {
    "code": 400,
    "message": "should have required property 'price'",
    "url": "https://github.com/francoischalifour/algolia-appstore-backend"
  }
}
```

### `DELETE /api/1/apps/:id`

Delete the app `id` from the Algolia `apps` index.

#### Example

```bash
curl --request DELETE \
  --url http://localhost:9000/api/1/apps/16290372 \
  --header 'content-type: application/json'
```

#### Possible output

```json
{
	"meta": {
		"type": "success",
		"code": 200
	},
	"message": "The app #16290372 was deleted from the Algolia \"apps\" index."
}
```

## Development setup

### Environment

| Variable          | Default   | Description           |
| ----------------- | --------- | --------------------- |
| `APP_SERVER_HOST` | "0.0.0.0" | Address of the server |
| `APP_SERVER_PORT` | 9000      | Port of the server    |
| `ALGOLIA_APP_ID`  | ""        | Your Algolia app ID   |
| `ALGOLIA_API_KEY` | ""        | Your Algolia API key  |

To set Algolia's environment variables, duplicate the file [`.env.sample`](.env.sample) and rename it [`.env`](.env). Provide your Algolia credentials in the latter, which will never be committed.

### Commands

* Watch: `yarn dev`
* Lint: `yarn lint`
* Fix lint: `yarn lint:fix`
* Test: `yarn test`

*You can also use npm.*

## Design decisions

* __Server technologies__: I decided to use Node and Koa as HTTP framework for this backend implementation. Koa uses `async` and `await` and therefore needs Node >= 7.6.
* __Architecture__: Although this project is meant to be minimalist, I decided to abstract the framework used so that we can easily get rid of Koa and plug another one ([see `api/v1/apps/index.js`](api/v1/apps/index.js) which abstracts the request and the response for [`api/v1/apps/App.js`](api/v1/apps/App.js)).
* **Schema validation**: Apps are not sent to Algolia as long as they are not valid apps. I used [AJV](https://github.com/epoberezkin/ajv) as JSON-schema validator.
* __Routes__: I added a `GET /api/1/apps/:id` route for development purpose and better management of the `DELETE` route (to check that the object actually exists before deleting it).
* __Logger__: Winston was used to keep track of what the server receives in the console. I decided not to save the logs in a file for this project.
* __Code style__: Standard JS was used so that I waste time creating a personal custom style.
* __Dependency injection__: To make testing easier (and mainly for learning purpose), I used [Awilix](https://github.com/jeffijoe/awilix) for dependency resolution to mock [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript) in test environment.
* __Tests__: AVA was used for unit tests and integration tests. I mocked [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript) to not request Algolia's servers while testing.

## Related

* [algolia-appstore-frontend](https://github.com/francoischalifour/algolia-appstore-frontend)

## License

MIT © [François Chalifour](https://francoischalifour.com)
