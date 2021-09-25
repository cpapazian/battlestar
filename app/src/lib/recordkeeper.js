export default function RecordKeeper(state) {
  this.state = state
  this.diffs = []
  this.undone = []
}

// Given a path, return the value at that path in this.state
RecordKeeper.prototype.at = at

// Give an object, return the path to it in this.state
RecordKeeper.prototype.path = path

RecordKeeper.prototype.patch = patch
RecordKeeper.prototype.reverse = reverse

RecordKeeper.prototype.put = put
RecordKeeper.prototype.replace = replace
RecordKeeper.prototype.splice = splice

RecordKeeper.prototype.redo = redo
RecordKeeper.prototype.undo = undo


function undo() {
  const diff = this.diffs.pop()
  this.undone.push(diff)
  this.reverse(diff)
  this.diffs.pop() // Remove the reversed diff from the history
}

function redo() {
  const diff = this.undone.pop()
  this.patch(diff)
}

function patch(diff) {
  this.diffs.push(diff)

  const target = this.at(diff.path)

  // Ensure the current value matches the `old` valud from the diff
  if (diff.kind === 'put') {
    if (JSON.stringify(target[diff.key]) !== JSON.stringify(diff.old)) {
      console.log({
        target: target,
        diff: JSON.parse(JSON.stringify(diff)),
      })
      throw `Can't patch because old doesn't match: ${diff.path}.${diff.key} !== ${diff.old}`
    }

    target[diff.key] = diff.new
  }

  else if (diff.kind === 'splice') {
    if (!Array.isArray(target)) {
      throw `${diff.path} is not an array`
    }

    target.splice(diff.key, diff.old.length, ...diff.new)
  }

  else {
    throw `Unknown diff kind: ${diff.kind}`
  }
}

function reverse(diff) {
  const reversed = {...diff}
  reversed.old = diff.new
  reversed.new = diff.old
  this.patch(reversed)
}

function put(object, key, value) {
  this.patch({
    kind: 'put',
    path: this.path(object),
    key: key,
    old: object[key],
    new: value,
  })
}

// Similar to put, but instead of setting .path[key] = value, set .path-1[objectName] = value
function replace(object, value) {
  const fullPath = this.path(object)

  let key
  let path
  if (fullPath.endsWith(']')) {
    const pathTokens = fullPath.split('[')
    key = parseInt(pathTokens.pop())
    path = pathTokens.join('[')
  }
  else {
    const pathTokens = fullPath.split('.')
    key = pathTokens.pop()
    path = pathTokens.join('.')
  }

  this.put(
    this.at(path),
    key,
    value,
  )
}

function splice(array, index, count, ...items) {
  this.patch({
    kind: 'splice',
    path: this.path(array),
    key: index,
    old: array.slice(index, index + count),
    new: items,
  })
}

function at(path) {
  if (path.startsWith('.')) {
    path = path.slice(1)
  }

  if (path === '') {
    return this.state
  }

  const tokens = path.split('.')

  let pos = this.state
  for (const token of tokens) {
    if (token.endsWith(']')) {
      const pieces = token.split('[')
      const key = pieces[0]
      pos = pos[key]

      for (let i = 1; i < pieces.length; i++) {
        const index = pieces[i].substr(0, pieces[i].length - 1)
        pos = pos[index]
      }
    }
    else {
      pos = pos[token]
    }
  }

  return pos
}

function path(target) {
  if (typeof target !== 'object' || target === null) {
    throw `Invalid path target. Can only path objects and arrays. Got ${typeof target}: ${target}`
  }

  const result = _pathRecursive(target, this.state, '')
  if (!result) {
    throw `Target not found: ${target}`
  }
  return result
}

function _pathRecursive(target, root, pathAccumulator) {
  if (root === target) {
    return pathAccumulator || '.'
  }
  else if (Array.isArray(root)) {
    for (let i = 0; i < root.length; i++) {
      const result = _pathRecursive(target, root[i], pathAccumulator + `[${i}]`)
      if (result) {
        return result
      }
    }
  }
  else if (typeof root === 'object') {
    for (const key of Object.keys(root)) {
      const result = _pathRecursive(target, root[key], pathAccumulator + '.' + key)
      if (result) {
        return result
      }
    }
  }
  else {
    return false
  }
}
