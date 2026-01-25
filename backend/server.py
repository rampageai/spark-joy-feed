from fastapi import FastAPI
import uvicorn
from sqlmodel import select, delete

from db import Entry, create_db_and_tables, get_session

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def main_page():
    return {"page": "main"}

@app.get("/clear")
def clear_entries():
    with get_session() as session:
        session.exec(delete(Entry))
        session.commit()
    return {"page": "clear", "status": "all entries deleted"}

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

def start_web_server():
    uvicorn.run(app, host="127.0.0.1", port=3000, log_level="info")

if __name__ == "__main__":
    start_web_server()