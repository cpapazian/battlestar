const { GameOverEvent } = require('../../lib/game.js')
const { CubeDraftFactory } = require('./cube_draft.js')
const cardLookupFunc = require('../test_cardlookup.js')
const log = require('../../lib/log.js')
const jsUtil = require('util')


const TestUtil = {}

TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: 2,
    players: [
      {
        _id: 'dennis_id',
        name: 'dennis',
      },
      {
        _id: 'micah_id',
        name: 'micah',
      },
      {
        _id: 'scott_id',
        name: 'scott',
      },
      {
        _id: 'eliya_id',
        name: 'eliya',
      },
    ],

    numPacks: 3,
    packSize: 3,
    packs: [
      {
        owner: 'dennis',
        id: 'dennis-0',
        testIndex: 0,
        cards: [
          'advance scout',
          'agility',
          'akki ember-keeper',
          'white knight',
          'shock',
        ],
      },
      {
        owner: 'dennis',
        id: 'dennis-1',
        testIndex: 1,
        cards: [
          'benalish hero',
          'goblin balloon brigade',
          'holy strength',
          'agility',
          'mountain',
        ],
      },
      {
        owner: 'dennis',
        testIndex: 2,
        id: 'dennis-2',
        cards: [
          'advance scout',
          'agility',
          'akki ember-keeper',
          'plains',
          'advance scout',
        ],
      },
      {
        owner: 'micah',
        testIndex: 0,
        id: 'micah-0',
        cards: [
          'lightning bolt',
          'mountain',
          'plains',
          'tithe',
          'goblin balloon brigade',
        ],
      },
      {
        owner: 'micah',
        testIndex: 1,
        id: 'micah-1',
        cards: [
          'shock',
          'tithe',
          'white knight',
          'mountain',
          'advance scout',
        ],
      },
      {
        owner: 'micah',
        testIndex: 2,
        id: 'micah-2',
        cards: [
          'benalish hero',
          'advance scout',
          'lightning bolt',
          'tithe',
          'shock',
        ],
      },
    ],
  }, options)

  options.players = options.players.slice(0, options.numPlayers)
  options.packs = options
    .packs
    .filter(p => p.testIndex < options.numPacks)
  options
    .packs
    .forEach(p => p.cards = p.cards.slice(0, options.packSize))

  const game = CubeDraftFactory(options, 'dennis')
  game.cardLookupFunc = cardLookupFunc

  game.testSetBreakpoint('initialization-complete', (game) => {
    // Set turn order
    game.state.players = ['dennis', 'micah', 'scott', 'eliya']
      .slice(0, game.settings.numPlayers)
      .map(name => game.getPlayerByName(name))
      .filter(p => p !== undefined)
  })

  return game
}

TestUtil.choose = function(game, request, actor, option) {
  const selector = request.selectors.find(s => s.actor === actor)

  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: [option],
   })
}

TestUtil.testBoard = function(game, expected) {
  for (const player of game.getPlayerAll()) {
    this.testPicks(game, player.name, expected[player.name].picked)
    this.testPacks(game, player.name, expected[player.name].waiting)
  }
}

TestUtil.testPicks = function(game, playerName, cardNames) {
  const player = game.getPlayerByName(playerName)
  const picks = game.getPicksByPlayer(player).map(c => c.name)
  expect(picks).toStrictEqual(cardNames)
}

TestUtil.testPacks = function(game, playerName, packIds) {
  const player = game.getPlayerByName(playerName)
  const waiting = game.getWaitingPacksForPlayer(player).map(p => p.id)
  expect(packIds).toStrictEqual(waiting)
}

TestUtil.testVisibility = function(game, playerName, expected) {
  const player = game.getPlayerByName(playerName)
  const pack = game.getNextPackForPlayer(player)

  const visibleCards = pack.getKnownCards(player).map(c => c.name).sort()
  expect(visibleCards).toStrictEqual(expected.visible.sort())

  const picked = pack.getKnownPickedCards(player).map(c => c.name).sort()
  expect(picked).toStrictEqual(expected.picked.sort())

  const yourPicks = pack.getPlayerPicks(player).map(c => c.name).sort()
  expect(yourPicks).toStrictEqual(expected.yourPicks.sort())
}

////////////////////////////////////////////////////////////////////////////////
// Data Shortcuts

TestUtil.dennis = function(game) {
  return game.getPlayerByName('dennis')
}


////////////////////////////////////////////////////////////////////////////////
// State Inspectors

TestUtil.deepLog = function(obj) {
  //console.log(JSON.stringify(obj, null, 2))
  console.log(jsUtil.inspect(obj, false, 3, true))
}

TestUtil.dumpLog = function(game) {
  const output = []
  for (const entry of game.getLog()) {
    if (entry === '__INDENT__' || entry === '__OUTDENT__' || entry.type === 'response-received') {
      continue
    }
    output.push(log.toString(entry))
  }
  console.log(output.join('\n'))
}

function _dumpZonesRecursive(root, indent=0) {
  const output = []

  if (root.id) {
    output.push(root.id)
    for (const card of root.cards()) {
      output.push(`   ${card.id}`)
    }
  }

  else {
    for (const zone of Object.values(root)) {
      output.push(_dumpZonesRecursive(zone, indent+1))
    }
  }

  return output.join('\n')
}

TestUtil.dumpZones = function(root) {
  console.log(_dumpZonesRecursive(root))
}


module.exports = TestUtil
