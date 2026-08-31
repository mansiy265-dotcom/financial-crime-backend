def calculate_risk_score(
    many_to_one=False,
    rapid_movement=False,
    circular_transaction=False,
    structuring=False,
    anomaly=False
):

    score = 0

    if many_to_one:
        score += 25

    if rapid_movement:
        score += 25

    if circular_transaction:
        score += 25

    if structuring:
        score += 25

    if anomaly:
        score += 20

    score = min(score, 100)

    if score >= 80:
        risk_level = "Critical"

    elif score >= 60:
        risk_level = "High"

    elif score >= 30:
        risk_level = "Medium"

    else:
        risk_level = "Low"

    return score, risk_level