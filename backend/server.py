from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
def main_page():
    return """
    <h1>Home</h1>
    <p><a href="/view">View Page</a></p>
    <p><a href="/add">Add Page</a></p>
    """

@app.get("/view", response_class=HTMLResponse)
def view_page():
    return """
    <h1>View</h1>
    <p>This is the view route.</p>
    <p><a href="/">Back</a></p>
    """

@app.get("/add", response_class=HTMLResponse)
def add_page():
    return """
    <h1>Add</h1>
    <p>This is the add route.</p>
    <p><a href="/">Back</a></p>
    """

def start_web_server():
    uvicorn.run(app, host="127.0.0.1", port=3000, log_level="info")

if __name__ == "__main__":
    start_web_server()
