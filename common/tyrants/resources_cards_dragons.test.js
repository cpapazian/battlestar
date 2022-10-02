Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Dragons Expansion Cards', () => {

  describe('Dragon Cultist', () => {
    test('Choose power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragon Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragon Cultist')
      const request3 = t.choose(game, request2, '+2 power')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Dragon Cultist'],
          power: 2,
        }
      })
    })

    test('Choose influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragon Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragon Cultist')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Dragon Cultist'],
          influence: 2,
        }
      })
    })
  })

  describe('Red Wyrmling', () => {
    test('power and influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Red Wyrmling'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Red Wyrmling')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Red Wyrmling'],
          power: 2,
          influence: 2,
        }
      })
    })
  })

  describe('Dragonclaw', () => {
    test('Assassinate a troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragonclaw'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragonclaw')

      t.testBoard(game, {
        dennis: {
          discard: ['Dragonclaw'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: [],
        },
      })
    })

    test('If you have 4 or fewer troops, do not gain any power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragonclaw'],
          trophyHall: ['micah', 'micah', 'micah']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragonclaw')

      t.testBoard(game, {
        dennis: {
          discard: ['Dragonclaw'],
          trophyHall: ['troop-micah', 'troop-micah', 'troop-micah', 'neutral'],
        },
        'araum-ched': {
          troops: [],
        },
      })
    })

    test('If you have 5 or more troops in your trophy hall, gain +2 power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragonclaw'],
          trophyHall: ['micah', 'micah', 'micah', 'micah']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragonclaw')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Dragonclaw'],
          trophyHall: ['troop-micah', 'troop-micah', 'troop-micah', 'troop-micah', 'neutral'],
          power: 2,
        },
        'araum-ched': {
          troops: [],
        },
      })
    })
  })

  describe('Severin Silrajin', () => {
    test('power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Severin Silrajin'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Severin Silrajin')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Severin Silrajin'],
          power: 5,
        }
      })
    })
  })

  describe('Red Dragon', () => {
    test('supplant a troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Red Dragon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Red Dragon')

      t.testBoard(game, {
        dennis: {
          discard: ['Red Dragon'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: ['dennis'],
          spies: []
        }
      })
    })

    test('return an enemy spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Red Dragon'],
        },
        'Araumycos': {
          spies: ['micah']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Red Dragon')

      t.testBoard(game, {
        dennis: {
          discard: ['Red Dragon'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: ['dennis'],
          spies: []
        },
        'Araumycos': {
          troops: ['neutral', 'neutral', 'neutral', 'neutral'],
          spies: []
        },
      })
    })

    test('gain a VP for each site under your total control', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Red Dragon'],
        },
        'Araumycos': {
          spies: ['micah', 'micah']
        },
        'Llacerellyn': {
          troops: ['dennis', 'dennis'],
        },
        'Chasmleap Bridge': {
          troops: ['dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Red Dragon')
      const request3 = t.choose(game, request2, 'araum-ched, neutral')

      t.testBoard(game, {
        dennis: {
          discard: ['Red Dragon'],
          trophyHall: ['neutral'],
          points: 2,
        },
        'araum-ched': {
          troops: ['dennis'],
          spies: []
        },
        'Araumycos': {
          troops: ['neutral', 'neutral', 'neutral', 'neutral'],
          spies: []
        },
        'Chasmleap Bridge': {
          troops: ['dennis'],
        },
        'Llacerellyn': {
          troops: ['dennis', 'dennis'],
        },
      })
    })
  })

  describe('Kobold', () => {
    test('deploy a troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Kobold'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Kobold')
      const request3 = t.choose(game, request2, 'Deploy a troop')
      const request4 = t.choose(game, request3, 'ched-llace a')

      t.testBoard(game, {
        dennis: {
          discard: ['Kobold'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
      })
    })

    test('assassinate a white troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Kobold'],
        },

        // Put a non-white troop into play that would be valid if this command weren't white-only
        'ched-llace a': {
          troops: ['micah'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Kobold')
      const request3 = t.choose(game, request2, 'Assassinate a white troop')

      t.testBoard(game, {
        dennis: {
          discard: ['Kobold'],
          trophyHall: ['neutral'],
        },
        'araum-ched': {
          troops: [],
        },
        'ched-llace a': {
          troops: ['micah'],
        }
      })
    })
  })

  describe('White Wyrmling', () => {
    test('deploy 2 troops', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['White Wyrmling'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.White Wyrmling')
      const request3 = t.choose(game, request2, 'ched-llace a')
      const request4 = t.choose(game, request3, 'Ched Nasad')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['White Wyrmling'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis']
        },
      })
    })

    test('devour a card in the market', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['White Wyrmling'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.White Wyrmling')
      const request3 = t.choose(game, request2, 'ched-llace a')
      const request4 = t.choose(game, request3, 'Ched Nasad')
      const request5 = t.choose(game, request4, 'Advocate')

      t.testBoard(game, {
        dennis: {
          discard: ['White Wyrmling'],
        },
        devoured: ['Advocate'],
        'ched-llace a': {
          troops: ['dennis'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis']
        },
      })
    })
  })

  describe('Black Wyrmling', () => {
    test('+1 influence; assassinate a white troop', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Black Wyrmling'],
        },

        // Put a non-white troop into play that would be valid if this command weren't white-only
        'ched-llace a': {
          troops: ['micah'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Black Wyrmling')

      t.testBoard(game, {
        dennis: {
          discard: ['Black Wyrmling'],
          trophyHall: ['neutral'],
          influence: 1,
        },
        'araum-ched': {
          troops: [],
        },
        'ched-llace a': {
          troops: ['micah'],
        }
      })
    })
  })

  describe('White Dragon', () => {
    test('deploy 3 troops; gain influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['White Dragon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.White Dragon')
      const request3 = t.choose(game, request2, 'ched-llace a')
      const request4 = t.choose(game, request3, 'Ched Nasad')
      const request5 = t.choose(game, request4, 'ched-llace b')

      t.testBoard(game, {
        dennis: {
          discard: ['White Dragon'],
        },
        'ched-llace a': {
          troops: ['dennis'],
        },
        'ched-llace b': {
          troops: ['dennis'],
        },
        'Ched Nasad': {
          troops: ['dennis', 'dennis']
        },
      })
    })

    test('gain points', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['White Dragon'],
        },

        // Sites player controls
        'Chasmleap Bridge': {
          troops: ['dennis'],
        },
        'Everfire': {
          troops: ['dennis'],
        },
        'Kamaglym': {
          troops: ['dennis'],
        },
        'Llacerellyn': {
          troops: ['dennis', 'dennis'],
        },

        // Don't have control, but have some dudes there.
        'Halls of the Scourged Legion': {
          troops: ['neutral', 'dennis'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.White Dragon')
      const request3 = t.choose(game, request2, 'ched-llace a')
      const request4 = t.choose(game, request3, 'Ched Nasad')
      const request5 = t.choose(game, request4, 'ched-llace b')

      t.testBoard(game, {
        dennis: {
          discard: ['White Dragon'],
          points: 2,
        },
      })
    })

  })

  describe('Black Dragon', () => {
    test('supplant a white troop anywhere on the board', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Black Dragon'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Black Dragon')

      t.deepLog(request2)
      const request3 = t.choose(game, request2, 'Tsenviilyq, neutral')


      t.testBoard(game, {
        dennis: {
          discard: ['Black Dragon'],
          trophyHall: ['neutral'],
        },
        'Tsenviilyq': {
          troops: ['dennis', 'neutral', 'neutral'],
          spies: []
        }
      })
    })

    test('Gain 1 VP for every 3 white troops in your trophy hall', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Black Dragon'],
          trophyHall: ['neutral', 'neutral', 'neutral', 'neutral', 'micah', 'micah', 'micah']
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Black Dragon')
      const request3 = t.choose(game, request2, 'Tsenviilyq, neutral')

      t.testBoard(game, {
        dennis: {
          discard: ['Black Dragon'],
          trophyHall: ['neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'troop-micah', 'troop-micah', 'troop-micah'],
          points: 1,
        },
        'Tsenviilyq': {
          troops: ['dennis', 'neutral', 'neutral'],
          spies: []
        }
      })
    })
  })

  describe('Watcher of Thay', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Watcher of Thay'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Watcher of Thay')
      const request3 = t.choose(game, request2, 'Place a spy')
      const request4 = t.choose(game, request3, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          discard: ['Watcher of Thay'],
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: ['dennis'],
        },
      })
    })

    test('return one of your spies > +3 influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Watcher of Thay'],
        },
        Menzoberranzan: {
          spies: ['dennis'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Watcher of Thay')
      const request3 = t.choose(game, request2, "Return one of your spies > +3 influence")

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Watcher of Thay'],
          influence: 3,
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: [],
        },
      })
    })
  })

  describe('Enchanter of Thay', () => {
    test('place a spy', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Enchanter of Thay'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Enchanter of Thay')
      const request3 = t.choose(game, request2, 'Place a spy')
      const request4 = t.choose(game, request3, 'Menzoberranzan')

      t.testBoard(game, {
        dennis: {
          discard: ['Enchanter of Thay'],
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: ['dennis'],
        },
      })
    })

    test('return one of your spies > +4 power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Enchanter of Thay'],
        },
        Menzoberranzan: {
          spies: ['dennis'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Enchanter of Thay')
      const request3 = t.choose(game, request2, "Return one of your spies > +4 power")

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Enchanter of Thay'],
          power: 4,
        },
        'Menzoberranzan': {
          troops: ['neutral', 'neutral', 'neutral'],
          spies: [],
        },
      })
    })

  })
})