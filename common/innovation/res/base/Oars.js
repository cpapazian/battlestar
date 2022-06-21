const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Oars`  // Card names are unique in Innovation
  this.name = `Oars`
  this.color = `red`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kchk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card with a {c} from your hand to my score pile! if you do, draw a {1}, and repeat this dogma effect!`,
    //`I demand you transfer a card with a {c} from your hand to my score pile! If you do, draw a {1}, and repeat this dogma effect on that card only!`,
    `If no cards were transferred due to this demand, draw a {1}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('c'))
      if (choices.length === 0) {
        game.mLogNoEffect()
      }

      const target = game.getZoneByPlayer(leader, 'score')
      let stealable = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('c'))
      while (true) {
        if (stealable.length > 0) {
          const transferred = game.aChooseAndTransfer(player, stealable, target)
          if (transferred && transferred.length > 0) {
            game.state.dogmaInfo.oarsCardTransferred = true
            const drawn = game.aDraw(player, { age: game.getEffectAge(this, 1) })
            stealable = drawn.checkHasBiscuit('c') ? [drawn] : []
            continue
          }
        }

        break
      }
    },

    (game, player) => {
      if (!game.state.dogmaInfo.oarsCardTransferred) {
        game.aDraw(player, { age: game.getEffectAge(this, 1) })
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
