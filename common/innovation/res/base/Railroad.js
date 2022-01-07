const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Railroad`  // Card names are unique in Innovation
  this.name = `Railroad`
  this.color = `purple`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `ifih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Return all cards from your hand, then draw three {6}.`,
    `You may splay up any one color of your cards current splayed right.`
  ]

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