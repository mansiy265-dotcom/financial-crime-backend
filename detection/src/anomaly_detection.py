import pandas as pd
from sklearn.ensemble import IsolationForest


def create_account_features(df):

    accounts = set(df["sender"]).union(set(df["receiver"]))

    features = []

    for account in accounts:

        received = df[df["receiver"] == account]
        sent = df[df["sender"] == account]

        transaction_count = len(received) + len(sent)

        total_received = received["amount"].sum()

        total_sent = sent["amount"].sum()

        average_received = (
            received["amount"].mean()
            if not received.empty
            else 0
        )

        average_sent = (
            sent["amount"].mean()
            if not sent.empty
            else 0
        )

        features.append({
            "account": account,
            "transaction_count": transaction_count,
            "total_received": total_received,
            "total_sent": total_sent,
            "average_received": average_received,
            "average_sent": average_sent
        })

    return pd.DataFrame(features)


def detect_anomalies(feature_df):

    model_features = [
        "transaction_count",
        "total_received",
        "total_sent",
        "average_received",
        "average_sent"
    ]

    X = feature_df[model_features]

    model = IsolationForest(
        contamination=0.1,
        random_state=42
    )

    model.fit(X)

    predictions = model.predict(X)

    scores = model.decision_function(X)

    result = feature_df.copy()

    result["anomaly"] = predictions
    result["anomaly_score"] = scores

    return result


if __name__ == "__main__":

    df = pd.read_csv("data/transactions.csv")
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    feature_df = create_account_features(df)

    print("\nAccount Features:")
    print("----------------------------------")
    print(feature_df)

    results = detect_anomalies(feature_df)

    print("\nAnomaly Detection Results:")
    print("----------------------------------")

    for _, row in results.iterrows():

        if row["anomaly"] == -1:

            print(f"Account: {row['account']}")
            print(
                f"Anomaly score: "
                f"{row['anomaly_score']:.4f}"
            )

            print(
                "Reason: This account shows unusual "
                "transaction behaviour compared with "
                "other accounts."
            )

            print("----------------------------------")