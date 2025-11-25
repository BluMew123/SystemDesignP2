let readyStatus = document.querySelector('#readyStatus')
let notReadyStatus = document.querySelector('#notReadyStatus')
let myForm = document.querySelector('#myForm')
let contentArea = document.querySelector('#contentArea')
let formPopover = document.querySelector('#formPopover')
let createButton = document.querySelector('#createButton')
let formHeading = document.querySelector('#formPopover h2')

// Get form data and process each type of input
// Prepare the data as JSON with a proper set of types
// e.g. Booleans, Numbers, Dates
const getFormData = () => {
    // FormData gives a baseline representation of the form
    // with all fields represented as strings
    const formData = new FormData(myForm)
    const json = Object.fromEntries(formData)

    // Handle checkboxes, dates, and numbers
    myForm.querySelectorAll('input').forEach(el => {
        const value = json[el.name]
        const isEmpty = !value || value.trim() === ''

        // Represent checkboxes as a Boolean value (true/false)
        if (el.type === 'checkbox') {
            json[el.name] = el.checked
        }
        // Represent number and range inputs as actual numbers
        else if (el.type === 'number' || el.type === 'range') {
            json[el.name] = isEmpty ? null : Number(value)
        }
        // Represent all date inputs in ISO-8601 DateTime format
        else if (el.type === 'date') {
            json[el.name] = isEmpty ? null : new Date(value).toISOString()
        }
    })
    return json
}


// listen for form submissions  
myForm.addEventListener('submit', async event => {
    // prevent the page from reloading when the form is submitted.
    event.preventDefault()
    const data = getFormData()
    await saveItem(data)
    myForm.reset()
    formPopover.hidePopover()
})


// Save item (Create or Update)
const saveItem = async (data) => {
    console.log('Saving:', data)

    // Determine if this is an update or create
    const endpoint = data.id ? `/data/${data.id}` : '/data'
    const method = data.id ? "PUT" : "POST"

    const options = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    try {
        const response = await fetch(endpoint, options)

        if (!response.ok) {
            try {
                const errorData = await response.json()
                console.error('Error:', errorData)
                alert(errorData.error || response.statusText)
            }
            catch (err) {
                console.error(response.statusText)
                alert('Failed to save: ' + response.statusText)
            }
            return
        }

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
        const entriesDiv = document.querySelector('#entries')

        // Local storage key
        const STORAGE_KEY = 'tarot-journal-entries'

        // List of tarot cards (Major Arcana + Pips and Court)
        const tarotCards = [
            'Fool','Magician','High Priestess','Empress','Emperor','Hierophant','Lovers','Chariot','Strength','Hermit','Wheel of Fortune','Justice','Hanged Man','Death','Temperance','Devil','Tower','Star','Moon','Sun','Judgement','World',
            'Ace of Cups','Two of Cups','Three of Cups','Four of Cups','Five of Cups','Six of Cups','Seven of Cups','Eight of Cups','Nine of Cups','Ten of Cups','Page of Cups','Knight of Cups','Queen of Cups','King of Cups',
            'Ace of Pentacles','Two of Pentacles','Three of Pentacles','Four of Pentacles','Five of Pentacles','Six of Pentacles','Seven of Pentacles','Eight of Pentacles','Nine of Pentacles','Ten of Pentacles','Page of Pentacles','Knight of Pentacles','Queen of Pentacles','King of Pentacles',
            'Ace of Swords','Two of Swords','Three of Swords','Four of Swords','Five of Swords','Six of Swords','Seven of Swords','Eight of Swords','Nine of Swords','Ten of Swords','Page of Swords','Knight of Swords','Queen of Swords','King of Swords',
            'Ace of Wands','Two of Wands','Three of Wands','Four of Wands','Five of Wands','Six of Wands','Seven of Wands','Eight of Wands','Nine of Wands','Ten of Wands','Page of Wands','Knight of Wands','Queen of Wands','King of Wands'
        ]

        // Populate datalist
        tarotCards.forEach(card => {
            const option = document.createElement('option')
            option.value = card
            cardsList.appendChild(option)
        })

        let selectedCards = [] // { name, position }

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
            // Verify it's in the list
            const found = tarotCards.find(c => c.toLowerCase() === val.toLowerCase())
            if (found) {
                // show position selector
                showPositionSelector()
                // focus position
                cardPosition.focus()
            } else {
                // Not found
                alert('Card not found. Try selecting from the list.')
            }
        })

        // When position selected, add tag and clear search
        cardPosition.addEventListener('change', () => {
            const name = cardSearch.value.trim()
            const pos = cardPosition.value
            if (!name) return
            selectedCards.push({ name, position: pos })
            renderTags()
            // reset
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

        function renderEntries() {
            const entries = loadEntries()
            entriesDiv.innerHTML = ''
            if (entries.length === 0) {
                entriesDiv.innerHTML = '<p><i>No saved readings yet.</i></p>'
                return
            }

            entries.slice().reverse().forEach((entry, idx) => {
                const card = document.createElement('div')
                card.className = 'entry-card'
                const dateText = entry.date ? new Date(entry.date).toLocaleDateString() : '—'
                const tagsHtml = entry.cards.map(c => `<span class="tag static">${c.name} (${c.position})</span>`).join(' ')
                card.innerHTML = DOMPurify.sanitize(`
                    <div class="entry-head">
                        <div class="entry-date">${dateText}</div>
                        <div class="entry-spread">${entry.spread}</div>
                    </div>
                    <div class="entry-cards">${tagsHtml}</div>
                    <div class="entry-notes"><pre>${entry.notes || ''}</pre></div>
                    <div class="entry-actions"><button class="delete-entry">Delete</button></div>
                `)

                card.querySelector('.delete-entry').addEventListener('click', () => {
                    if (!confirm('Delete this reading?')) return
                    const all = loadEntries()
                    // Calculate true index in original array (we reversed for UI)
                    const trueIndex = all.length - 1 - idx
                    all.splice(trueIndex, 1)
                    saveEntries(all)
                    renderEntries()
                })

                entriesDiv.appendChild(card)
            })
        }

        // Form actions
        saveEntry.addEventListener('click', (e) => {
            e.preventDefault()
            if (selectedCards.length === 0) return alert('Add at least one card to the reading.')
            const entry = {
                id: Date.now(),
                cards: selectedCards.slice(),
                spread: spreadSelect.options[spreadSelect.selectedIndex].text,
                spreadValue: spreadSelect.value,
                date: entryDate.value || new Date().toISOString().substring(0,10),
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
            renderEntries()
        })

        clearForm.addEventListener('click', () => {
            selectedCards = []
            renderTags()
            spreadSelect.value = 'single'
            entryDate.value = ''
            notes.value = ''
        })

        // Init
        renderTags()
        renderEntries()
// Reset the form when the create button is clicked. 
