// Below we will use the Express Router to define a series of API endpoints.
// Express will listen for API requests and respond accordingly
import express from 'express'
const router = express.Router()

// Set this to match the model name in your Prisma schema
const model = 'tarotEntry'

// Prisma lets NodeJS communicate with MongoDB
// Let's import and initialize the Prisma client
// See also: https://www.prisma.io/docs
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Connect to the database
prisma.$connect().then(() => {
    console.log('Prisma connected to MongoDB')
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err)
})

// ----- CREATE (POST) -----
// Create a new tarot journal entry
router.post('/data', async (req, res) => {
    try {
        const { id, ...createData } = req.body
        const created = await prisma[model].create({
            data: createData
        })
        res.status(201).send(created)
    } catch (err) {
        console.error('POST /data error:', err)
        res.status(500).send({ error: 'Failed to create record', details: err.message || err })
    }
})

// ----- READ (GET) list ----- 
router.get('/data', async (req, res) => {
    try {
        const result = await prisma[model].findMany({
            take: 100
        })
        res.send(result)
    } catch (err) {
        console.error('GET /data error:', err)
        res.status(500).send({ error: 'Failed to fetch records', details: err.message || err })
    }
})



// ----- UPDATE (PUT) -----
// Update a tarot journal entry
router.put('/data/:id', async (req, res) => {
    try {
        const { id, ...updateData } = req.body
        const updated = await prisma[model].update({
            where: { id: req.params.id },
            data: updateData
        })
        res.send(updated)
    } catch (err) {
        console.error('PUT /data/:id error:', err)
        res.status(500).send({ error: 'Failed to update record', details: err.message || err })
    }
})

// ----- DELETE -----
// Delete a tarot journal entry
router.delete('/data/:id', async (req, res) => {
    try {
        const result = await prisma[model].delete({
            where: { id: req.params.id }
        })
        res.send(result)
    } catch (err) {
        console.error('DELETE /data/:id error:', err)
        res.status(500).send({ error: 'Failed to delete record', details: err.message || err })
    }
})


// export the api routes for use elsewhere in our app 
// (e.g. in index.js )
export default router;

