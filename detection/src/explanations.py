def generate_explanation(
    account,
    many_to_one_result=None,
    rapid_result=None,
    structuring_result=None,
    circular_result=None,
    anomaly=False
):

    explanations = []

    if many_to_one_result:

        senders = many_to_one_result["number_of_senders"]
        amount = many_to_one_result["total_amount"]

        explanations.append(
            f"Received ₹{amount} from {senders} "
            f"different accounts within 20 minutes."
        )

    if rapid_result:

        received = rapid_result["received_amount"]
        sent = rapid_result["sent_amount"]
        percentage = rapid_result["percentage_transferred"]

        explanations.append(
            f"Received ₹{received} and transferred "
            f"₹{sent} onward, representing "
            f"{percentage}% of the received amount."
        )

    if structuring_result:

        transactions = structuring_result[
            "number_of_transactions"
        ]

        amount = structuring_result["total_amount"]

        explanations.append(
            f"Received {transactions} transactions "
            f"totalling ₹{amount} within a short period."
        )

    if circular_result:

        accounts = " → ".join(circular_result)

        explanations.append(
            f"Participates in a circular transaction path: "
            f"{accounts} → {circular_result[0]}."
        )

    if anomaly:

        explanations.append(
            "Machine-learning analysis identified "
            "unusual transaction behaviour compared "
            "with other accounts."
        )

    return explanations