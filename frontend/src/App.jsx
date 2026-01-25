import { useState } from 'react'
import './App.css'

function App() {
  const [polaroids, setPolaroids] = useState(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      color: '#ffffff',
      caption: `Photo ${i + 1}`,
      date: '',
    }))
  )

  const [notes, setNotes] = useState([
    { id: 1, color: '#ffeb3b', text: 'Note 1', date: '' },
    { id: 2, color: '#8bc34a', text: 'Note 2', date: '' },
  ])

  const [showPolaroidPicker, setShowPolaroidPicker] = useState(null)
  const [showNotePicker, setShowNotePicker] = useState(null)
  const [showFirework, setShowFirework] = useState(null)

  // Popup state for Add buttons
  const [showAddPolaroidPopup, setShowAddPolaroidPopup] = useState(false)
  const [showAddNotePopup, setShowAddNotePopup] = useState(false)

  // Handlers
  const handlePolaroidColor = (id, color) => {
    setPolaroids(polaroids.map(p => (p.id === id ? { ...p, color } : p)))
  }

  const handleNoteColor = (id, color) => {
    setNotes(notes.map(n => (n.id === id ? { ...n, color } : n)))
  }

  const handleNoteText = (id, text) => {
    setNotes(notes.map(n => (n.id === id ? { ...n, text } : n)))
  }

  const triggerFirework = (id) => {
    setShowFirework(id)
    setTimeout(() => setShowFirework(null), 2000)
  }

  // Add new elements - now just show popup
  const addPolaroid = () => setShowAddPolaroidPopup(true)
  const addNote = () => setShowAddNotePopup(true)

  return (
    <div className="container">
      <h1>Polaroid Gallery + Post-it Notes</h1>

      {/* Top buttons */}
      <div className="top-buttons">
        <button onClick={addPolaroid}>➕ Polaroid</button>
        <button onClick={addNote}>➕ Sticky Note</button>
      </div>

      {/* ---------------- Popups ---------------- */}

      {/* Polaroid Add Popup */}
      {showAddPolaroidPopup && (
        <div className="popup">
          <h3>Add New Polaroid</h3>
          <input type="text" placeholder="Name" />
          <input type="text" placeholder="Date" />
          <button
            onClick={() => {
              setShowAddPolaroidPopup(false)
              // Submit does nothing yet
              console.log('Submit Polaroid - not implemented yet')
            }}
          >
            Submit
          </button>
        </div>
      )}

      {/* Sticky Note Add Popup */}
      {showAddNotePopup && (
        <div className="popup">
          <h3>Add New Sticky Note</h3>
          <input type="text" placeholder="Date" />
          <input type="text" placeholder="Text" />
          <button
            onClick={() => {
              setShowAddNotePopup(false)
              // Submit does nothing yet
              console.log('Submit Note - not implemented yet')
            }}
          >
            Submit
          </button>
        </div>
      )}

      {/* ---------------- Polaroids ---------------- */}
      <div className="grid">
        {polaroids.map((p, i) => (
          <div
            key={p.id}
            className="square"
            style={{ backgroundColor: p.color }}
          >
            <div className="photo" />
            <div className="caption">{p.caption}</div>

            <div className="buttons-container">
              <button
                className="color-button"
                onClick={e => {
                  e.stopPropagation()
                  setShowPolaroidPicker(showPolaroidPicker === i ? null : i)
                }}
              >
                🎨
              </button>

              <button
                className="firework-button"
                onClick={e => {
                  e.stopPropagation()
                  triggerFirework(`polaroid-${i}`)
                }}
              >
                🎆
              </button>
            </div>

            {showPolaroidPicker === i && (
              <input
                type="color"
                value={p.color}
                onClick={e => e.stopPropagation()}
                onChange={e => handlePolaroidColor(p.id, e.target.value)}
                className="color-picker-popup"
              />
            )}

            {showFirework === `polaroid-${i}` && (
              <div className="firework">
                {Array.from({ length: 180 }).map((_, j) => (
                  <span
                    key={j}
                    className="spark"
                    style={{
                      '--x': `${Math.random() * 800 - 400}px`,
                      '--y': `${Math.random() * 800 - 400}px`,
                      '--size': `${Math.random() * 15 + 15}px`,
                      '--color': `radial-gradient(circle, #fff 0%, 
                        ${['#ff4500','#ffd700','#ff0000','#ffa500'][Math.floor(Math.random() * 4)]} 50%, 
                        rgba(255,255,0,0) 80%)`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ---------------- Sticky Notes ---------------- */}
      <h2>Post-it Notes</h2>
      <div className="notes-container">
        {notes.map(note => (
          <div key={note.id} className="note" style={{ backgroundColor: note.color }}>
            <textarea
              value={note.text}
              onChange={e => handleNoteText(note.id, e.target.value)}
            />

            <div className="buttons-container">
              <button
                className="color-button"
                onClick={e => {
                  e.stopPropagation()
                  setShowNotePicker(showNotePicker === note.id ? null : note.id)
                }}
              >
                🎨
              </button>

              <button
                className="firework-button"
                onClick={e => {
                  e.stopPropagation()
                  triggerFirework(`note-${note.id}`)
                }}
              >
                🎆
              </button>
            </div>

            {showNotePicker === note.id && (
              <input
                type="color"
                value={note.color}
                onChange={e => handleNoteColor(note.id, e.target.value)}
                onClick={e => e.stopPropagation()}
                className="color-picker-popup"
              />
            )}

            {showFirework === `note-${note.id}` && (
              <div className="firework">
                {Array.from({ length: 180 }).map((_, j) => (
                  <span
                    key={j}
                    className="spark"
                    style={{
                      '--x': `${Math.random() * 800 - 400}px`,
                      '--y': `${Math.random() * 800 - 400}px`,
                      '--size': `${Math.random() * 15 + 15}px`,
                      '--color': `radial-gradient(circle, #fff 0%, 
                        ${['#ff4500','#ffd700','#ff0000','#ffa500'][Math.floor(Math.random() * 4)]} 50%, 
                        rgba(255,255,0,0) 80%)`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

