from fastapi import FastAPI, HTTPException
import uvicorn
from sqlmodel import select, delete
from pydantic import BaseModel
from db import Photo, Note, Entry, create_db_and_tables, get_session

app = FastAPI()

# Photo - Name and Date
# Sticky Note - Date and Text

# Classes for Photo and Note
class PhotoCreate(BaseModel):
    name: str
    date: str | None = None


class NoteCreate(BaseModel):
    text: str
    date: str | None = None

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
        return {"photos": photos}


@app.get("/notes")
def get_all_notes():
    with get_session() as session:
        notes = session.exec(select(Note)).all()
        return {"notes": notes}

## Post Routes
@app.post("/photos")
def create_photo(photo: PhotoCreate):
    with get_session() as session:
        db_photo = Photo(name=photo.name, date=photo.date)
        session.add(db_photo)
        session.commit()
        session.refresh(db_photo)
        return {"status": "added", "photo": db_photo}

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