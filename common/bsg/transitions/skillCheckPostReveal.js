const { transitionFactory } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const check = game.getSkillCheck()

  // Mostly a result of testing
  if (check.result) {
    return context.done()
  }

  return context.wait({
    actor: 'dennis',
    actions: [{
      name: 'Skill Check - Post Reveal',
      options: [],
    }]
  })
}

function handleResponse(context) {
}
