const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Seikan Tunnel`  // Card names are unique in Innovation
  this.name = `Seikan Tunnel`
  this.color = `green`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have the most cards of a color showing on your board out of all colors on all boards, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const zones = game
        .getPlayerAll()
        .flatMap(player => game.utilColors().map(color => game.getZoneByPlayer(player, color)))
        .sort((l, r) => r.cards().length - l.cards().length)

      if (
        zones[0].cards().length > zones[1].cards().length
        && game.getPlayerByZone(zones[0]) === player
      ) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }

      else {
        game.mLogNoEffect()
      }
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
