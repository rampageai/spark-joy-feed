import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = "http://127.0.0.1:3000";

function App() {
  const [feed, setFeed] = useState([]);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [status, setStatus] = useState("");
  const [newNoteDate, setNewNoteDate] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [pageBg, setPageBg] = useState(() => localStorage.getItem("pageBg") || "#111");
  const [showBgPicker, setShowBgPicker] = useState(false);


  async function loadAll() {
    try {
      setStatus("Loading...");
      const res = await fetch(`${API_BASE}/feed`);
      const data = await res.json();
      setFeed(data.feed || []);
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to load feed.");
    }
  }

  async function uploadPhoto(file, caption) {
    if (!file) {
      setStatus("Choose a file first.");
      return;
    }

    try {
      setStatus("Uploading photo...");
      const form = new FormData();
      form.append("file", file);
      form.append("date", uploadDate || new Date().toISOString());
      if (caption && caption.trim()) form.append("caption", caption.trim());

      await fetch(`${API_BASE}/photos/upload`, {
        method: "POST",
        body: form,
      });

      setStatus("");
      await loadAll();
    } catch (err) {
      console.error(err);
      setStatus("Failed to upload photo.");
    }
  }

  async function submitNote(dateStr, text) {
    if (!text.trim()) {
      setStatus("Note text can't be empty.");
      return;
    }

    try {
      setStatus("Adding note...");
      await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          date: dateStr || new Date().toISOString(),
        }),
      });
      setStatus("");
      await loadAll();
    } catch (err) {
      console.error(err);
      setStatus("Failed to add note.");
    }
  }

  async function deleteItem(item) {
    try {
      setStatus("Deleting...");
      const endpoint = item.type === "photo" ? "photos" : "notes";
      await fetch(`${API_BASE}/${endpoint}/${item.id}`, { method: "DELETE" });
      setStatus("");
      await loadAll();
    } catch (err) {
      console.error(err);
      setStatus("Failed to delete item.");
    }
  }

  useEffect(() => {
    document.documentElement.style.setProperty("--page-bg", pageBg);
    localStorage.setItem("pageBg", pageBg);
  }, [pageBg]);

  const [showPolaroidPicker, setShowPolaroidPicker] = useState(null)
  const [showNotePicker, setShowNotePicker] = useState(null)
  const [showFirework, setShowFirework] = useState(null)

  // Popup state for Add buttons
  const [showAddPolaroidPopup, setShowAddPolaroidPopup] = useState(false)
  const [showAddNotePopup, setShowAddNotePopup] = useState(false)

  // Firework confirmation popup
  const [fireworkConfirm, setFireworkConfirm] = useState(null)

  // Handlers
  const triggerFirework = (id) => {
    setShowFirework(id)
    setTimeout(() => setShowFirework(null), 2000)
  }

  const addPolaroid = () => {
    setShowAddNotePopup(false);
    setShowAddPolaroidPopup(true);
  };

  const addNote = () => {
    setShowAddPolaroidPopup(false);
    setShowAddNotePopup(true);
  };

  return (
    <div className="container">
      {/* Title */}
      <h1 className="centered-title">Spark Joy Feed</h1>
      {status && <p style={{ opacity: 0.8 }}>{status}</p>}

      {/* Top buttons */}
      <div className="top-buttons">
        <button onClick={addPolaroid}>➕ Polaroid</button>
        <button onClick={addNote}>➕ Sticky Note</button>
      </div>

      <div className="background-controls" style={{ gap: 10, alignItems: "center" }}>
        <button onClick={() => setShowBgPicker((v) => !v)}>
          🎨 Background Color
        </button>

        {showBgPicker && (
          <input
            type="color"
            value={pageBg}
            onChange={(e) => setPageBg(e.target.value)}
          />
        )}
      </div>


      {/* ---------------- Popups ---------------- */}
      {showAddPolaroidPopup && (
        <div className="popup">
          <h3>Add New Polaroid</h3>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
          />

          <input
            type="text"
            placeholder="Date (leave blank for now)"
            className="white-input"
            value={uploadDate}
            onChange={(e) => setUploadDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Caption (optional)"
            className="white-input"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
          />

          <button
            className="submit-button"
            onClick={async () => {
              await uploadPhoto(uploadFile, uploadCaption);
              setShowAddPolaroidPopup(false);
              setUploadFile(null);
              setUploadCaption("");
            }}
          >
            Upload
          </button>

          <button
            className="submit-button"
            onClick={() => {
              setShowAddPolaroidPopup(false);
              setUploadFile(null);
              setUploadDate("");
              setUploadCaption("");
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {showAddNotePopup && (
        <div className="popup">
          <h3>Add New Sticky Note</h3>

          <input
            type="text"
            placeholder="Date (leave blank for now)"
            className="white-input"
            value={newNoteDate}
            onChange={(e) => setNewNoteDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Text"
            className="white-input"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
          />

          <button
            className="submit-button"
            onClick={async () => {
              await submitNote(newNoteDate, newNoteText);
              setShowAddNotePopup(false);
              setNewNoteDate("");
              setNewNoteText("");
            }}
          >
            Submit
          </button>

          <button
            className="submit-button"
            onClick={() => {
              setShowAddNotePopup(false);
              setNewNoteDate("");
              setNewNoteText("");
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ---------------- Feed ---------------- */}
      <div className="grid">
        {feed.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="square"
            style={{ backgroundColor: "#ffffff" }}
          >
            {item.type === "photo" ? (
              <>
                <img
                  src={item.url}
                  alt={item.caption || "photo"}
                  style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: 4, border: "2px solid black" }}
                />
                <div className="caption">{item.caption || ""}</div>
              </>
            ) : (
              <>
                <textarea
                  value={item.text}
                  readOnly
                  className="white-input note-text"
                  style={{ height: "120px" }}
                />
              </>
            )}

            <div className="buttons-container">
              <button
                className="firework-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFireworkConfirm(item); // store the whole item
                }}
              >
                🎆
              </button>
            </div>

            {showFirework === `${item.type}-${item.id}` && (
              <div className="firework">
                {Array.from({ length: 180 }).map((_, j) => {
                  const angle = Math.random() * 2 * Math.PI;
                  const radius = Math.random() * 800;
                  return (
                    <span
                      key={j}
                      className="spark"
                      style={{
                        "--x": `${radius * Math.cos(angle)}px`,
                        "--y": `${radius * Math.sin(angle)}px`,
                        "--size": `${Math.random() * 15 + 5}px`,
                        "--color": `radial-gradient(circle, #fff 0%, 
                      ${["#ff4500", "#ffd700", "#ff0000", "#ffa500"][Math.floor(Math.random() * 4)]} 50%, rgba(255,255,0,0) 80%)`,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {fireworkConfirm && (
          <div
            className="modal-overlay"
            onClick={() => setFireworkConfirm(null)}
          >
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <p>Do you want to sparkle away this memory?</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  className="confirm-button cancel"
                  onClick={() => setFireworkConfirm(null)}
                >
                  No
                </button>
                <button
                  className="confirm-button danger"
                  onClick={async () => {
                    const item = fireworkConfirm;
                    setFireworkConfirm(null);
                    triggerFirework(`${item.type}-${item.id}`);
                    await sleep(800);
                    await deleteItem(item);
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App
