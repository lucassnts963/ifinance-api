import { pool } from '../config/db.js'

export async function assetsRoutes(fastify, options) {
    fastify.get('/assets', async (request, reply) => {
        try {
            const client = await pool.connect()

            const sql = 'SELECT * FROM assets'

            const { rows } = await client.query(sql)
            client.release()
            return rows             
        } catch (err) {
            throw err
        }
    })

    fastify.get('/assets/:id', async (request, reply) => {
        const { id } = request.params

        try {
            const client = await pool.connect()

            const sql = 'SELECT * FROM assets WHERE id=$1'

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

    fastify.post('/assets', async (request, reply) => {
        const { user_id, description, ticker_symbol, purchase_date, quantity, purchase_price, purchase_currency, notes } = request.body

        try {
            if (!user_id || !description || !ticker_symbol || !purchase_date || !quantity || !purchase_price || !purchase_currency) {
                throw { message: 'Faltou alguma informação!' }
            }

            const client = await pool.connect()

            const sql = 'INSERT INTO assets (user_id, description, ticker_symbol, purchase_date, quantity, purchase_price, purchase_currency, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'

            const { rows } = await client.query(sql, [user_id, description, ticker_symbol, purchase_date, quantity, purchase_price, purchase_currency, notes])

            client.release()

            if (rows[0]) {
                return rows[0]
            }
        } catch (err) {
            throw err
        }
    })

    fastify.put('/assets/:id', async (request, reply) => {
        const { id } = request.params
        const { user_id, ticker_symbol, purchase_date, quantity, purchase_price, purchase_currency, notes } = request.body

        try {
            if (!username || !email) {
                throw { message: 'Faltou alguma informação!' }
            }
    
            const client = await pool.connect()

            const sql = 'UPDATE assets SET user_id = $1, ticker_symbol = $2, purchase_date = $3, quantity = $4, purchase_price = $5, purchase_currency = $6, notes = $7, description = $8 WHERE id = $9 RETURNING *'

            const result = await client.query(
                sql,
                [user_id, ticker_symbol, purchase_date, quantity, purchase_price, purchase_currency, notes, description, id]
            )

            client.release()

            return rows
        } catch (err) {
            throw err
        }

    })

    fastify.delete('/assets/:id', async (request, reply) => {
        const { id } = request.params

        try {
            const client = await pool.connect()

            const sql = 'DELETE FROM assets WHERE id=$1'

            await client.query(sql, [id])

            return { message: `Ativo excluído com sucesso! id [${id}]` }
        } catch (err) {
            throw err
        }
    })
}