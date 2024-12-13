# app/main.py
import sys
import os

# Add the project root directory to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request

# Import from the specific location of your agent script
from your_agent_script import initialize_agent, run_chat_mode  # Update this line
from langchain_core.messages import HumanMessage

app = FastAPI()

# Mount static files and templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# Initialize the agent
agent_executor, config = initialize_agent()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            user_input = await websocket.receive_text()
            
            # Process the input through the agent
            agent_response_parts = []
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=user_input)]}, config
            ):
                response_part = ""
                if "agent" in chunk:
                    response_part = chunk["agent"]["messages"][0].content
                elif "tools" in chunk:
                    response_part = chunk["tools"]["messages"][0].content
                
                if response_part:
                    agent_response_parts.append(response_part)
                    # Send streaming response
                    await manager.send_personal_message(response_part, websocket)
            
            # Optional: Combine and send full response
            full_response = " ".join(agent_response_parts)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)