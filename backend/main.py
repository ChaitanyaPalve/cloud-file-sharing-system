from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from web3 import Web3
import requests
import os
import json

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

# Blockchain Connection
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

contract_address = Web3.to_checksum_address(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
)

wallet_address = Web3.to_checksum_address(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
)

private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

with open("../blockchain/artifacts/contracts/FileStorage.sol/FileStorage.json") as f:
    contract_json = json.load(f)

contract_abi = contract_json["abi"]

contract = w3.eth.contract(
    address=contract_address,
    abi=contract_abi
)


@app.get("/")
def home():
    return {
        "message": "Blockchain Cloud File Sharing Backend Running"
    }


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    if not PINATA_JWT:
        raise HTTPException(
            status_code=500,
            detail="Pinata JWT token missing"
        )

    file_data = await file.read()

    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    headers = {
        "Authorization": f"Bearer {PINATA_JWT}"
    }

    files = {
        "file": (
            file.filename,
            file_data,
            file.content_type
        )
    }

    response = requests.post(
        url,
        files=files,
        headers=headers
    )

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

    # Store CID on Blockchain
    nonce = w3.eth.get_transaction_count(wallet_address)

    txn = contract.functions.addFile(
        file.filename,
        result["IpfsHash"]
    ).build_transaction({
        "chainId": 31337,
        "gas": 2000000,
        "gasPrice": w3.to_wei("1", "gwei"),
        "nonce": nonce,
    })

    signed_txn = w3.eth.account.sign_transaction(
        txn,
        private_key=private_key
    )

    tx_hash = w3.eth.send_raw_transaction(
        signed_txn.raw_transaction
    )

    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    return {
        "filename": file.filename,
        "cid": result["IpfsHash"],
        "ipfs_url": f"https://gateway.pinata.cloud/ipfs/{result['IpfsHash']}",
        "blockchain_tx": tx_hash.hex()
    }