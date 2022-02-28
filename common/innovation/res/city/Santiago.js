const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Santiago`  // Card names are unique in Innovation
  this.name = `Santiago`
  this.color = `green`
  this.age = 9
  this.expansion = `city`
  this.biscuits = `99issh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
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
