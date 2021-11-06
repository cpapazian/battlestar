const { transitionFactory } = require('./factory.js')
const bsgutil = require('../util.js')

module.exports = transitionFactory(
  {
    effectIndex: 0,
  },
  generateOptions,
  () => { throw new Error('There should never be a response to evaluate-card-effect') },
)

function generateOptions(context) {
  const game = context.state
  const details = context.data.effects
  const effects = details.effect || details
  const effectIndex = context.data.effectIndex

  // Our first time visiting this function
  if (effectIndex === 0) {
    game.rk.sessionStart(session => {
      game.mLog({
        template: `Evaluating effects of ${context.data.name}`,
      })
    })

    if (details.dieRoll && !bsgutil.rollDieResult(details.dieRoll)) {
      game.rk.sessionStart(() => {
        game.mLog({ template: "Die roll didn't match; no effect" })
      })
      return context.done()
    }
  }

  // All effects have been evaluated (or, there were no effects)
  if (effectIndex >= effects.length) {
    return context.done()
  }

  // Mark that next time we visit this function, we should do the next index
  game.rk.sessionStart(session => {
    session.increment(context.data, 'effectIndex')
  })

  const result = _evaluateEffect(game, effects[effectIndex])

  // Pause and wait for humans to decide something
  if (result && result.push) {
    return context.push(result.push.transition, result.push.payload)
  }

  // Go on to the next iteration
  else {
    return generateOptions(context)
  }
}

function _evaluateEffect(game, effect) {
  const kind = (typeof effect === 'string') ? effect : effect.kind

  if (kind === 'choice') {
    return {
      push: {
        transition: 'make-choice',
        payload: {
          playerName: game.getPlayerPresident().name,
          options: effect.options,
        }
      }
    }
  }

  else if (kind === 'civilianDestroyed') {
    const civilianBag = game.getZoneByName('decks.civilian')
    for (let i = 0; i < effect.count; i++) {
      if (civilianBag.cards.length > 0) {
        const civilian = civilianBag.cards[0]
        game.aDestroyCivilian(civilian)
      }
    }
  }

  else if (kind === 'counter') {
    const { counter, amount } = effect
    game.rk.sessionStart(() => {
      game.mAdjustCounterByName(counter, amount)
    })
  }

  else if (kind === 'deploy') {
    game.aDeployShips(effect.ships)
  }

  else if (kind === 'discardSkills') {
    const { actor, count } = effect

    if (actor === 'each') {
      const playerNames = game.getPlayerAll().map(p => p.name)
      return {
        push: {
          transition: 'discard-skill-cards-in-parallel',
          payload: {
            playerNames,
            count,
          }
        }
      }
    }

    else {
      return {
        push: {
          transition: 'discard-skill-cards',
          payload: {
            playerName: actor,
            count: count,
          }
        }
      }
    }
  }

  else if (kind === 'move') {
    const { actor, location } = effect
    const player = game.getPlayerByDescriptor(actor)
    const locationZone = game.getZoneByLocationName(location)
    game.rk.sessionStart(() => {
      game.mMovePlayer(player, locationZone)
    })
  }

  else if (kind === 'title') {
    const { title, assignTo } = effect
    const player = game.getPlayerByDescriptor(assignTo)
    if (title === 'Admiral') {
      game.aAssignAdmiral(player)
    }
    else if (title === 'President') {
      game.aAssignPresident(player)
    }
    else {
      throw new Error(`Unknown title: ${name}`)
    }
  }

  else if (kind === 'viewLoyalty') {
    const { viewer, target, count } = effect
    const viewerPlayer = game.getPlayerByDescriptor(viewer)
    const targetPlayer = game.getPlayerByDescriptor(target)
    game.aRevealLoyaltyCards(targetPlayer, viewerPlayer, count)
  }

  ////////////////////////////////////////////////////////////
  // Special cases

  else if (kind === 'aTraitorAccused') {
    throw new Error('not implemented')
  }

  else if (kind === 'besieged') {
    const spaceZone = game.getZoneSpaceByIndex(5)
    const raiders = spaceZone.cards.filter(c => c.kind === 'ships.raiders')
    for (let i = 0; i < 4; i++) {
      game.aActivateRaider({
        card: raiders[i],
        zoneName: spaceZone.name,
      })
    }
  }

  else if (kind === 'returnAllVipers') {
    game.aReturnAllVipersToSupply()
  }

  else if (kind === 'tacticalStrike') {
    throw new Error('not implemented')
  }

  else if (kind === 'thirtyThree') {
    throw new Error('not implemented')
  }

  else {
    throw new Error(`Unhandled script kind: ${kind}`)
  }
}