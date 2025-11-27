// Tarot Journal client-side logic

let cardSearch, cardsList, positionContainer, cardPosition, selectedTags, spreadSelect, entryDate, notes, saveEntry, clearForm, addCardBtn
const calendarContainer = document.querySelector('#calendarContainer')
const formView = document.querySelector('#formView')
const detailView = document.querySelector('#detailView')

// Local storage key
const STORAGE_KEY = 'tarot-journal-entries'

// List of tarot cards from the provided JSON
const tarotCards = [
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Fortitude",
  "The Hermit",
  "Wheel Of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "The Last Judgment",
  "The Fool",
  "The World",
  "Page of Wands",
  "Knight of Wands",
  "Queen of Wands",
  "King of Wands",
  "Ace of Wands",
  "Two of Wands",
  "Three of Wands",
  "Four of Wands",
  "Five of Wands",
  "Six of Wands",
  "Seven of Wands",
  "Eight of Wands",
  "Nine of Wands",
  "Ten of Wands",
  "Page of Cups",
  "Knight of Cups",
  "Queen of Cups",
  "King of Cups",
  "Ace of Cups",
  "Two of Cups",
  "Three of Cups",
  "Four of Cups",
  "Five of Cups",
  "Six of Cups",
  "Seven of Cups",
  "Eight of Cups",
  "Nine of Cups",
  "Ten of Cups",
  "Page of Pentacles",
  "Knight of Pentacles",
  "Queen of Pentacles",
  "King of Pentacles",
  "Ace of Pentacles",
  "Two of Pentacles",
  "Three of Pentacles",
  "Four of Pentacles",
  "Five of Pentacles",
  "Six of Pentacles",
  "Seven of Pentacles",
  "Eight of Pentacles",
  "Nine of Pentacles",
  "Ten of Pentacles",
  "Page of Swords",
  "Knight of Swords",
  "Queen of Swords",
  "King of Swords",
  "Ace of Swords",
  "Two of Swords",
  "Three of Swords",
  "Four of Swords",
  "Five of Swords",
  "Six of Swords",
  "Seven of Swords",
  "Eight of Swords",
  "Nine of Swords",
  "Ten of Swords"
]

let selectedCards = [] // { name, position }
let currentView = 'form' // 'form' or 'detail'
let currentDetailEntry = null

// Initialize function
function init() {
  console.log('Initializing app...')
  
  // Select all form elements
  cardSearch = document.querySelector('#cardSearch')
  cardsList = document.querySelector('#cardsList')
  positionContainer = document.querySelector('#positionContainer')
  cardPosition = document.querySelector('#cardPosition')
  selectedTags = document.querySelector('#selectedTags')
  spreadSelect = document.querySelector('#spreadSelect')
  entryDate = document.querySelector('#entryDate')
  notes = document.querySelector('#notes')
  saveEntry = document.querySelector('#saveEntry')
  clearForm = document.querySelector('#clearForm')
  addCardBtn = document.querySelector('#addCardBtn')
  
  console.log('Elements found:', { cardSearch, calendarContainer, saveEntry })
  
  // Populate datalist
  tarotCards.forEach(card => {
    const option = document.createElement('option')
    option.value = card
    cardsList.appendChild(option)
  })
  
  console.log('Setting up event listeners...')
  setupEventListeners()
  
  console.log('Rendering tags...')
  renderTags()
  
  console.log('Rendering calendar...')
  renderCalendar()
}

