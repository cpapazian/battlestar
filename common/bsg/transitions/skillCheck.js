const { transitionFactory, markDone } = require('./factory.js')


/* const steps = [
 *   'discuss',
 *   'choose',
 *   'pre-check modifiers',
 *   'play cards',
 *   'reveal',
 *   'post-check modifiers',
 * ] */


module.exports = transitionFactory(
  {
    step: 'discuss',
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const step = context.data.step
  const check = game.getSkillCheck()

  // Initialize the skill check info in the game state
  if (!check) {
    game.rk.sessionStart(() => {
      game.mSetSkillCheck(context.data.check)
      game.mLog({
        template: `name: ${context.data.check.name}`
      })
    })
  }

  // Skill checks can end up resolved in a number of ways, not all related to
  // going through all the steps.
  if (check && check.result) {
    return context.done()
  }

  if (step === 'discuss') {
    const waits = []
    for (const player of game.getPlayerAll()) {
      waits.push({
        actor: player.name,
        actions: [{
          name: 'Skill Check - Discuss',
          options: [
            'none',
            'a little',
            'some',
            'a lot',
          ],
        }],
      })
    }
    return context.waitMany(waits)
  }

  else {
    throw new Error(`Unknown step: ${step}`)
  }
}

function handleResponse(context) {
  const game = context.state
  const step = context.data.step
  const check = game.getSkillCheck()

  // Skill checks can end up resolved in a number of ways, not all related to
  // going through all the steps.
  if (check && check.result) {
    return context.done()
  }
}
