const http = require('http')
const EventEmitter = require('events')

const docker = (method, path, stream = false) => {
  if (stream) {
    const emitter = new EventEmitter()

    const client = http.request({ method, path, socketPath: '/var/run/docker.sock' }, res => {
      res.on('data', data => {
        if (res.statusCode === 200) emitter.emit('data', data)
        if (res.statusCode > 200) emitter.emit('error', data)
      })
    }).end()

    return emitter
  }

  return new Promise((resolve, reject) => {
    let body = []

    const client = http.request({ method, path, socketPath: '/var/run/docker.sock' }, res => {
      res.on('data', chunk => body.push(chunk))
      res.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString())
        } catch(e) {
          reject(e)
        }

        resolve(body)
      })
    }).end()
  })
}

module.exports = { docker }
