import { useState } from 'react'
import './App.css'

function App() {
  const [selectedPolaroid, setSelectedPolaroid] = useState(null)

  // Polaroid colors (background of the polaroid itself)
  const [polaroids, setPolaroids] = useState(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      color: '#ffffff', // default Polaroid background is white
      caption: `Photo ${i + 1}`,
    }))
  )

  // Post-it notes
  const [notes, setNotes] = useState([
    { id: 1, color: '#ffeb3b', text: 'Note 1' },
    { id: 2, color: '#8bc34a', text: 'Note 2' },
  ])

  const [showPolaroidPicker, setShowPolaroidPicker] = useState(null)
  const [showNotePicker, setShowNotePicker] = useState(null)

  const handlePolaroidColor = (id, color) => {
    setPolaroids(polaroids.map(p => (p.id === id ? { ...p, color } : p)))
  }

  const handleNoteColor = (id, color) => {
    setNotes(notes.map(n => (n.id === id ? { ...n, color } : n)))
  }

  const handleNoteText = (id, text) => {
    setNotes(notes.map(n => (n.id === id ? { ...n, text } : n)))
  }

  return (
    <div className="container">
      <h1>Polaroid Gallery + Post-it Notes</h1>

      {/* Polaroid Gallery */}
      <div className="grid">
        {polaroids.map((p, i) => (
          <div
            key={p.id}
            className={`square ${selectedPolaroid === i ? 'active' : ''}`}
            style={{ backgroundColor: p.color }} // Polaroid background color
            onClick={() => setSelectedPolaroid(i)}
          >
            {/* Photo area remains white with black outline */}
            <div className="photo" />

            {/* Caption */}
            <div className="caption">{p.caption}</div>

            {/* Small color button */}
            <button
              className="color-button"
              onClick={e => {
                e.stopPropagation()
                setShowPolaroidPicker(showPolaroidPicker === i ? null : i)
              }}
            >
              🎨
            </button>

            {/* Hidden color picker */}
            {showPolaroidPicker === i && (
              <input
                type="color"
                value={p.color}
                onClick={e => e.stopPropagation()}
                onChange={e => handlePolaroidColor(p.id, e.target.value)}
                className="color-picker-popup"
              />
            )}

            {/* Firework */}
            {selectedPolaroid === i && (
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
            {/* Small color button */}
            <button
              className="color-button"
              onClick={e => {
                e.stopPropagation()
                setShowNotePicker(showNotePicker === note.id ? null : note.id)
              }}
            >
              🎨
            </button>

            {/* Hidden color picker */}
            {showNotePicker === note.id && (
              <input
                type="color"
                value={note.color}
                onChange={e => handleNoteColor(note.id, e.target.value)}
                onClick={e => e.stopPropagation()}
                className="color-picker-popup"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

