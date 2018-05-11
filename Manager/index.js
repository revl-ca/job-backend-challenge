const { app, async, validate } = require('ngine-node')
const { name, version } = require('./package')

const api = require('./swagger.json')
const Joi = require('joi')
const sqlite3 = require('sqlite3')
const uuid = require('uuid/v1')
const bodyparser = require('body-parser');
const models = require('./models')

const PORT = 8080

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

app.get('/health', (_, res) => res.send(`[${name}][v${version}] is alive!`))
app.get('/swagger.json', (_, res) => res.json(api))

const create = {
  body: {
    device_id: Joi.string()
  }
}

app.post('/parties', validate(create), async(async (req, res) => {
  const { device_id } = req.body
  const party_code = uuid()

  // Can we find the device_id in other party?
  const found = await models.participant.find({ where: { device_id, party_code: { $notIn: [party_code] }, is_leader: 1 } })

  if (found) {
    const all = await models.participant.findAll({ where: { party_code: found.party_code, device_id: { $notIn: [device_id] } } })

    if (all.length > 1) {
      // Promote another device_id to be leader
      all[0].updateAttributes({ is_leader: 1 })
    } else {
      // The party is empty? Get rid of it
      await models.party.destroy({ where: { party_code: found.party_code } })
    }
  } else {
    // Remove the device_id from any other party
    await models.participant.destroy({ where: { device_id, party_code: { $notIn: [party_code] } } })
  }

  // Create the party
  await models.party.create({ party_code })
  // Join the participant list as leader
  const success = await models.participant.create({ device_id, party_code, is_leader: 1 })

  res.json({ success, party_code, device_id })
}))

// Get all nearby parties
app.get('/parties', async(async (req, res) => {
  const parties = await models.party.findAll()

  res.json({ parties })
}))

// Participants listing
const query = {
  params: {
    party_code: Joi.string().required()
  }
}

app.get('/parties/:party_code/participants', validate(query), async(async (req, res) => {
  const { party_code } = req.params

  const participants = await models.participant.findAll({ where: { party_code } })

  res.json({ participants })
}))

// Join a party
const join = {
  body: {
    device_id: Joi.string().required()
  },
  params: {
    party_code: Joi.string().required()
  }
}

app.post('/parties/:party_code/participants', validate(join), async(async (req, res) => {
  const { device_id } = req.body
  const { party_code } = req.params

  try {
    await models.participant.create({ device_id, party_code, is_leader: 0 })

    res.json({ success: true, party_code, device_id })
  } catch(e) {
    res.status(405).json({ success: false, error: e })
  }
}))

// Leaving the party
const leaving = {
  params: {
    party_code: Joi.string().required(),
    device_id: Joi.string().required()
  }
}

app.delete('/parties/:party_code/participants/:device_id', validate(leaving), async(async (req, res) => {
  const { party_code, device_id } = req.params

  // Is device_id a leader?
  const found = await models.participant.find({ where: { device_id, party_code, is_leader: 1 } })

  if (found) {
    const all = await models.participant.findAll({ where: { party_code: found.party_code, device_id: { $notIn: [device_id] } } })

    if (all.length >= 1) {
      // Promote another device_id to be leader
      all[0].updateAttributes({ is_leader: 1 })
    } else {
      // The party is empty? Get rid of it
      await models.party.destroy({ where: { party_code: found.party_code } })
    }
  } else {
    // Remove the device_id from any other party
    await models.participant.destroy({ where: { device_id, party_code: { $notIn: [party_code] } } })
  }

  const success = await models.participant.destroy({ where: { device_id, party_code } })

  res.json({ success })
}))

app.use((err, req, res, next) => {
  if (err.isBoom) return res.status(500).json(err.output.payload)
})

app.listen(PORT, () => {
  console.log(`[${name}][v${version}] Listening on port ${PORT}`)
})
