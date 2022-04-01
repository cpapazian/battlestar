const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Repute'
  this.name = 'Repute'
  this.shortName = 'rept'
  this.expansion = 'city'
  this.text = 'Claim this achievement immediately if you meld a city with a {>} on a color already splayed right.'
  this.isSpecialAchievement = true
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
