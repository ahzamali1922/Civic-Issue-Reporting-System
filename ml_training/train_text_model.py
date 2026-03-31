import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# Load dataset
df = pd.read_csv("C:\\Users\\ASUS\\Desktop\\project\\Civic-Issue-Reporting-system\\ml_training\\text_dataset.csv")

# Features & labels
X = df["text"]
y = df["label"]

# Convert text → numbers
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

# Train model
model = LogisticRegression()
model.fit(X_vec, y)

# Save models
pickle.dump(model, open("text_model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("✅ Text model trained and saved!")