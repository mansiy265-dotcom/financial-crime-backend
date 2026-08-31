from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json


app = FastAPI(
    title="Financial Crime Detection API",
    description="API for financial crime investigation data",
    version="1.0"
)


# --------------------------------
# Allow frontend connections
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------
# Load investigation data
# --------------------------------

def load_investigation_data():

    with open(
        "results/investigation_data.json",
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


# --------------------------------
# Root endpoint
# --------------------------------

@app.get("/")
def root():

    return {
        "message": "Financial Crime Detection API is running"
    }


# --------------------------------
# Complete investigation data
# --------------------------------

@app.get("/api/investigation")
def get_investigation_data():

    return load_investigation_data()


# --------------------------------
# Dashboard summary
# --------------------------------

@app.get("/api/summary")
def get_summary():

    data = load_investigation_data()

    return data["summary"]


# --------------------------------
# Accounts
# --------------------------------

@app.get("/api/accounts")
def get_accounts():

    data = load_investigation_data()

    return data["accounts"]


# --------------------------------
# Single account
# --------------------------------

@app.get("/api/accounts/{account_id}")
def get_account(account_id: str):

    data = load_investigation_data()

    for account in data["accounts"]:

        if account["account"] == account_id:

            return account

    raise HTTPException(
        status_code=404,
        detail=f"Account {account_id} not found"
    )

# --------------------------------
# Transactions for an account
# --------------------------------

@app.get("/api/accounts/{account_id}/transactions")
def get_account_transactions(account_id: str):

    data = load_investigation_data()

    account_exists = False

    for account in data["accounts"]:

        if account["account"] == account_id:

            account_exists = True
            break


    if not account_exists:

        raise HTTPException(
            status_code=404,
            detail=f"Account {account_id} not found"
        )


    transactions = []

    for edge in data["network"]["edges"]:

        if (
            edge["sender"] == account_id
            or
            edge["receiver"] == account_id
        ):

            transactions.append(edge)


    return {
        "account": account_id,
        "transaction_count": len(transactions),
        "transactions": transactions
    }


# --------------------------------
# Network
# --------------------------------

@app.get("/api/network")
def get_network():

    data = load_investigation_data()

    return data["network"]


# --------------------------------
# Investigation cases
# --------------------------------

@app.get("/api/cases")
def get_cases():

    data = load_investigation_data()

    return data["cases"]