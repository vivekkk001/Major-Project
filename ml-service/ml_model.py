import joblib
import string
import re

# Load saved model & vectorizer
model = joblib.load("naive_bayes_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# Preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = text.strip()
    return text

# Prediction function
def predict_department(description):
    description = preprocess_text(description)
    description_vectorized = vectorizer.transform([description])
    department = model.predict(description_vectorized)[0]
    return department
