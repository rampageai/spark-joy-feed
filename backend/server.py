import os
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from sqlmodel import select, delete
from pydantic import BaseModel
from db import Photo, Note, Entry, create_db_and_tables, get_session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Photo - Name and Date
# Sticky Note - Date and Text

# Classes for Photo and Note
class PhotoCreate(BaseModel):
    name: str
    date: str

class NoteCreate(BaseModel):
    text: str
    date: str 

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

## GET routes
@app.get("/")
def main_page():
    return {"page": "main"}

@app.get("/clear")
def clear_all():
    with get_session() as session:
        session.exec(delete(Photo))
        session.exec(delete(Note))
        session.commit()
    return {"status": "all photos and notes deleted"}

@app.get("/view")
def view_page():
    with get_session() as session:
        entries = session.exec(select(Entry)).all()
        return {"page": "view", "entries": entries}

@app.get("/add")
def add_page(text: str = "default entry"):
    with get_session() as session:
        entry = Entry(text=text)
        session.add(entry)
        session.commit()
        session.refresh(entry)
        return {"page": "add", "added": entry}
    
@app.get("/photos")
def get_all_photos():
    with get_session() as session:
        photos = session.exec(select(Photo)).all()
        out = []
        for p in photos:
            out.append({
                "id": p.id,
                "name": p.name,
                "caption": p.caption,
                "date": p.date,
                "filename": p.filename,
                "url": f"http://127.0.0.1:3000/uploads/{p.filename}",
            })
        return {"photos": out}

@app.get("/notes")
def get_all_notes():
    with get_session() as session:
        notes = session.exec(select(Note)).all()
        return {"notes": notes}

@app.get("/feed")
def get_feed():
    with get_session() as session:
        photos = session.exec(select(Photo)).all()
        notes = session.exec(select(Note)).all()

    items = []

    for p in photos:
        items.append({
            "type": "photo",
            "id": p.id,
            "date": p.date,
            "name": p.name,
            "caption": p.caption,
            "url": f"http://127.0.0.1:3000/uploads/{p.filename}",
        })

    for n in notes:
        items.append({
            "type": "note",
            "id": n.id,
            "date": n.date,
            "text": n.text,
        })

    items.sort(key=lambda x: x["date"], reverse=True)

    return {"feed": items}

## Post Routes
@app.post("/photos")
def create_photo(photo: PhotoCreate):
    with get_session() as session:
        db_photo = Photo(name=photo.name, date=photo.date)
        session.add(db_photo)
        session.commit()
        session.refresh(db_photo)
        return {"status": "added", "photo": db_photo}

@app.post("/photos/upload")
def upload_photo(
    file: UploadFile = File(...),
    caption: str | None = Form(None),
    name: str | None = Form(None),
    date: str = Form(...),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".gif", ".webp"]:
        ext = ".png"

    saved_name = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(UPLOAD_DIR, saved_name)

    with open(saved_path, "wb") as out:
        out.write(file.file.read())

    with get_session() as session:
        db_photo = Photo(
            filename=saved_name,
            caption=caption,
            name=name,
            date=date,
        )
        session.add(db_photo)
        session.commit()
        session.refresh(db_photo)

        photo_url = f"http://127.0.0.1:3000/uploads/{saved_name}"

        return {
            "status": "added",
            "photo": db_photo,
            "url": photo_url,
        }

@app.post("/notes")
def create_note(note: NoteCreate):
    with get_session() as session:
        db_note = Note(text=note.text, date=note.date)
        session.add(db_note)
        session.commit()
        session.refresh(db_note)
        return {"status": "added", "note": db_note}
    
## DELETE Routes
@app.delete("/photos/{photo_id}")
def delete_photo(photo_id: int):
    with get_session() as session:
        photo = session.get(Photo, photo_id)

        if photo is None:
            raise HTTPException(
                status_code=404,
                detail="Photo not found"
            )
        
        try:
            os.remove(os.path.join(UPLOAD_DIR, photo.filename))
        except FileNotFoundError:
            pass

        session.delete(photo)
        session.commit()

        return {
            "status": "deleted",
            "photo_id": photo_id
        }

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    with get_session() as session:
        note = session.get(Note, note_id)

        if note is None:
            raise HTTPException(
                status_code=404,
                detail="Note not found"
            )

        session.delete(note)
        session.commit()

        return {
            "status": "deleted",
            "note_id": note_id
        }

def start_web_server():
    uvicorn.run(app, host="127.0.0.1", port=3000, log_level="info")

if __name__ == "__main__":
    start_web_server()