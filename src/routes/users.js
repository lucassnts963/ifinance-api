import { pool } from '../config/db.js'
import { hashPassword, checkPassword } from '../utils/hash.js'

export async function usersRoutes(fastify, options) {
    fastify.get('/users', async (request, reply) => {
        try {
            const client = await pool.connect()

            const sql = 'SELECT id, username, email FROM users'

            const { rows } = await client.query(sql)
            client.release()
            return rows             
        } catch (err) {
            throw err
        }
    })

    fastify.get('/users/:id', async (request, reply) => {
        const { id } = request.params

        try {
            const client = await pool.connect()

            const sql = 'SELECT id, username, email FROM users WHERE id=$1'

            const { rows } = await client.query(sql, [ id ])

            if (rows[0]) {
                return rows[0]
            }

            client.release()

            return {}

        } catch (err) {
            throw err
        }
    })

    fastify.post('/users', async (request, reply) => {
        const { username, email, password } = request.body

        try {
            if (!username || !email || !password) {
                throw { message: 'Faltou alguma informação!' }
            }

            const hash = hashPassword(password)

            const client = await pool.connect()

            const sql = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *'

            const { rows } = await client.query(sql, [username, email, hash])

            client.release()

            if (rows[0]) {
                return rows[0]
            }
        } catch (err) {
            throw err
        }
    })

    fastify.put('/users/:id', async (request, reply) => {
        const { id } = request.params
        const { username, email } = request.body

        try {
            if (!username || !email) {
                throw { message: 'Faltou alguma informação!' }
            }
    
            const client = await pool.connect()

            const sql = 'UPDATE users SET username=$1, email=$2 WHERE id=$3 RETURNING id, username, email'

            const { rows } = await client.query(sql, [username, email, id])

            client.release()

            return rows
        } catch (err) {
            throw err
        }

    })

    fastify.delete('/users/:id', async (request, reply) => {
        const { id } = request.params

        try {
            const client = await pool.connect()

            const sql = 'DELETE FROM users WHERE id=$1'

            const result = await client.query(sql, [id])

            return true
        } catch (err) {
            throw err
        }
    })
}