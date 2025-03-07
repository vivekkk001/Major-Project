import joblib
import string
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

# Load dataset
df = pd.read_csv("D:/Major Project/ml-service/municipal_issues_modified.csv")

# Preprocessing function
def preprocess_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = text.translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
    text = text.strip()
    return text

# Load saved model & vectorizer
model = joblib.load("naive_bayes_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# Function to predict department
def predict_department(description):
    description = preprocess_text(description)
    description_vectorized = vectorizer.transform([description])
    department = model.predict(description_vectorized)[0]
    return department
