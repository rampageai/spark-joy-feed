from typing import Optional
from sqlmodel import SQLModel, Field, create_engine, Session

class Entry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str

DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    return Session(engine)