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
  this.name = name
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

Zone.prototype.shuffle = function(opts={}) {
  if (!opts.silent) {
    this.game.mLog({
      template: "{player}'s {zone} shuffled",
      args: {
        player: this.owner,
        zone: this
      }
    })
  }

  util.array.shuffle(this._cards, this.game.random)
  if (this.kind === 'hidden') {
    this._cards.forEach(card => card.visibility = [])
  }
  else if (this.kind === 'private') {
    this._cards.forEach(card => card.visibility = [this.owner])
  }
}

Zone.prototype.shuffleBottom = function(count, opts={}) {
  if (!opts.silent) {
    this.game.mLog({
      template: `{player}'s {zone} bottom ${count} shuffled`,
      args: { player: this.owner, zone: this },
    })
  }

  const toShuffle = this._cards.slice(-count)
  util.array.shuffle(toShuffle, this.game.random)
  this._cards.splice(this._cards.length - count, count, ...toShuffle)

  if (this.kind === 'hidden') {
    this._cards.forEach(card => card.visibility = [])
  }
  else if (this.kind === 'private') {
    this._cards.forEach(card => card.visibility = [this.owner])
  }
}

Zone.prototype.sortCardsByName = function() {
  this._cards.sort((l, r) => l.name.localeCompare(r.name))
}
