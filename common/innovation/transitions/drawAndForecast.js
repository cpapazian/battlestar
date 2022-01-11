const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'draw',
      func: draw
    },
    {
      name: 'forecast',
      func: forecast
    },
    {
      name: 'returnz',
      func: returnz
    },
  ]
})

function draw(context) {
  const { game, actor } = context
  const { age } = context.data
  return game.aDraw(context, actor, age)
}

function forecast(context) {
  const { game, actor } = context
  const { returned } = context.data

  const cardToForecast = returned[0]
  const playerHand = game.getHand(actor)
  const cardIsInHand = playerHand.cards.find(c => game.checkCardsEqual(c, cardToForecast))

  // When static effects from figures trigger, sometimes the cards are moved out of hand
  // before they can be forecasted.
  if (cardIsInHand) {
    return game.aForecast(context, actor, cardToForecast)
  }
  else {
    game.mLog({
      template: '{card} is no longer in player hand to forecast',
      args: {
        card: cardToForecast
      }
    })
  }
}

function returnz(context) {
  const { game } = context
  const { returned } = context.data
  if (returned) {
    return context.return(returned)
  }
  else {
    return context.done()
  }
}