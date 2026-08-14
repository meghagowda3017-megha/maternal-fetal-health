import pandas as pd

# Location of the CTG dataset
file_path = "dataset/cardiotocography/CTG.xlsx"

# Read the Raw Data sheet
df = pd.read_excel(file_path, sheet_name="Raw Data")

print("\nDataset shape:")
print(df.shape)

print("\nColumn names:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())

print("\nNSP value counts:")
print(df["NSP"].value_counts())

print("\nMissing values:")
print(df.isnull().sum())