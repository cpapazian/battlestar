const RecordKeeper = require('../lib/recordkeeper.js')
const StateMachine = require('../lib/statemachine.js')

const initialize = require('./initialize.js')

module.exports = {
  Game,
  factory: stateFactory,

  deckbuilder: require('./deckbuilder.js'),
  res: require('./resources.js'),
  transitions: require('./transitions.js'),
  util: require('./util.js'),
}

function Game(state) {
  this.actor = null
  this.state = null
  this.rk = null
  this.sm = null
}

function stateFactory(lobby) {
  const state = {
    game: lobby.game,
    name: lobby.name,
    options: lobby.options,
    users: lobby.users,
    createdTimestamp: Date.now(),
    saveKey: 0,
    initialized: false,
    sm: {
      stack: [],
      waiting: [],
    },
  }

  initialize(state)
  return state
}

Game.prototype.load = function(transitions, state, actor) {
  this.actor = actor
  this.state = state
  this.rk = new RecordKeeper(state)
  this.sm = new StateMachine(
    transitions,
    this,
    this.rk,
    this.state.sm.stack,
    this.state.sm.waiting,
  )
}

Game.prototype.run = function() {
  return this.sm.run()
}

Game.prototype.checkPlayerHasCharacter = function(player) {
  const playerZone = this.getZoneByPlayerName(player.name)
  const characterCard = playerZone.cards.find(c => c.kind === 'character')
  return !!characterCard
}

Game.prototype.checkCardIsVisible = function(card, player) {
  if (!player) {
    player = this.actor
  }
  player = this._adjustPlayerParam(player)

  return (
    card.visibility.includes('all')
    || card.visibility.includes(player.name)
    || (card.visibility.includes('president') && this.checkPlayerIsPresident(player))
  )
}

Game.prototype.checkPlayerIsPresident = function(player) {
  player = this._adjustPlayerParam(player)
  return player.name === this.getPresidentName(state)
}

Game.prototype.getActor = function() {
  return this.actor
}

Game.prototype.getCardByLocation = function(sourceName, sourceIndex) {
  return this.getZoneByName(sourceName).cards[sourceIndex]
}

Game.prototype.getCounterByName = function(name) {
  return this.state.counters[name]
}

Game.prototype.getLog = function() {
  return this.state.log
}

Game.prototype.getPlayerActive = function() {
  return this.getPlayerByName(this.state.activePlayer)
}

Game.prototype.getPlayerAll = function() {
  return this.state.players
}

Game.prototype.getPlayerByIndex = function(index) {
  return this.state.players[index]
}

Game.prototype.getPlayerByName = function(name) {
  return this.getPlayerAll().find(p => p.name === name)
}

Game.prototype.getPlayerWaitingFor = function() {
  return this.getPlayerByName(this.state.waitingFor)
}

Game.prototype.getPlayerWithCard = function(cardName) {
  for (const player of this.getPlayerAll()) {
    const zone = this.getZoneByPlayer(player)
    if (zone.cards.find(c => c.name === cardName)) {
      return player
    }
  }
  return {}
}

Game.prototype.getPresidentName = function() {
  return playerWithCard(state, 'President').name
}

Game.prototype.getWaiting = function() {
  if (this.sm.waiting[0]) {
    return this.sm.waiting[0].actor
  }
  else {
    return undefined
  }
}

Game.prototype.getZoneAll = function() {
  return this.state.zones
}

Game.prototype.getZoneByName = function(name) {
  const tokens = name.split('.')
  let zone = this.state.zones
  while (tokens.length) {
    const next = tokens.shift()
    zone = zone[next]
    if (!zone) {
      throw `Error loading ${next} of zone ${name}.`
    }
  }
  return zone
}

Game.prototype.getZoneByPlayer = function(player) {
  player = this._adjustPlayerParam(player)
  return this.state.zones.players[player.name]
}

Game.prototype.hackImpersonate = function(player) {
  player = this._adjustPlayerParam(player)
  this.actor = player.name
}

Game.prototype.mLog = function(msg) {
  if (!msg.classes) {
    msg.classes = []
  }
  if (!msg.args) {
    msg.args = {}
  }

  enrichLogArgs(msg)
  msg.actor = this.getactor().name
  msg.id = this.getlog().length

  this.rk.session.push(this.state.log, util.deepcopy(msg))
}

Game.prototype.mPlayerAssignCharacter = function(player, characterName) {
  player = this._adjustPlayerParam(player)

  this.mutations.log({
    template: "{player} chooses {character}",
    args: {
      player: player.name,
      character: characterName,
    }
  })

  // Put the character card into the player's hand
  const playerHand = this.getZonebyPlayer(player.name)
  const characterZone = this.getZonebyName('character')
  const characterCard = characterZone.cards.find(c => c.name === characterName)
  this.rk.session.move(characterCard, playerHand, 0)

  // Put the player's pawn in the correct location
  const pawn = playerHand.cards.find(c => c.kind === 'player-token')
  const startingLocation = this.getZonebyLocationName(characterCard.setup)
  this.rk.session.move(pawn, startingLocation)
}

Game.prototype._adjustPlayerParam = function(param) {
  if (typeof param === 'string') {
    return this.getPlayerByName(param)
  }
  else if (typeof param === 'object') {
    return param
  }
  else {
    throw new Error(`Unable to convert ${param} into a player`)
  }
}


function enrichLogArgs(msg) {
  for (const key of Object.keys(msg.args)) {
    // Convert string args to a dict
    if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }

    // Ensure the dict has a classes entry
    const classes = msg.args[key].classes || []
    msg.args[key].classes = classes

    if (key === 'player') {
      util.array.pushUnique(classes, 'player-name')
    }
    else if (key === 'character') {
      util.array.pushUnique(classes, 'character-name')
      util.array.pushUnique(classes, bsg.util.characterNameToCssClass(msg.args[key].value))
    }
    else if (key === 'location') {
      util.array.pushUnique(classes, 'location-name')
    }
    else if (key === 'phase') {
      util.array.pushUnique(classes, 'phase-name')
    }
    else if (key === 'title') {
      util.array.pushUnique(classes, 'title-name')
    }
    else if (key === 'card') {
      const card = msg.args['card']
      if (typeof card !== 'object') {
        throw `Pass whole card object to log for better logging. Got: ${card}`
      }
      msg.args['card'] = {
        value: card.name,
        visibility: card.visibility,
        kind: card.kind,
        classes: [`card-${card.kind}`],
      }
    }
  }
}
