from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PINATA_JWT = os.getenv("PINATA_JWT")

@app.get("/")
def home():
    return {"message": "Blockchain Cloud File Sharing Backend Running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not PINATA_JWT:
        raise HTTPException(status_code=500, detail="Pinata JWT token missing")

    file_data = await file.read()

    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    headers = {
        "Authorization": f"Bearer {PINATA_JWT}"
    }

    files = {
        "file": (file.filename, file_data, file.content_type)
    }

    response = requests.post(url, files=files, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "IPFS upload failed",
                "pinata_status": response.status_code,
                "pinata_error": response.text
            }
        )

    result = response.json()

    return {
        "filename": file.filename,
        "cid": result["IpfsHash"],
        "ipfs_url": f"https://gateway.pinata.cloud/ipfs/{result['IpfsHash']}"
    }