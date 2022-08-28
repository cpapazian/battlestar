const { Mutex } = require('../util/mutex.js')
const common = require('battlestar-common')

// Database and collection
const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const gameCollection = database.collection('game')

const writeMutex = new Mutex()

const Game = {}
module.exports = Game


function _factory(lobby) {
  switch (lobby.game) {
    case 'Battlestar Galactica':
      return common.bsg.factory(lobby)
    case 'Innovation':
      return common.inn.factory(lobby)
    default:
      throw new Error(`Unknown game: ${lobby.game}`)
  }
}

Game.all = async function() {
  return await gameCollection.find({})
}

Game.create = async function(lobby) {
  return await writeMutex.dispatch(async () => {
    const data = _factory(lobby)
    data.settings.createdTimestamp = Date.now()

    // Added in order to support showing games that have recently ended on user home screens.
    data.lastUpdated = data.settings.createdTimestamp

    const insertResult = await gameCollection.insertOne(data)
    return insertResult.insertedId
  })
}

Game.findById = async function(gameId) {
  return await gameCollection.findOne({ _id: gameId })
}

Game.findByUserId = async function(userId) {
  return await gameCollection.find({ $or: [
    {
      'users._id': userId,
      gameOver: false
    },  // bsg
    {
      'settings.players._id': userId,
      gameOver: false
    },  // innovation
  ]})
}

Game.findWaitingByUserId = async function(userId) {
  return await gameCollection.find({ waiting: userId })
}

Game.gameOver = async function(gameId) {
  return await writeMutex.dispatch(async () => {
    await gameCollection.updateOne(
      { _id: gameId },
      { $set: { gameOver: true } },
    )
  })
}

Game.save = async function(game) {
  return await writeMutex.dispatch(async () => {
    await gameCollection.updateOne(
      { _id: game._id },
      {
        $set: {
        responses: game.responses,
        chat: game.chat,
        waiting: game.getPlayerNamesWaiting(),
        lastUpdated: Date.now(),
        }
      },
    )
  })
}

Game.saveStats = async function(gameData) {
  return await writeMutex.dispatch(async () => {
    await gameCollection.updateOne(
      { _id: gameData._id },
      { $set: { stats: gameData.stats } },
    )
  })
}