// Set up all event listeners
function setupEventListeners() {
  // Save entry handler
  saveEntry.addEventListener('click', async (e) => {
  e.preventDefault()
  console.log('Save button clicked')
  console.log('Selected cards:', selectedCards)
  if (selectedCards.length === 0) return alert('Add at least one card to the reading.')
  
  // Convert date string to ISO-8601 DateTime for Prisma
  const dateStr = entryDate.value || new Date().toISOString().substring(0, 10)
  const dateTime = new Date(dateStr + 'T00:00:00.000Z').toISOString()
  
  const entry = {
    cards: selectedCards.slice(),
    spread: spreadSelect.options[spreadSelect.selectedIndex].text,
    spreadValue: spreadSelect.value,
    date: dateTime,
    notes: notes.value
  }
  
  console.log('Saving entry:', entry)
  const result = await saveEntryToDatabase(entry)
  console.log('Save result:', result)
  if (result) {
    // reset form
    selectedCards = []
    renderTags()
    spreadSelect.value = 'single'
    entryDate.value = ''
    notes.value = ''
    await renderCalendar()
    alert('Entry saved to database!')
  } else {
    alert('Failed to save entry. Check console for errors.')
  }
})

  // Clear form handler
  clearForm.addEventListener('click', () => {
    selectedCards = []
    renderTags()
    spreadSelect.value = 'single'
    entryDate.value = ''
    notes.value = ''
  })
  
  // Card search change handler
  cardSearch.addEventListener('change', (e) => {
    const val = e.target.value.trim()
    if (!val) return
    const found = tarotCards.find(c => c.toLowerCase() === val.toLowerCase())
    if (found) {
      showPositionSelector()
      cardPosition.focus()
    } else {
      alert('Card not found. Try selecting from the list.')
    }
  })
  
  // Add card button handler
  addCardBtn.addEventListener('click', () => {
    const name = cardSearch.value.trim()
    const pos = cardPosition.value
    if (!name) return
    selectedCards.push({ name, position: pos })
    renderTags()
    cardSearch.value = ''
    cardPosition.value = 'upright'
    hidePositionSelector()
  })
  
  // Allow Enter on search
  cardSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = cardSearch.value.trim()
      const found = tarotCards.find(c => c.toLowerCase() === val.toLowerCase())
      if (found) {
        showPositionSelector()
        cardPosition.focus()
      } else {
        alert('Card not found. Please choose a card from the suggestions.')
      }
    }
  })
}


function showPositionSelector() {
  positionContainer.style.display = 'block'
}

function hidePositionSelector() {
  positionContainer.style.display = 'none'
}

function renderTags() {
  selectedTags.innerHTML = ''
  selectedCards.forEach((c, idx) => {
    const chip = document.createElement('span')
    chip.className = 'tag'
    chip.textContent = `${c.name} (${c.position})`
    const removeBtn = document.createElement('button')
    removeBtn.className = 'tag-remove'
    removeBtn.textContent = '×'
    removeBtn.addEventListener('click', () => {
      selectedCards.splice(idx, 1)
      renderTags()
    })
    chip.appendChild(removeBtn)
    selectedTags.appendChild(chip)
  })
}

// Load entries from MongoDB via API
async function loadEntries() {
  try {
    const response = await fetch('/data')
    if (response.ok) {
      const entries = await response.json()
      return entries
    } else {
      console.error('Failed to load entries from server')
      return []
    }
  } catch (err) {
    console.error('Failed to load entries', err)
    return []
  }
}

// Save entry to MongoDB via API
async function saveEntryToDatabase(entry) {
  try {
    const response = await fetch('/data', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error:', errorData)
      alert(errorData.error || 'Failed to save entry')
      return null
    }
    
    const result = await response.json()
    return result
  } catch (err) {
    console.error('Save error:', err)
    alert('An error occurred while saving')
    return null
  }
}

