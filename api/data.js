const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['error'],
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
  const id = req.query.id

  try {
    if (method === 'GET') {
      const entries = await prisma.tarotEntry.findMany({
        orderBy: { date: 'desc' }
      })
      return res.status(200).json(entries)
    }
    
    if (method === 'POST') {
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
      return res.status(201).json(entry)
    }
    
    if (method === 'PUT' && id) {
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
      await prisma.tarotEntry.delete({
        where: { id }
      })
      return res.status(200).json({ success: true, message: 'Entry deleted' })
    }
    
    return res.status(405).json({ error: `Method ${method} not allowed` })
    
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: error.message
    })
  }
}
