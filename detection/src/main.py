import pandas as pd
import json
import os

from network_data import create_network_data, save_network_data
from network_cases import load_data, create_network_cases, save_cases
from investigation_data import create_investigation_data, save_investigation_data

from rules import (
    detect_many_to_one,
    detect_rapid_money_movement,
    detect_structuring
)

from graph_analysis import detect_circular_transactions

from anomaly_detection import (
    create_account_features,
    detect_anomalies
)

from risk_scoring import calculate_risk_score

from explanations import generate_explanation

def run_detection_pipeline():

    # 1. Load transaction data

    df = pd.read_csv("data/transactions.csv")
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    final_results = []

    # 2. Run rule-based detection

    many_to_one_results = detect_many_to_one(df)
    rapid_results = detect_rapid_money_movement(df)
    structuring_results = detect_structuring(df)

    # 3. Run graph analysis

    circular_results = detect_circular_transactions(df)

    # 4. Run ML anomaly detection

    feature_df = create_account_features(df)
    anomaly_results = detect_anomalies(feature_df)

    # 5. Get all accounts

    accounts = set(df["sender"]).union(
        set(df["receiver"])
    )

    # 6. Calculate risk for each account

    print("\nFINAL RISK RESULTS")
    print("============================")


    for account in sorted(accounts):

        has_many_to_one = any(
            result["account"] == account
            for result in many_to_one_results
        )

        has_rapid_movement = any(
            result["account"] == account
            for result in rapid_results
        )

        has_structuring = any(
            result["account"] == account
            for result in structuring_results
        )

        has_circular = any(
            account in cycle
            for cycle in circular_results
        )

        anomaly_row = anomaly_results[
            anomaly_results["account"] == account
        ]

        has_anomaly = (
            not anomaly_row.empty
            and anomaly_row.iloc[0]["anomaly"] == -1
        )


        score, risk_level = calculate_risk_score(
            many_to_one=has_many_to_one,
            rapid_movement=has_rapid_movement,
            circular_transaction=has_circular,
            structuring=has_structuring,
            anomaly=has_anomaly
        )

        if score > 0:

            print(f"\nAccount: {account}")
            print(f"Risk Score: {score}")
            print(f"Risk Level: {risk_level}")

            print("\nSignals:")

            if has_many_to_one:
                print("  ✓ Many-to-one")

            if has_rapid_movement:
                print("  ✓ Rapid money movement")

            if has_structuring:
                print("  ✓ Structuring")

            if has_circular:
                print("  ✓ Circular transaction")

            if has_anomaly:
                print("  ✓ ML anomaly")

            many_to_one_result = next(
                (
                    result
                    for result in many_to_one_results
                    if result["account"] == account
                ),
                None
            )

            rapid_result = next(
                (
                    result
                    for result in rapid_results
                    if result["account"] == account
                ),
                None
            )

            structuring_result = next(
                (
                    result
                    for result in structuring_results
                    if result["account"] == account
                ),
                None
            )

            circular_result = next(
                (
                    cycle
                    for cycle in circular_results
                    if account in cycle
                ),
                None
            )

            explanations = generate_explanation(
                account=account,
                many_to_one_result=many_to_one_result,
                rapid_result=rapid_result,
                structuring_result=structuring_result,
                circular_result=circular_result,
                anomaly=has_anomaly
            )

            final_results.append({
                "account": str(account),
                "risk_score": int(score),
                "risk_level": str(risk_level),
                "signals": {
                    "many_to_one": bool(has_many_to_one),
                    "rapid_movement": bool(has_rapid_movement),
                    "structuring": bool(has_structuring),
                    "circular_transaction": bool(has_circular),
                    "ml_anomaly": bool(has_anomaly)
                },
                "explanations": [str(e) for e in explanations]
            })


            print("\nWhy was it flagged?")

            for explanation in explanations:
                print(f"  • {explanation}")



    os.makedirs("results", exist_ok=True)

    with open(
        "results/risk_results.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            final_results,
            file,
            indent=4,
            ensure_ascii=False
        )

    print("\nResults saved to:")
    print("results/risk_results.json")

    print("\nGenerating network data...")

    network_data = create_network_data(
        df,
        final_results
    )

    save_network_data(
        network_data
    )

    print("Network data generated.")


    print("\nGenerating network cases...")

    investigation_source = load_data()

    network_cases = create_network_cases(
        investigation_source
    )

    save_cases(
        network_cases
    )

    print("Network cases generated.")


    print("\nGenerating investigation data...")

    investigation_data = create_investigation_data()

    save_investigation_data(
        investigation_data
    )

    print("Investigation data generated.")


    print("\nFULL PIPELINE COMPLETED")


if __name__ == "__main__":

    run_detection_pipeline()