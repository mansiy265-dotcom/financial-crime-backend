import pandas as pd
import networkx as nx


def build_transaction_graph(df):

    G = nx.DiGraph()

    for _, transaction in df.iterrows():

        sender = transaction["sender"]
        receiver = transaction["receiver"]
        amount = transaction["amount"]
        timestamp = transaction["timestamp"]

        G.add_edge(
            sender,
            receiver,
            amount=amount,
            timestamp=timestamp
        )

    return G


def detect_circular_transactions(df):

    G = build_transaction_graph(df)

    cycles = list(nx.simple_cycles(G))

    return cycles


if __name__ == "__main__":

    df = pd.read_csv("data/transactions.csv")
    df["timestamp"] = pd.to_datetime(df["timestamp"])


    cycles = detect_circular_transactions(df)

    print("\nCircular Transaction Networks:")
    print("----------------------------------")

    for cycle in cycles:

        print(f"Accounts involved: {cycle}")

        print(
            f"Reason: A circular transaction path was detected "
            f"through {len(cycle)} accounts."
        )

        print("----------------------------------")