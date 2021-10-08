const bsg = require('./main.js')
const transitions = require('./transitions.js')


function gameFixture() {
  const lobby = {
    game: 'BattleStar Galactica',
    name: 'Test Lobby',
    options: {
      expansions: ['base game']
    },
    users: [
      { _id: 0, name: 'dennis' },
      { _id: 1, name: 'micah' },
      { _id: 2, name: 'scott' },
    ],
  }

  // Create a new game
  const state = bsg.factory(lobby)
  const game = new bsg.Game()
  game.load(transitions, state, lobby.users[0])

  // Sort the players so they are consistent for testing
  game.state.players.sort((l, r) => l._id - r._id)

  return game
}


describe('new game', () => {
  test("waits at character selection", () => {
    const game = gameFixture()
    game.run()

    const stackNames = game.sm.stack.map(x => x.name)
    expect(stackNames).toStrictEqual([
      'root',
      'setup',
      'character-selection',
      'character-selection-do',
    ])
    expect(game.getWaiting()).toStrictEqual({
      name: 'dennis',
      actions: [
        {
          name: 'Select Character',
          options: [
            '"Chief" Galen Tyrol',
            'Gaius Baltar',
            'Kara "Starbuck" Thrace',
            'Karl "Helo" Agathon',
            'Laura Roslin',
            'Lee "Apollo" Adama',
            'Saul Tigh',
            'Sharon "Boomer" Valerii',
            'Tom Zarek',
            'William Adama',
          ],
        },
      ]
    })
  })
})
