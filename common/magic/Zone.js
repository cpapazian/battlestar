const util = require('../lib/util.js')

module.exports = {
  PlayerZone,
  Zone,
}


function Zone(game, name, kind) {
  this.id = name
  this.game = game
  this.name = name
  this.kind = kind
  this.owner = undefined
  this._cards = []
}

function PlayerZone(game, player, name, kind) {
  this.id = 'players.' + player.name + '.' + name
  this.game = game
  this.name = `${player.name}'s ${name}`
  this.kind = kind
  this.owner = player
  this._cards = []
}
util.inherit(Zone, PlayerZone)

Zone.prototype.cards = function() {
  return [...this._cards]
}

Zone.prototype.getOwner = function() {
  return this.game.getPlayerByZone(this)
}

Zone.prototype.addCard = function(card) {
  card.zone = this.id
  card.home = this.id
  this._cards.push(card)
}

Zone.prototype.setCards = function(cards) {
  util.assert(Array.isArray(cards), `Cards parameter must be an array. Got ${typeof cards}.`)
  this._cards = [...cards]
  this._cards.forEach(c => {
    c.zone = this.id
    c.home = this.id
  })
}

Zone.prototype.shuffle = function() {
  util.array.shuffle(this._cards, this.game.random)
}
