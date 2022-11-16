const axios = require('axios')
const fs = require('fs')


const rootFields = [
  "id",
  "card_faces",
  "collector_number",
  "legalities",
  "layout",
  "rarity",
  "set",
  "cmc",
]

const faceFields = [
  "artist",
  "flavor_text",
  "id",
  "image_uris",
  "loyalty",
  "mana_cost",
  "name",
  "oracle_text",
  "power",
  "toughness",
  "type_line",

  "color_identity",
  "color_indicator",
  "colors",
  "produced_mana",
]

const wantedFields = [].concat(rootFields, faceFields)


function adjustFaces(card) {
  if (!card.card_faces) {
    card.card_faces = [{}]
  }

  // Move face fields into card_faces.
  for (const face of card.card_faces) {
    for (const key of faceFields) {
      if (card[key] && !face[key]) {
        face[key] = card[key]
      }

      if (card[key]) {
        delete card[key]
      }
    }
  }

  // Remove all other fields
  const toRemove = [...card.card_faces]
  toRemove.push(card)
  for (const face of toRemove) {
    for (const key of Object.keys(face)) {
      if (!wantedFields.includes(key)) {
        delete face[key]
      }
    }
  }

  // Remove face fields from root
  for (const key of Object.keys(card)) {
    if (!rootFields.includes(key)) {
      delete card[key]
    }
  }

  // Duplicate face fields across all faces, if needed
  const firstFace = card.card_faces[0]
  const otherFaces = card.card_faces.slice(1)
  for (const face of otherFaces) {
    for (const [key, value] of Object.entries(firstFace)) {
      if (!(key in face)) {
        face[key] = value
      }
    }
  }
}

function cleanImageUris(card) {
  for (const face of card.card_faces) {
    if (!face.image_uris) {
      console.log(card)
    }
    face.image_uri = face.image_uris.art_crop
    delete face.image_uris
  }
}

function cleanLegalities(card) {
  card.legal = Object
    .keys(card.legalities)
    .filter(key => card.legalities[key] === 'legal')
  delete card.legalities
}

function cleanScryfallCards(cards) {
  for (const card of cards) {
    adjustFaces(card)
    cleanImageUris(card)
    cleanLegalities(card)
  }
}

function filterVersions(cards) {
  for (let i = cards.length - 1; i >= 0; i--) {
    const card = cards[i]

    if (
      card.layout === 'art_series'
      || card.layout === 'vanguard'
      || card.layout === 'double_faced_token'
      || card.layout === 'scheme'
    ) {
      cards.splice(i, 1)
      continue
    }

    if (card.lang !== 'en') {
      cards.splice(i, 1)
      continue
    }
    else {
      delete card.lang
    }

    if (card.digital || card.textless || card.full_art) {
      cards.splice(i, 1)
      continue
    }
    else {
      delete card.digital
      delete card.textless
      delete card.full_art
    }
  }
}

async function fetchScryfallDefaultCards(uri) {
  const result = await axios.get(uri, {
    maxBodyLength: Infinity,
    maxConentLength: Infinity,
    timeout: 0,
  })

  if (result.status !== 200) {
    return {
      status: 'error',
      message: result.statusText,
    }
  }

  return result.data
}

async function fetchScryfallDefaultDataUri() {
  // Get the list of bulk data.
  const result = await axios.get('https://api.scryfall.com/bulk-data')

  if (result.status !== 200) {
    throw new Error('Unable to fetch bulk data list')
  }

  const targetData = result.data.data.find(d => d.type === 'default_cards')

  if (!targetData) {
    throw new Error('Unable to parse default_cards from the bulk data last')
  }

  if (!targetData.download_uri) {
    throw new Error('Unable to parse the download URI for default cards')
  }

  return targetData.download_uri
}

async function fetchFromScryfallAndClean() {
  /* console.log('Fetching latest scryfall data')

   * const downloadUri = await fetchScryfallDefaultDataUri()

   * console.log('...downloading card data from ' + downloadUri)
   * const cards = await fetchScryfallDefaultCards(downloadUri)
   */
  const downloadUri = 'default-cards-20221116100556.json'
  const cardData = fs.readFileSync('local_scryfall.json')
  const cards = JSON.parse(cardData)

  console.log('...filtering')
  filterVersions(cards)

  console.log('...cleaning')
  cleanScryfallCards(cards)

  const outputFilename = 'card_data/' + downloadUri.split('/').slice(-1)[0]

  console.log('...writing data to ' + outputFilename)
  fs.writeFileSync(outputFilename, JSON.stringify(cards, null, 2))

  console.log('...done')
}


////////////////////////////////////////////////////////////////////////////////
// Main

fetchFromScryfallAndClean()
