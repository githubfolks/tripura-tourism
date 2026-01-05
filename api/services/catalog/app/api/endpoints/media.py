import shutil
import os
from typing import Any
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.config import settings

router = APIRouter()

UPLOAD_DIR = "app/static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/", response_model=dict)
def upload_file(
    file: UploadFile = File(...)
) -> Any:
    """
    Upload a file.
    """
    try:
        # Generate a safe filename (or just use original for now, usually uuid is better)
        # Using simple timestamp prefix to avoid collisions in this MVP
        import time
        safe_filename = f"{int(time.time())}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Construct valid URL
        # Assuming app is mounted at root or accessed via gateway.
        # For direct access: http://localhost:8000/static/uploads/filename
        # Logic to derive base URL might be needed, but relative path is often enough if proxy handles it.
        # Returing full URL based on request would be ideal, but for now returning a path that the frontend can prefix.
        
        # We will assume serving static files at /static
        url = f"/static/uploads/{safe_filename}"
        
        return {"url": url, "filename": safe_filename}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
