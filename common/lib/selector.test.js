const { validate } = require('./selector.js')

test('names must match', () => {
  const selector = {
    name: 'test',
    options: ['one', 'two']
  }
  expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
  expect(validate(selector, { name: 'foo', option: ['one'] }).valid).toBe(false)
})

test('string options', () => {
  const selector = {
    name: 'test',
    options: ['one', 'two']
  }
  expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
  expect(validate(selector, { name: 'test', option: ['two'] }).valid).toBe(true)
  expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
  expect(validate(selector, { name: 'test', option: ['foo'] }).valid).toBe(false)
  expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
})

describe('non-nested object options', () => {
  const selector = {
    name: 'test',
    options: [
      { name: 'one' },
      { name: 'two' },
    ]
  }

  test('string selections', () => {
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['two'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['foo'] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('object selections', () => {
    expect(validate(selector, { name: 'test', option: [{ name: 'one' }] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: [{ name: 'two' }] }).valid).toBe(true)
  })
})

describe('nested options', () => {

})

describe('count', () => {
  const selector = {
    name: 'test',
    count: 2,
    options: ['one', 'two', 'three']
  }

  test('not enough selections', () => {
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['foo'] }).valid).toBe(false)
  })

  test('too many selections', () => {
    expect(validate(selector, { name: 'test', option: ['one', 'two', 'three'] }).valid).toBe(false)

  })

  test('correct number', () => {
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(true)
  })

  test('correct number, but duplicates', () => {
    expect(validate(selector, { name: 'test', option: ['one', 'one'] }).valid).toBe(false)
  })

  test('order does not matter', () => {
    expect(validate(selector, { name: 'test', option: ['three', 'two'] }).valid).toBe(true)
  })
})

describe('min and max', () => {

  test('neither', () => {
    const selector = {
      name: 'test',
      options: ['one', 'two', 'three']
    }

    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('min0, max1', () => {
    const selector = {
      name: 'test',
      min: 0,
      max: 1,
      options: ['one', 'two', 'three']
    }

    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('max1', () => {
    const selector = {
      name: 'test',
      max: 1,
      options: ['one', 'two', 'three']
    }

    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('min1', () => {
    const selector = {
      name: 'test',
      min: 1,
      options: ['one', 'two', 'three']
    }

    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two', 'three'] }).valid).toBe(true)
  })

})

describe('extra', () => {
  const selector = {
    name: 'test',
    options: [
      'one',
      'two',
      {
        name: 'extra',
        extra: true
      },
    ],
  }

  test('no extra selected', () => {
    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(false)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(false)
  })

  test('extra does not count toward required count', () => {
    expect(validate(selector, { name: 'test', option: ['extra'] }).valid).toBe(false)
  })

  test('extra does not count against required count', () => {
    expect(validate(selector, { name: 'test', option: ['one', 'extra'] }).valid).toBe(true)
  })
})

describe('exclusive', () => {
  const selector = {
    name: 'test',
    max: 2,
    options: [
      'one',
      'two',
      {
        name: 'exclusive',
        exclusive: true
      },
    ],
  }

  test('Cannot mix with other options', () => {
    expect(validate(selector, { name: 'test', option: [] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'two'] }).valid).toBe(true)

    expect(validate(selector, { name: 'test', option: ['exclusive'] }).valid).toBe(true)
    expect(validate(selector, { name: 'test', option: ['one', 'exclusive'] }).valid).toBe(false)
  })
})


/*
 * {
 *   "name": "Skill Check - Discuss",
 *   "options": [
 *     {
 *       "name": "How much can you help?",
 *       "options": [
 *         "none",
 *         "a little",
 *         "some",
 *         "a lot"
 *       ]
 *     },
 *     {
 *       "name": "Use Investigative Committee",
 *       "description": "All cards will be played face up during this skill check",
 *       "extra": true
 *     },
 *     {
 *       "name": "Use Scientific Research",
 *       "description": "All engineering (blue) cards will be positive for this check",
 *       "extra": true
 *     },
 *     {
 *       "name": "Start Skill Check",
 *       "description": "Begin the skill check even though not everyone has answered yet",
 *       "extra": true
 *     }
 *   ]
 * } */
