# Blockchain Cloud File Sharing System

A decentralized cloud file sharing system using FastAPI, IPFS and Blockchain.

## Features
- Upload files securely
- Store files on IPFS using Pinata
- Generate unique CID/hash
- Store file proof on blockchain
- Verify ownership and file integrity

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Python FastAPI
- Storage: IPFS / Pinata
- Blockchain: Solidity + Hardhat
- Version Control: GitHub

## Project Flow
1. User uploads file from frontend
2. FastAPI backend receives file
3. File is uploaded to IPFS
4. IPFS returns CID
5. CID can be stored on blockchain
6. User gets secure file link

## Run Backend
```bash
cd backend
python -m uvicorn main:app --reload
