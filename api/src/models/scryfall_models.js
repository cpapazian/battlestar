const fs = require('fs')

const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const scryfallCollection = database.collection('scryfall')


const Scryfall = {}  // This will be the exported module

async function insertCardsIntoDatabase(cards) {
  await scryfallCollection.deleteMany({})  // Remove old data
  await scryfallCollection.insertMany(cards, { ordered: true })
}

Scryfall.fetchAll = async function() {
  return await scryfallCollection.find({})
}

Scryfall.updateAll = async function() {
  const scryfallFolder = __dirname + '/../../scripts/card_data'
  const files = fs
    .readdirSync(scryfallFolder)
    .filter(filename => filename.startsWith('default-cards-'))
    .sort()
  const latest = files[files.length - 1]

  const data = fs.readFileSync(scryfallFolder + '/' + latest).toString()
  const cards = JSON.parse(data)
  await insertCardsIntoDatabase(cards)
}

module.exports = Scryfall
