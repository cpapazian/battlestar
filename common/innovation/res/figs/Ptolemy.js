const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ptolemy`  // Card names are unique in Innovation
  this.name = `Ptolemy`
  this.color = `green`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `hc*c`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw and meld a {2}.`
  this.echo = ``
  this.karma = [
    `You may issue a Trade Decree with any two figures.`,
    `Each top blue card on every player's board counts as a card you can activate with a Dogma action.`
  ]
  this.dogma = []

  this.dogmaImpl = []
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
