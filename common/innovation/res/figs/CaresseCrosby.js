const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Caresse Crosby`  // Card names are unique in Innovation
  this.name = `Caresse Crosby`
  this.color = `yellow`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `lh8*`
  this.dogmaBiscuit = `l`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `If you would tuck a card with a {l}, first splay that color of your cards left, then draw two {2}.`,
    `If you would splay a fifth color left, instead you win.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'tuck',
      kind: 'would-first',
      matches(game, player, { card }) {
        return card.biscuits.includes('l')
      },
      func: (game, player, { card }) => {
        game.aSplay(player, card.color, 'left')
        game.aDraw(player, { age: game.getEffectAge(this, 2) })
        game.aDraw(player, { age: game.getEffectAge(this, 2) })
      },
    },
    {
      trigger: 'splay',
      kind: 'would-instead',
      matches(game, player, { color, direction }) {
        const notLeftCondition = game.getZoneByPlayer(player, color).splay !== 'left'
        const leftCondition = game
          .utilColors()
          .filter(other => other !== color)
          .map(color => game.getZoneByPlayer(player, color).splay)
          .filter(splay => splay === 'left')
          .length === 4
        return leftCondition && notLeftCondition
      },
      func(game, player) {
        throw new GameOverEvent({
          player,
          reason: 'Caresse Crosby'
        })
      }
    },
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
