const { app, async, validate } = require('ngine-node')
const { docker } = require('./utils')
const { getManagers, getNearestRegion } = require('./managers')
const { name, version } = require('./package')

const { regions } = require('./regions')
const api = require('./swagger.json')
const Joi = require('joi')
const geolib = require('geolib')

const PORT = 8080

let services = []

app.get('/health', (_, res) => res.send(`[${name}][v${version}] is alive!`))
app.get('/swagger.json', (_, res) => res.json(api))

const find = {
  query: {
    lat: Joi.number().min(0).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }
}

app.get('/managers/find', validate(find), (req, res) => {
  const { lat, lng } = req.query

  if (!services.length) return res.status(404).send('Resource not found')

  // Get regions from running managers
  const regions = services
    .map(({ region }) => region)
    .reduce((a, b) => [...a, ...b], [])
    .filter(({ key }) => key === 'REGION')
    .map(({ value }) => value)

  // Get the nearest region
  const region = getNearestRegion(regions, { latitude: lat, longitude: lng })

  // Extract the VHOST of the nearest manager
  const service = services
    .map(({ region }) => region)
    .filter(data => {
  	  return data.filter(f => f.value === region.name).length > 0
    })
    .reduce((a, b) => [...a, ...b], [])
    .filter(data => data.key === 'VIRTUAL_HOST')
    .map(({ value }) => value)

  res.send(service[0])
})

app.use((err, req, res, next) => {
  if (err.isBoom) return res.status(500).json(err.output.payload)
})

app.listen(PORT, async () => {
  console.log(`[${name}][v${version}] Listening on port ${PORT}`)

  services = await getManagers()

  docker('GET', `/v1.33/events?filters={"event":["start","stop"]}`, true)
    .on('data', async () => services = await getManagers())
})
