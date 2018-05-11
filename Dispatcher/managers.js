const { docker } = require('./utils')

const parseEnv = env => {
  return env
    .map(v => v.split('='))
    .map(([key, value]) => ({ key, value }))
}

const getManagers = (id = null) => {
  const lookup = 'app/manager'
  const filters = id ? `{"id":["${id}"]}` : '{}'

  return new Promise(async resolve => {
    const data = await docker('GET', `/v1.33/containers/json?filters=${filters}`)

    const managers = data
      .filter(container => container.Image.indexOf(lookup) > -1)
      .map(({ Id: id, Image: image }) => ({ id, image }))
      .map(async container => {
        const { id } = container
        const { Image: image, Config: { Env: env } } = await docker('GET', `/v1.33/containers/${id}/json`)
        const region = parseEnv(env)
          .filter(region => region.key === 'REGION' || region.key === 'VIRTUAL_HOST')

        return { id, image, region }
      })

    Promise
      .all(managers)
      .then(data => resolve(data))
  })
}


const getNearestRegion = (services, input) => {
  return regions
    .filter(({ name }) => services.indexOf(name) > -1)
    .map(region => {
      const { latitude, longitude } = region
      const distance = geolib.getDistance(input, { latitude, longitude })

      return { ...region, distance }
    })
    .reduce((prev, current) => {
      return prev.distance < current.distance ? prev : current
    })
}

module.exports = { getManagers, getNearestRegion }
