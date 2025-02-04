from fuzzywuzzy import fuzz
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Enables frontend (5500) to talk to backend (5000)

# **Load dataset from Google Drive**
csv_url = "https://drive.google.com/uc?export=download&id=17m7I4UJ955rZo5zRSnsVuCzzrcTxSJ7r"
df = pd.read_csv(csv_url)
df.columns = df.columns.str.strip()  # Clean column names

# Define disease column and symptom columns
disease_column = 'diseases'
symptom_columns = df.columns[1:]

# List of common symptoms
common_symptoms = [
    "fever", "cough", "headache", "sore throat", "runny nose", "fatigue", 
    "body pain", "stomach pain", "vomiting", "diarrhea", "cold", "chest pain", 
    "shortness of breath", "joint pain", "muscle ache", "nasal congestion",
    "blocked nose", "sinus pain", "chills", "dizziness", "insomnia",
    "loss of appetite", "rash", "high blood pressure", "low blood pressure",
    "drowsiness", "abdominal pain", "nausea", "hiccups", "dry cough",
    "wet cough", "pain in chest", "swollen feet", "constipation", "frequent urination"
]

# Function to extract symptoms
def extract_symptoms(user_input):
    """Extracts symptoms from user input by checking for common symptoms."""
    user_input = user_input.lower()
    extracted = [symptom for symptom in common_symptoms if fuzz.partial_ratio(symptom.lower(), user_input) > 80]
    return extracted

@app.route('/')
def home():
    # Serve the index.html directly from the current directory
    return send_from_directory(os.getcwd(), 'index.html')

@app.route('/predict', methods=['POST'])
def predict_disease():
    data = request.json
    user_input = data.get('symptoms')

    if not user_input:
        return jsonify({'error': 'Please provide symptoms'}), 400

    extracted_symptoms = extract_symptoms(user_input)
    if not extracted_symptoms:
        return jsonify({'error': 'No known symptoms found in input'}), 400

    symptom_vector = [1 if symptom in extracted_symptoms else 0 for symptom in symptom_columns]
    df['match'] = df[symptom_columns].apply(lambda row: sum(row == symptom_vector), axis=1)
    best_match_row = df.loc[df['match'].idxmax()]
    predicted_disease = best_match_row[disease_column]

    return jsonify({
        "extracted_symptoms": extracted_symptoms,
        "predicted_disease": predicted_disease
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Ensure app can run on Render
