import { useState } from 'react'
import './App.css'

function App() {
  const [polaroids, setPolaroids] = useState(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      color: '#ffffff',
      caption: `Photo ${i + 1}`,
      date: '', // <--- new date field
    }))
  )

  const [notes, setNotes] = useState([
    { id: 1, color: '#ffeb3b', text: 'Note 1' },
    { id: 2, color: '#8bc34a', text: 'Note 2' },
  ])

  const [showPolaroidPicker, setShowPolaroidPicker] = useState(null)
  const [showNotePicker, setShowNotePicker] = useState(null)
  const [showFirework, setShowFirework] = useState(null)

  // Handlers
  const handlePolaroidColor = (id, color) => {
    setPolaroids(polaroids.map(p => (p.id === id ? { ...p, color } : p)))
  }

  const handlePolaroidDate = (id, date) => {
    setPolaroids(polaroids.map(p => (p.id === id ? { ...p, date } : p)))
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

  // Add new elements
  const addPolaroid = () => {
    const newId = polaroids.length ? polaroids[polaroids.length - 1].id + 1 : 0
    setPolaroids([...polaroids, { id: newId, color: '#ffffff', caption: `Photo ${newId + 1}`, date: '' }])
  }

  const addNote = () => {
    const newId = notes.length ? notes[notes.length - 1].id + 1 : 1
    setNotes([...notes, { id: newId, color: '#ffeb3b', text: `Note ${newId}` }])
  }

  return (
    <div className="container">
      <h1>Polaroid Gallery + Post-it Notes</h1>

      {/* Top buttons */}
      <div className="top-buttons">
        <button onClick={addPolaroid}>➕ Polaroid</button>
        <button onClick={addNote}>➕ Sticky Note</button>
      </div>

      {/* Polaroid Gallery */}
      <div className="grid">
        {polaroids.map((p, i) => (
          <div
            key={p.id}
            className="square"
            style={{ backgroundColor: p.color }}
          >
            <div className="photo" />
            <div className="caption">{p.caption}</div>

            {/* Date input */}
            <input
              type="text"
              placeholder="Enter date"
              value={p.date}
              onChange={e => handlePolaroidDate(p.id, e.target.value)}
              className="date-input"
            />

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

      {/* Post-it Notes */}
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
