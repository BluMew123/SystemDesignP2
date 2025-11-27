// Tarot Journal client-side logic

const cardSearch = document.querySelector('#cardSearch')
const cardsList = document.querySelector('#cardsList')
const positionContainer = document.querySelector('#positionContainer')
const cardPosition = document.querySelector('#cardPosition')
const selectedTags = document.querySelector('#selectedTags')
const spreadSelect = document.querySelector('#spreadSelect')
const entryDate = document.querySelector('#entryDate')
const notes = document.querySelector('#notes')
const saveEntry = document.querySelector('#saveEntry')
const clearForm = document.querySelector('#clearForm')
const calendarContainer = document.querySelector('#calendarContainer')
const leftCol = document.querySelector('.left-col')

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

// Populate datalist
tarotCards.forEach(card => {
  const option = document.createElement('option')
  option.value = card
  cardsList.appendChild(option)
})

let selectedCards = [] // { name, position }
let currentView = 'form' // 'form' or 'detail'
let currentDetailDate = null


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

// When user selects a card (via datalist or typed and Enter pressed)
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

// When add card button is clicked
const addCardBtn = document.querySelector('#addCardBtn')
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

// Allow Enter on search to act like selecting
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

// Save reading to localStorage
function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to load entries', err)
    return []
  }
}

function saveEntries(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}

// Get entries by date (YYYY-MM-DD format)
function getEntriesByDate(dateStr) {
  const entries = loadEntries()
  return entries.filter(e => e.date === dateStr)
}

// Render calendar for the current month
function renderCalendar() {
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
  const entries = loadEntries()
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const hasEntry = entries.some(e => e.date === dateStr)
    const className = hasEntry ? 'calendar-day has-entry' : 'calendar-day'
    html += `<div class="${className}" data-date="${dateStr}">${day}</div>`
  }
  
  html += `</div>`
  calendarContainer.innerHTML = html
  
  // Add click handlers to calendar days
  document.querySelectorAll('.calendar-day[data-date]').forEach(dayEl => {
    dayEl.addEventListener('click', () => {
      const dateStr = dayEl.getAttribute('data-date')
      const dayEntries = getEntriesByDate(dateStr)
      if (dayEntries.length > 0) {
        showEntryDetail(dayEntries[0])
      }
    })
  })
}

// Show entry detail view
function showEntryDetail(entry) {
  currentView = 'detail'
  currentDetailDate = entry.date
  
  const dateObj = new Date(entry.date + 'T00:00:00')
  const dateText = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const tagsHtml = entry.cards.map(c => 
    `<span class="tag static">${c.name} (${c.position})</span>`
  ).join(' ')
  
  leftCol.innerHTML = DOMPurify.sanitize(`
    <button id="backToForm" class="back-btn">← Back to Create Entry</button>
    <h2>Entry - ${dateText}</h2>
    
    <h3>You pulled...</h3>
    <div class="tags">${tagsHtml}</div>
    
    <h3>With a card spread of...</h3>
    <div class="detail-spread">${entry.spread}</div>
    
    <h3>Your Journal Notes</h3>
    <div class="detail-notes"><pre>${entry.notes || ''}</pre></div>
  `)
  
  document.querySelector('#backToForm').addEventListener('click', showFormView)
}

// Show form view
function showFormView() {
  currentView = 'form'
  currentDetailDate = null
  
  leftCol.innerHTML = `
    <h2>Create Tarot Entry</h2>

    <label for="cardSearch">Search Card</label>
    <input id="cardSearch" list="cardsList" placeholder="Start typing a card name..." autocomplete="on" />
    <datalist id="cardsList"></datalist>

    <div id="positionContainer" style="display:none;">
      <label for="cardPosition">Card Position</label>
      <select id="cardPosition">
        <option value="upright">Upright</option>
        <option value="reversed">Reversed</option>
      </select>
    </div>

    <div id="selectedTags" aria-live="polite" class="tags"></div>

    <label for="spreadSelect">Spread</label>
    <select id="spreadSelect">
      <option value="single">Single spread</option>
      <option value="3">3-spread</option>
      <option value="4">4-spread</option>
      <option value="5">5-spread</option>
      <option value="7">7-spread</option>
      <option value="celtic">Celtic Cross</option>
      <option value="other">Other...</option>
    </select>

    <label for="entryDate">Date</label>
    <input type="date" id="entryDate" />

    <label for="notes">Notes</label>
    <textarea id="notes" rows="6" placeholder="Write your journal notes here..."></textarea>

    <div class="form-actions">
      <button id="saveEntry" class="save">Save Entry</button>
      <button id="clearForm" type="button" class="cancel">Clear</button>
    </div>
  `
  
  // Re-initialize all form elements and event listeners
  initFormElements()
}

// Initialize form elements and event listeners
function initFormElements() {
  const cardSearch = document.querySelector('#cardSearch')
  const cardsList = document.querySelector('#cardsList')
  const positionContainer = document.querySelector('#positionContainer')
  const cardPosition = document.querySelector('#cardPosition')
  const addCardBtn = document.querySelector('#addCardBtn')
  const selectedTags = document.querySelector('#selectedTags')
  const spreadSelect = document.querySelector('#spreadSelect')
  const entryDate = document.querySelector('#entryDate')
  const notes = document.querySelector('#notes')
  const saveEntry = document.querySelector('#saveEntry')
  const clearForm = document.querySelector('#clearForm')
  
  // Repopulate datalist
  tarotCards.forEach(card => {
    const option = document.createElement('option')
    option.value = card
    cardsList.appendChild(option)
  })
  
  // Card search change handler
  cardSearch.addEventListener('change', (e) => {
    const val = e.target.value.trim()
    if (!val) return
    const found = tarotCards.find(c => c.toLowerCase() === val.toLowerCase())
    if (found) {
      positionContainer.style.display = 'block'
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
    positionContainer.style.display = 'none'
  })
  
  // Keydown handler
  cardSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = cardSearch.value.trim()
      const found = tarotCards.find(c => c.toLowerCase() === val.toLowerCase())
      if (found) {
        positionContainer.style.display = 'block'
        cardPosition.focus()
      } else {
        alert('Card not found. Please choose a card from the suggestions.')
      }
    }
  })
  
  // Save entry handler
  saveEntry.addEventListener('click', (e) => {
    e.preventDefault()
    if (selectedCards.length === 0) return alert('Add at least one card to the reading.')
    const entry = {
      id: Date.now(),
      cards: selectedCards.slice(),
      spread: spreadSelect.options[spreadSelect.selectedIndex].text,
      spreadValue: spreadSelect.value,
      date: entryDate.value || new Date().toISOString().substring(0, 10),
      notes: notes.value
    }
    const all = loadEntries()
    all.push(entry)
    saveEntries(all)
    // reset form
    selectedCards = []
    renderTags()
    spreadSelect.value = 'single'
    entryDate.value = ''
    notes.value = ''
    renderCalendar()
    alert('Entry saved!')
  })
  
  // Clear form handler
  clearForm.addEventListener('click', () => {
    selectedCards = []
    renderTags()
    spreadSelect.value = 'single'
    entryDate.value = ''
    notes.value = ''
  })
  
  renderTags()
}

// Init
renderTags()
renderCalendar() 
