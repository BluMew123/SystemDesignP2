const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
<<<<<<< HEAD
  log: ['query', 'error', 'warn'],
=======
  log: ['error'],
>>>>>>> backup-branch
})

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { method } = req
<<<<<<< HEAD
  const id = req.query.id || req.url.split('/').pop()

  console.log('Request:', { method, id, url: req.url, query: req.query })

  try {
    if (method === 'GET') {
      console.log('Fetching all entries...')
      const entries = await prisma.tarotEntry.findMany({
        orderBy: { date: 'desc' }
      })
      console.log(`Found ${entries.length} entries`)
=======
  const id = req.query.id

  try {
    if (method === 'GET') {
      const entries = await prisma.tarotEntry.findMany({
        orderBy: { date: 'desc' }
      })
>>>>>>> backup-branch
      return res.status(200).json(entries)
    }
    
    if (method === 'POST') {
<<<<<<< HEAD
      console.log('Creating entry:', req.body)
=======
>>>>>>> backup-branch
      const { cards, spread, spreadValue, date, notes } = req.body
      
      const entry = await prisma.tarotEntry.create({
        data: {
          cards: cards || [],
          spread: spread || '',
          spreadValue: spreadValue || '',
          date: new Date(date),
          notes: notes || ''
        }
      })
<<<<<<< HEAD
      console.log('Entry created:', entry.id)
=======
>>>>>>> backup-branch
      return res.status(201).json(entry)
    }
    
    if (method === 'PUT' && id) {
<<<<<<< HEAD
      console.log('Updating entry:', id)
=======
>>>>>>> backup-branch
      const { cards, spread, spreadValue, date, notes } = req.body
      
      const entry = await prisma.tarotEntry.update({
        where: { id },
        data: {
          cards,
          spread,
          spreadValue,
          date: new Date(date),
          notes
        }
      })
      return res.status(200).json(entry)
    }
    
    if (method === 'DELETE' && id) {
<<<<<<< HEAD
      console.log('Deleting entry:', id)
=======
>>>>>>> backup-branch
      await prisma.tarotEntry.delete({
        where: { id }
      })
      return res.status(200).json({ success: true, message: 'Entry deleted' })
    }
    
<<<<<<< HEAD
    console.log('Method not allowed:', method)
=======
>>>>>>> backup-branch
    return res.status(405).json({ error: `Method ${method} not allowed` })
    
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
<<<<<<< HEAD
      error: error.message, 
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
=======
      error: error.message
>>>>>>> backup-branch
    })
  }
}
