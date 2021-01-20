const axios = require('axios');
const config = require('config');
const express = require('express');

const app = express();
const port = 3000;

/**
 * Health Check
 */
app.get('/', (req, res) => {
  res.send('Hello World!')
});

/**
 * Send a search request to Elasticsearch
 *
 * @param {String} req.query.q The query string
 * @param {String} [req.query.mealType] Optional meal type to filter search results on
 * @param {Number} [req.query.offset] The offset for pagination (Default: 0)
 * @param {Number} [req.query.count] The count for pagination (Default: 25)
 */
app.get('/search', async (req, res) => {
  try {
    const cardIds = await queryElasticsearch(req.query);
    res.status(200).json(cardIds);
  } catch(error) {
    if (/parameter/gi.test(error.message)) return res.status(400).send(error.message);
    if (/no results found/gi.test(error.message)) return res.status(404).send(error.message);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//************************************************************************************************//
//
// HELPER FUNCTIONS
//

/**
 * Make a POST call to the Elasticsearch instance
 */
const queryElasticsearch = async (query) => {
  const { baseUrl, indexName } = config.elasticsearch;

  const esUrl = `${baseUrl}/${indexName}/_search`;
  const queryObject = buildQueryObject(query);

  const response = await axios.post(esUrl, queryObject);
  const hits = response.data.hits.hits;

  if (!hits || hits.length < 1) throw new Error('No results found')

  return hits.map(hit => hit['_source'].cardId);
}

/**
 * Given a query string and an optional meal type, build the query object to send in the body of the
 * POST call to Elasticsearch
 */
const buildQueryObject = (query) => {
  const { q, mealType, offset, count } = query

  if (!q) throw new Error('Missing required query parameter: "q"');

  const queryObject = {
    from: offset || 0,
    size: count || 25,
    query: {
      bool: {
        must: [{
          multi_match: {
            query: q.toLowerCase().trim(),
            fields: ['title^5', 'description^1', 'ingredients^1'],
            fuzziness: 'AUTO',
            prefix_length: 4,
        }}],
      },
    },
    highlight: {
      fields: {
        title: {},
        description: {},
        ingredients: {},
  }}}

  if (mealType) queryObject.query.bool.filter = buildMealTypeFilter(mealType);

  return queryObject;
}

/**
 * Given a non-empty meal type, build the filter object to add to the query object to send in the
 * body of the POST call to Elasticsearch
 */
const buildMealTypeFilter = (mealType) => {
  switch(mealType.toLowerCase().trim()) {
    case 'breakfast':
      return [{ term: { isBreakFast: true } }];
    case 'lunch':
      return [{ term: { isLunch: true } }];
    case 'dinner':
      return [{ term: { isDinner: true } }];
    case 'side':
      return [{ term: { isSide: true } }];
    case 'snack':
      return [{ term: { isSnack: true } }];
    case 'dessert':
      return [{ term: { isDessert: true } }];
    default:
      throw new Error(`Invald parameter provided for mealType: "${mealType}"`);
  }
}