// Delete entry from MongoDB via API
async function deleteEntry(id) {
  try {
    const response = await fetch(`/data/${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      alert(errorData.error || 'Failed to delete entry')
      return false
    }
    
    return true
  } catch (err) {
    console.error('Delete error:', err)
    alert('An error occurred while deleting')
    return false
  }
}

// Get entries by date (YYYY-MM-DD format)
async function getEntriesByDate(dateStr) {
  const entries = await loadEntries()
  return entries.filter(e => {
    const entryDate = new Date(e.date).toISOString().substring(0, 10)
    return entryDate === dateStr
  })
}

// Render calendar for the current month
async function renderCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay() // 0=Sunday
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  
  let html = `<div class="calendar-header">${monthNames[month]} ${year}</div>`
  html += `<div class="calendar-grid">`
  html += `<div class="calendar-day-name">Sun</div>`
  html += `<div class="calendar-day-name">Mon</div>`
  html += `<div class="calendar-day-name">Tue</div>`
  html += `<div class="calendar-day-name">Wed</div>`
  html += `<div class="calendar-day-name">Thu</div>`
  html += `<div class="calendar-day-name">Fri</div>`
  html += `<div class="calendar-day-name">Sat</div>`
  
  // Empty cells before the first day
  for (let i = 0; i < startDayOfWeek; i++) {
    html += `<div class="calendar-day empty"></div>`
  }
  
  // Days of the month
  const entries = await loadEntries()
  const todayStr = new Date().toISOString().substring(0, 10)
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    // Check if any entry has this date (comparing just the date portion)
    const hasEntry = entries.some(e => {
      const entryDate = new Date(e.date).toISOString().substring(0, 10)
      return entryDate === dateStr
    })
    
    let className = hasEntry ? 'calendar-day has-entry' : 'calendar-day'
    if (dateStr === todayStr) className += ' today'
    
    html += `<div class="${className}" data-date="${dateStr}">${day}</div>`
  }
  
  html += `</div>`
  calendarContainer.innerHTML = html
  
  // Add click handlers to calendar days
  document.querySelectorAll('.calendar-day[data-date]').forEach(dayEl => {
    dayEl.addEventListener('click', async () => {
      // Remove selected class from all days
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'))
      // Add selected class to clicked day
      dayEl.classList.add('selected')
      
      const dateStr = dayEl.getAttribute('data-date')
      const dayEntries = await getEntriesByDate(dateStr)
      if (dayEntries.length > 0) {
        showEntryDetail(dayEntries[0])
      }
    })
  })
}

// Show entry detail view
function showEntryDetail(entry) {
  currentView = 'detail'
  currentDetailEntry = entry
  
  const dateObj = new Date(entry.date)
  const dateText = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const tagsHtml = entry.cards.map(c => 
    `<span class="tag static">${c.name} (${c.position})</span>`
  ).join(' ')
  
  detailView.innerHTML = DOMPurify.sanitize(`
    <button id="backToForm" class="back-btn">← Back to Create Entry</button>
    <h2>Entry - ${dateText}</h2>
    
    <h3>You pulled...</h3>
    <div class="tags">${tagsHtml}</div>
    
    <h3>With a card spread of...</h3>
    <div class="detail-spread">${entry.spread}</div>
    
    <h3>Your Journal Notes</h3>
    <div class="detail-notes"><pre>${entry.notes || ''}</pre></div>
    
    <div class="form-actions">
      <button id="editEntry" class="save">Edit Entry</button>
      <button id="deleteEntry" class="delete-btn">Delete Entry</button>
    </div>
  `)
  
  // Toggle views
  formView.style.display = 'none'
  detailView.style.display = 'block'
  
  document.querySelector('#backToForm').addEventListener('click', showFormView)
  document.querySelector('#editEntry').addEventListener('click', () => showEditView(entry))
  document.querySelector('#deleteEntry').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const success = await deleteEntry(entry.id)
      if (success) {
        alert('Entry deleted!')
        showFormView()
        await renderCalendar()
      }
    }
  })
}

// Show form view
function showFormView() {
  currentView = 'form'
  currentDetailEntry = null
  
  // Clear the form
  selectedCards = []
  renderTags()
  spreadSelect.value = 'single'
  entryDate.value = ''
  notes.value = ''
  
  // Toggle views
  formView.style.display = 'block'
  detailView.style.display = 'none'
}

// Show edit view - populate form with existing entry
function showEditView(entry) {
  currentView = 'form'
  currentDetailEntry = entry
  
  // Populate form with existing data
  selectedCards = [...entry.cards]
  renderTags()
  
  // Set spread
  spreadSelect.value = entry.spreadValue || 'single'
  
  // Set date
  const dateStr = new Date(entry.date).toISOString().substring(0, 10)
  entryDate.value = dateStr
  
  // Set notes
  notes.value = entry.notes || ''
  
  // Change save button to update button
  saveEntry.textContent = 'Update Entry'
  saveEntry.onclick = async (e) => {
    e.preventDefault()
    console.log('Update button clicked')
    if (selectedCards.length === 0) return alert('Add at least one card to the reading.')
    
    const dateStr = entryDate.value || new Date().toISOString().substring(0, 10)
    const dateTime = new Date(dateStr + 'T00:00:00.000Z').toISOString()
    
    const updatedEntry = {
      cards: selectedCards.slice(),
      spread: spreadSelect.options[spreadSelect.selectedIndex].text,
      spreadValue: spreadSelect.value,
      date: dateTime,
      notes: notes.value
    }
    
    console.log('Updating entry:', updatedEntry)
    const result = await updateEntry(entry.id, updatedEntry)
    console.log('Update result:', result)
    
    if (result) {
      alert('Entry updated successfully!')
      showFormView()
      await renderCalendar()
      // Reset save button
      saveEntry.textContent = 'Save Entry'
      saveEntry.onclick = null
      init() // Reinitialize to restore original handlers
    } else {
      alert('Failed to update entry. Check console for errors.')
    }
  }
  
  // Toggle views
  formView.style.display = 'block'
  detailView.style.display = 'none'
}

// Update entry in MongoDB via API
async function updateEntry(id, entry) {
  try {
    const response = await fetch(`/data/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error:', errorData)
      alert(errorData.error || 'Failed to update entry')
      return null
    }
    
    const result = await response.json()
    return result
  } catch (err) {
    console.error('Update error:', err)
    alert('An error occurred while updating')
    return null
  }
}

// Call init when DOM is ready
init() 
