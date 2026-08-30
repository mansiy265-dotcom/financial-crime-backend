import pandas as pd
import networkx as nx

def detect_many_to_one(df, time_window_minutes=20, min_senders=3):

    suspicious = []

    receivers = df["receiver"].unique()

    for receiver in receivers:

        receiver_transactions = df[
            df["receiver"] == receiver
        ].sort_values("timestamp")

        for _, transaction in receiver_transactions.iterrows():

            start_time = transaction["timestamp"]

            window = receiver_transactions[
                (receiver_transactions["timestamp"] >= start_time) &
                (
                    receiver_transactions["timestamp"]
                    <= start_time + pd.Timedelta(minutes=time_window_minutes)
                )
            ]

            unique_senders = window["sender"].nunique()

            total_amount = window["amount"].sum()

            if unique_senders >= min_senders:

                suspicious.append({
                    "account": receiver,
                    "pattern": "many_to_one",
                    "number_of_senders": unique_senders,
                    "total_amount": total_amount,
                    "start_time": start_time
                })

                break

    return suspicious

def detect_rapid_money_movement(
    df,
    time_window_minutes=20,
    transfer_percentage=80,
    minimum_received_amount=10000
):

    suspicious = []

    accounts = set(df["sender"]).union(set(df["receiver"]))

    for account in accounts:

        received = df[
            df["receiver"] == account
        ].sort_values("timestamp")

        sent = df[
            df["sender"] == account
        ].sort_values("timestamp")

        if received.empty or sent.empty:
            continue

        for _, incoming in received.iterrows():

            start_time = incoming["timestamp"]

            received_window = received[
                (received["timestamp"] >= start_time) &
                (
                    received["timestamp"]
                    <= start_time
                    + pd.Timedelta(minutes=time_window_minutes)
                )
            ]

            total_received = received_window["amount"].sum()

            sent_window = sent[
                (sent["timestamp"] >= start_time) &
                (
                    sent["timestamp"]
                    <= start_time
                    + pd.Timedelta(minutes=time_window_minutes)
                )
            ]

            total_sent = sent_window["amount"].sum()

            if total_received >= minimum_received_amount:

                percentage_transferred = (
                    total_sent / total_received
                ) * 100

                if percentage_transferred >= transfer_percentage:

                    suspicious.append({
                        "account": account,
                        "pattern": "rapid_money_movement",
                        "received_amount": total_received,
                        "sent_amount": total_sent,
                        "percentage_transferred":
                            round(percentage_transferred, 2),
                        "start_time": start_time
                    })

                    break

    return suspicious


def detect_structuring(
    df,
    time_window_minutes=60,
    minimum_transactions=5,
    minimum_total_amount=100000
):

    suspicious = []

    receivers = df["receiver"].unique()

    for receiver in receivers:

        receiver_transactions = df[
            df["receiver"] == receiver
        ].sort_values("timestamp")

        for _, transaction in receiver_transactions.iterrows():

            start_time = transaction["timestamp"]

            window = receiver_transactions[
                (receiver_transactions["timestamp"] >= start_time) &
                (
                    receiver_transactions["timestamp"]
                    <= start_time
                    + pd.Timedelta(minutes=time_window_minutes)
                )
            ]

            number_of_transactions = len(window)

            total_amount = window["amount"].sum()

            if (
                number_of_transactions >= minimum_transactions
                and total_amount >= minimum_total_amount
            ):

                suspicious.append({
                    "account": receiver,
                    "pattern": "structuring",
                    "number_of_transactions":
                        number_of_transactions,
                    "total_amount": total_amount,
                    "start_time": start_time
                })

                break

    return suspicious

if __name__ == "__main__":

    df = pd.read_csv("data/transactions.csv")
    df["timestamp"] = pd.to_datetime(df["timestamp"])


    many_to_one_results = detect_many_to_one(df)

    print("\nSuspicious Many-to-One Patterns:")
    print("----------------------------------")

    for result in many_to_one_results:

        print(f"Account: {result['account']}")
        print(f"Pattern: {result['pattern']}")
        print(f"Different senders: {result['number_of_senders']}")
        print(f"Total amount: ₹{result['total_amount']}")
        print(f"Started at: {result['start_time']}")

        print(
            f"Reason: {result['account']} received money from "
            f"{result['number_of_senders']} different accounts "
            f"within {20} minutes."
        )

        print("----------------------------------")


    rapid_results = detect_rapid_money_movement(df)

    print("\nRapid Money Movement:")
    print("----------------------------------")

    for result in rapid_results:

        print(f"Account: {result['account']}")
        print(f"Received: ₹{result['received_amount']}")
        print(f"Sent: ₹{result['sent_amount']}")
        print(
            f"Percentage transferred: "
            f"{result['percentage_transferred']}%"
        )

        print(
            f"Reason: {result['account']} transferred "
            f"{result['percentage_transferred']}% of the "
            f"received amount within 20 minutes."
        )

        print("----------------------------------")


    structuring_results = detect_structuring(df)

    print("\nStructuring / Smurfing Patterns:")
    print("----------------------------------")

    for result in structuring_results:

        print(f"Account: {result['account']}")
        print(
            f"Number of transactions: "
            f"{result['number_of_transactions']}"
        )
        print(
            f"Total amount: ₹{result['total_amount']}"
        )

        print(
            f"Reason: {result['account']} received "
            f"{result['number_of_transactions']} transactions "
            f"within 60 minutes with a combined value of "
            f"₹{result['total_amount']}."
        )

        print("----------------------------------")