import json
import os


def load_json(filename):

    with open(
        filename,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


def create_investigation_data():

    risk_results = load_json(
        "results/risk_results.json"
    )

    network_data = load_json(
        "results/network_data.json"
    )

    network_cases = load_json(
        "results/network_cases.json"
    )

    high_risk = sum(
        1
        for result in risk_results
        if result["risk_level"] == "High"
    )

    medium_risk = sum(
        1
        for result in risk_results
        if result["risk_level"] == "Medium"
    )

    low_risk = sum(
        1
        for result in risk_results
        if result["risk_level"] == "Low"
    )

    critical_risk = sum(
        1
        for result in risk_results
        if result["risk_level"] == "Critical"
    )

    investigation_data = {

        "summary": {

            "total_accounts": len(
                network_data["nodes"]
            ),

            "total_transactions": len(
                network_data["edges"]
            ),

            "flagged_accounts": len(
                risk_results
            ),

            "high_risk": high_risk,

            "medium_risk": medium_risk,

            "low_risk": low_risk,

            "critical_risk": critical_risk,

            "total_network_cases": len(
                network_cases
            )

        },


        "accounts": risk_results,


        "network": network_data,


        "cases": network_cases

    }


    return investigation_data

def save_investigation_data(
    investigation_data
):

    os.makedirs(
        "results",
        exist_ok=True
    )

    with open(
        "results/investigation_data.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            investigation_data,
            file,
            indent=4,
            ensure_ascii=False
        )


if __name__ == "__main__":

    data = create_investigation_data()

    save_investigation_data(data)

    print(
        "Investigation data saved to:"
    )

    print(
        "results/investigation_data.json"
    )