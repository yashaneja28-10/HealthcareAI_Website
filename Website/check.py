import pandas as pd

# Load the dataset to inspect
df = pd.read_csv('disease_symptoms.csv')

# Print column names to verify
print("Dataset Columns:", df.columns)
print("First 5 rows of the dataset:", df.head())
