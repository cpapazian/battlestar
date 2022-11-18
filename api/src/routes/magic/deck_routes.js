const db = require('../../models/db.js')

const Deck = {}


Deck.create = async function(req, res) {
  const deckId = await db.magic.deck.create(req.body)
  const deck = await db.magic.deck.findById(deckId)

  res.json({
    status: 'success',
    deck,
  })
}

Deck.save = async function(req, res) {
  await db.magic.deck.save(req.body.deck)
  res.json({
    status: 'success',
  })
}


module.exports = Deck