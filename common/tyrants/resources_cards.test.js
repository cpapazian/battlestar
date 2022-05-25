Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Tyrants Cards', () => {

  describe('Core', () => {

    test('House Guard', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['House Guard'],
        }
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.House Guard')

      expect(t.dennis(game).power).toBe(2)
    })

    test('Priestess of Lolth', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Priestess of Lolth'],
        }
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Priestess of Lolth')

      expect(t.dennis(game).influence).toBe(2)
    })

  })
})
