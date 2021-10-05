'use strict'


function StateMachine(state, transitions) {
  _validateTransitions(transitions)

  if (!state.sm) {
    state.sm = {
      stack: [],
      waiting: null,
    }
  }

  this.transitions = transitions
  this.state = state
  this.stack = this.state.sm.stack
  this.waiting = this.state.sm.waiting
}

export default StateMachine


StateMachine.prototype.run = run


function run() {
  // Initialize, if needed
  if (this.stack.length === 0) {
    _push.call(this, 'root')
  }

  const event = this.stack[this.stack.length - 1]

  // This is the sentinel value to show that the state machine has reached a
  // terminal state.
  if (event.name === 'END') {
    return
  }

  const context = {
    done: _done.bind(this),
    push: _push.bind(this),
    wait: _wait.bind(this),
    data: event.data,
  }

  const transition = this.transitions[event.name]

  // If there is an evaluation function, call it.
  if (transition.func) {
    return transition.func(context, this.state)
  }

  // Otherwise, advance through the steps of event.
  else {
    const nextStep = event.data.steps.shift()
    if (nextStep) {
      return context.push(nextStep)
    }
    else {
      return context.done()
    }
  }
}

function _done() {
  const event = this.stack.pop()
  // console.log('done', event)
  this.waiting = null
  this.run()
}

function _push(eventName, data) {
  // console.log('push', eventName)
  this.waiting = null

  const event = {
    name: eventName,
    data: data || {},
  }

  if (eventName === 'END') {
    this.stack.push(event)
    return
  }

  const transition = this.transitions[eventName]
  if (transition.steps) {
    event.data.steps = [...transition.steps]
  }

  this.stack.push(event)
  this.run()
}

function _wait(payload) {
  // console.log('wait', payload)
  this.waiting = payload
}

class InvalidTransitionError extends Error {
  constructor(...params) {
    // Pass arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.name = 'InvalidTransitionError'
  }
}

function _assertTransition(test, message) {
  if (!test) {
    throw new InvalidTransitionError(message)
  }
}

function _validateTransitions(transitions) {
  _assertTransition(
    transitions.hasOwnProperty('root'),
    'No root transition'
  )

  for (const [name, data] of Object.entries(transitions)) {
    _assertTransition(
      data.func || data.steps,
      `Transition ${name} has none of [func, steps]`
    )

    if (data.steps) {
      _assertTransition(
        Array.isArray(data.steps),
        `${name}.steps is not an array`,
      )

      _assertTransition(
        data.steps.length > 0,
        `${name}.steps is empty`
      )

      for (const step of data.steps) {
        _assertTransition(
          typeof step === 'string',
          `${name}.steps contained a non-string step`,
        )
      }
    }

    if (data.func) {
      _assertTransition(
        typeof data.func === 'function',
        `${name}.func is not a function`
      )
    }
  }
}