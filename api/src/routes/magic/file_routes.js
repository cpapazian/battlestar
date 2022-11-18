const db = require('../../models/db.js')

const File = {}

File.create = async function(req, res) {
  const fileId = await db.magic[req.body.kind].create(req.body)
  res.json({
    status: 'success',
    fileId,
  })
}

File.delete = async function(req, res) {
  await db.magic[req.body.kind].delete(req.body.fileId)
  res.json({
    status: 'success',
  })
}

File.duplicate = async function(req, res) {
  console.log('duplicate', req.body)
  await db.magic[req.body.kind].duplicate(req.body.fileId)
  console.log('duplicate', 1)
  res.json({
    status: 'success',
  })
}

File.update = async function(req, res) {
  const file = req.body.file

  if (!file._id) {
    throw new Error('Cannot update file with no _id field: ' + JSON.stringify(file, null, 2))
  }

  if (!['card', 'cube', 'deck'].includes(file.kind)) {
    throw new Error('Cannot update unknown file kind: ' + JSON.stringify(file, null, 2))
  }

  await db.magic[file.kind].save(file)
  res.json({
    status: 'success',
  })
}


module.exports = File
