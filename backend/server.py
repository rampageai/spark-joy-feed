from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn

app = FastAPI()

@app.get("/")
def main_page():
    return {"page": "main"}

@app.get("/view")
def view_page():
    return {"page": "view"}

@app.get("/add")
def add_page():
    return {"page": "add"}

def start_web_server():
    uvicorn.run(app, host="127.0.0.1", port=3000, log_level="info")

if __name__ == "__main__":
    start_web_server()
