import pandas as pd


def load_transactions(file_path):
    df = pd.read_csv(file_path)

    # Convert timestamp to date/time
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    return df


def validate_transactions(df):
    print("Number of transactions:", len(df))

    print("\nMissing values:")
    print(df.isnull().sum())

    print("\nDuplicate transactions:", df.duplicated().sum())

    print("\nInvalid amounts:", (df["amount"] <= 0).sum())

    return df


if __name__ == "__main__":
    df = load_transactions("data/transactions.csv")

    df = validate_transactions(df)