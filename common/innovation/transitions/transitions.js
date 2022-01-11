const { simpleFactory, stepFactory } = require('../../lib/transitionFactory.js')

const transitions = {
  root: {
    func: stepFactory([
      'initialize',
      'first-picks',
      'main-loop',
      'END'
    ]),
  },

  'initialize': require('./initialize.js'),
  'first-picks': require('./firstPicks.js'),
  'main-loop': require('./main.js'),
  'player-turn': require('./playerTurn.js'),

  'action-achieve': require('./actionAchieve.js'),
  'action-decree': require('./actionDecree.js'),

  'action-dogma': require('./actionDogma.js'),
  'action-dogma-one-effect': require('./actionDogmaOneEffect.js'),
  'action-dogma-one-step': require('./actionDogmaOneStep.js'),

  'action-draw': require('./actionDraw.js'),
  'raw-draw': require('./rawDraw.js'),

  'action-endorse': require('./actionEndorse.js'),
  'action-inspire': require('./actionInspire.js'),

  'action-meld': require('./actionMeld.js'),
  'raw-meld': require('./rawMeld.js'),

  'achievement-check': require('./achievementCheck.js'),
  'check-triggers': require('./checkTriggers.js'),
  'choose': require('./choose.js'),
  'choose-and-splay': require('./chooseAndSplay.js'),
  'claim-achievement': require('./claimAchievement.js'),
  'draw-and-forecast': require('./drawAndForecast.js'),
  'draw-and-meld': require('./drawAndMeld.js'),
  'draw-and-score': require('./drawAndScore.js'),
  'forecast': require('./forecast.js'),
  'transfer-cards': require('./transferCards.js'),
  'remove': require('./remove.js'),
  'remove-many': require('./removeMany.js'),
  'return': require('./return.js'),
  'return-achievement': require('./returnAchievement.js'),
  'score': require('./score.js'),
  'splay': require('./splay.js'),
}

module.exports = transitions
