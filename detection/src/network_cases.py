import json
import os


def load_data():

    with open(
        "results/investigation_data.json",
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


def create_network_cases(data):

    nodes = data["network"]["nodes"]
    edges = data["network"]["edges"]

    cases = []

    visited_accounts = set()

    case_number = 1


    for node in nodes:

        account = node["id"]
        risk_score = node["risk_score"]

        if risk_score == 0:
            continue

        if account in visited_accounts:
            continue

        case_accounts = set()
        queue = [account]


        while queue:

            current = queue.pop(0)

            if current in case_accounts:
                continue

            case_accounts.add(current)
            visited_accounts.add(current)


            for edge in edges:

                sender = edge["sender"]
                receiver = edge["receiver"]


                if sender == current:

                    if receiver not in case_accounts:
                        queue.append(receiver)


                elif receiver == current:

                    if sender not in case_accounts:
                        queue.append(sender)


        suspicious_accounts = []

        for acc in case_accounts:

            for n in nodes:

                if n["id"] == acc and n["risk_score"] > 0:

                    suspicious_accounts.append(acc)


        if not suspicious_accounts:
            continue

        case_edges = []

        for edge in edges:

            if (
                edge["sender"] in case_accounts
                and
                edge["receiver"] in case_accounts
            ):

                case_edges.append(edge)



        highest_risk = 0

        patterns = set()


        for n in nodes:

            if n["id"] in suspicious_accounts:

                if n["risk_score"] > highest_risk:
                    highest_risk = n["risk_score"]

                signals = n.get("signals", {})

                if signals.get("many_to_one"):
                    patterns.add("Many-to-one")

                if signals.get("rapid_movement"):
                    patterns.add("Rapid money movement")

                if signals.get("structuring"):
                    patterns.add("Structuring")

                if signals.get("circular_transaction"):
                    patterns.add("Circular transaction")

                if signals.get("ml_anomaly"):
                    patterns.add("ML anomaly")



        network_score = highest_risk

        if len(patterns) >= 2:
            network_score += 10

        if len(patterns) >= 3:
            network_score += 10


        # Limit score to 100
        network_score = min(
            network_score,
            100
        )


        if network_score >= 75:

            network_risk_level = "Critical"

        elif network_score >= 50:

            network_risk_level = "High"

        elif network_score >= 25:

            network_risk_level = "Medium"

        else:

            network_risk_level = "Low"



        cases.append({

            "case_id": f"CASE_{case_number:03d}",

            "accounts": sorted(
                suspicious_accounts
            ),

            "transaction_count": len(
                case_edges
            ),

            "network_score": network_score,

            "network_risk_level": network_risk_level,

            "patterns": sorted(
                patterns
            ),

            "highest_account_score": highest_risk,

            "transactions": case_edges

        })


        case_number += 1


    return cases


def save_cases(cases):

    os.makedirs(
        "results",
        exist_ok=True
    )


    with open(
        "results/network_cases.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            cases,
            file,
            indent=4,
            ensure_ascii=False
        )


if __name__ == "__main__":

    data = load_data()

    cases = create_network_cases(data)

    save_cases(cases)

    print(
        "Network cases saved to:"
    )

    print(
        "results/network_cases.json"
    )

    print(
        f"Total cases: {len(cases)}"
    )