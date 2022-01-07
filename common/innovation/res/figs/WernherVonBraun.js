const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Wernher Von Braun`  // Card names are unique in Innovation
  this.name = `Wernher Von Braun`
  this.color = `blue`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `*ssh`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw and foreshadow a {0}.`
  this.echo = ``
  this.triggers = [
    `Each card in your forecast counts as being in your score pile.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card