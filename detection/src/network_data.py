import pandas as pd
import json
import os


def load_risk_results():

    try:

        with open(
            "results/risk_results.json",
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    except FileNotFoundError:

        print("Warning: risk_results.json not found.")

        return []


def create_network_data(df, risk_results):

    nodes = set()
    edges = []

    risk_lookup = {}

    for result in risk_results:

        risk_lookup[result["account"]] = result

    for index, transaction in df.iterrows():

        transaction_id = f"TXN{index + 1:04d}"

        sender = transaction["sender"]
        receiver = transaction["receiver"]
        amount = transaction["amount"]
        timestamp = transaction["timestamp"]

        nodes.add(sender)
        nodes.add(receiver)

        edges.append({
            "transaction_id": transaction_id,
            "sender": sender,
            "receiver": receiver,
            "amount": float(amount),
            "timestamp": str(timestamp)
        })

    node_data = []

    for account in sorted(nodes):

        risk = risk_lookup.get(account)

        if risk:

            risk_score = risk["risk_score"]
            risk_level = risk["risk_level"]
            signals = risk["signals"]
            explanations = risk["explanations"]

        else:

            risk_score = 0
            risk_level = "Low"

            signals = {
                "many_to_one": False,
                "rapid_movement": False,
                "structuring": False,
                "circular_transaction": False,
                "ml_anomaly": False
            }

            explanations = []

        received_transactions = []
        sent_transactions = []

        total_received = 0
        total_sent = 0


        for index, transaction in df.iterrows():

            transaction_id = f"TXN{index + 1:04d}"

            sender = transaction["sender"]
            receiver = transaction["receiver"]
            amount = float(transaction["amount"])
            timestamp = str(transaction["timestamp"])


            if receiver == account:

                total_received += amount

                received_transactions.append({
                    "transaction_id": transaction_id,
                    "from": sender,
                    "amount": amount,
                    "timestamp": timestamp
                })


            if sender == account:

                total_sent += amount

                sent_transactions.append({
                    "transaction_id": transaction_id,
                    "to": receiver,
                    "amount": amount,
                    "timestamp": timestamp
                })


        node_data.append({

            "id": account,

            "label": account,

            "risk_score": risk_score,

            "risk_level": risk_level,

            "signals": signals,

            "explanations": explanations,

            "total_received": total_received,

            "total_sent": total_sent,

            "received_transactions": received_transactions,

            "sent_transactions": sent_transactions

        })


    return {

        "nodes": node_data,

        "edges": edges

    }


def save_network_data(network_data):

    os.makedirs("results", exist_ok=True)

    with open(
        "results/network_data.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            network_data,
            file,
            indent=4,
            ensure_ascii=False
        )


if __name__ == "__main__":


    df = pd.read_csv(
        "data/transactions.csv"
    )

    df["timestamp"] = pd.to_datetime(
        df["timestamp"]
    )


    risk_results = load_risk_results()


    network_data = create_network_data(
        df,
        risk_results
    )


    save_network_data(
        network_data
    )


    print(
        "Network data saved to:"
    )

    print(
        "results/network_data.json"
    )