import 'dotenv/config'

import fastify from 'fastify'

import { usersRoutes } from './routes/users.js'
import { assetsRoutes } from './routes/assets.js'

const app = fastify({ logger: true })

app.register(usersRoutes)
app.register(assetsRoutes)

async function start() {
    try {
        await app.listen({ port: 3000 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()