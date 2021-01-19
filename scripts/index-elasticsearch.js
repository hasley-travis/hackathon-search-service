// index-recipes-elasticsearch.js

const async = require('async');
const axios = require('axios');
const config = require('config');
const elasticsearch = require('@elastic/elasticsearch');
const uuid = require('uuid');

// initialize Elasticsearch client
const client = new elasticsearch.Client({ node: config.elasticsearch.baseUrl });

/**
 * MAIN
 */
const index = async () => {
  try {
    // Set up Elasticsearch index
    await configureElasticsearch();

    // GET /cards?cardType=recipe
    const recipeCardIds = await getRecipeCardIds();

    // Get /cards/{id}?cardType=recipe
    const recipes = await getRecipesByCardId(recipeCardIds);

    // Index recipes into Elasticsearch
    await indexElasticsearch(recipes);

    // Success!
    console.log('All recipes indexed into Elasticsearch successfully');
    process.exit(0);
  } catch(error) {
    console.error(error.message);
    process.exit(1);
  };
}

/**
 * Create Elasticsearch index, or if index already exists, skip and continue
 */
const configureElasticsearch = async () => {
  const { indexName, settings, baseUrl } = config.elasticsearch;

  try {
    return await axios.put(`${baseUrl}/${indexName}`, { settings });
  } catch (error) {
    console.error('Try deleting and restarting the Elasticsearch Docker container or getting a fresh token.');
    throw error;
  }
}

/**
 * Get all recipe cards from BFF, and return an array of all card ids
 */
const getRecipeCardIds = async () => {
  // recursively get all recipe cards
  return await getRecipeCardsRecursive([], 0);
}

/**
 * Recursively call BFF /cards endpoint with increasing offset until all cards are retrieved
 */
const getRecipeCardsRecursive = async (cardsArr, offset) => {
  const headers = buildBffHeaders();
  const params = {
    cardType: 'recipe',
    offset,
  };

  try {
    // get all recipe cards
    const response = await axios.get(config.bff.getCards.url, { headers, params });
    const { count, offset, totalSize } = response.data.metadata.pagination;

    // filter out cards not of type RecipeBrief, then map cards to card ids and add to cards array
    const newCards = response.data.payload.cards
      .filter(card => card.contentType === 'RecipeBrief')
      .map(card => card.cardId);
    cardsArr = cardsArr.concat(newCards);

    // get any remaining cards recursively
    if (cardsArr.length < totalSize) {
      return await getRecipeCardsRecursive(cardsArr, count + offset)
    } else {
      return new Promise((resolve) => {
        resolve(cardsArr)
      });
    }
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
}

/**
 * Given a list of recipe card ids, return an array containing each of the full recipe cards
 */
const getRecipesByCardId = async (recipeCardIds) => {
  const recipes = [];

  const headers = buildBffHeaders();
  const params = {
    cardType: 'recipe',
  };
  const baseUrl = config.bff.getCardsById.url;

  await async.eachLimit(recipeCardIds, config.bff.getCardsById.asyncLimit, async (cardId) => {
    try {
      const recipe = await axios.get(baseUrl + `/${cardId}`, { headers, params });
      recipes.push(recipe.data.payload);
    } catch (error) {
      console.log(error.message);
    }
  });

  return recipes;
}

const indexElasticsearch = async (recipes) => {
  const recipesSlim = recipes.map(trimRecipe);

  return await async.eachLimit(recipesSlim, config.elasticsearch.asyncLimit, async (recipeSlim) => {
    await client.index({ index: config.elasticsearch.indexName, body: recipeSlim, refresh: true });
  });
}

const trimRecipe = (recipe) => {
  return {
    cardId: recipe.cardId,
    title: cleanTextField(recipe.title),
    description: cleanTextField(recipe['section.description']),
    ingredients: cleanTextField(recipe['section.ingredients']),
    isSide: recipe.mealType['side dish'],
    isLunch: recipe.mealType.lunch,
    isDessert: recipe.mealType.dessert,
    isSnack: recipe.mealType.snack,
    isBreakfast: recipe.mealType.breakfast,
    isDinner: recipe.mealType.dinner,
  };
}

const cleanTextField = (text) => {
  return text
    .replace(/[^A-Za-z0-9]/g, ' ') // replace any non-alphanumeric character with a ' '
    .replace(/\s+/g, ' '); // replace any number of consecutive whitespace characters with a ' '
}

const buildBffHeaders = () => {
  return {
    'x-hc-corid': uuid.v4(),
    'x-hc-transactionid': uuid.v4(),
    'x-id-token': config.bff.idToken,
  };
}

index();
