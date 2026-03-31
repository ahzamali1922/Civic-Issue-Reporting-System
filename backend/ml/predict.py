import numpy as np
import tensorflow as tf
import pickle
import os

# -------------------------------
# LOAD MODELS (safe paths)
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

image_model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "image_model.h5")
)

with open(os.path.join(BASE_DIR, "text_model.pkl"), "rb") as f:
    text_model = pickle.load(f)

with open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)

# -------------------------------
# CATEGORY ORDER (MUST MATCH TRAINING)
# -------------------------------
CATEGORIES = ['DRAINAGE', 'GARBAGE', 'POTHOLE', 'STREETLIGHT', 'WATER']

# -------------------------------
# IMAGE PREDICTION
# -------------------------------
def predict_image(img_path):
    # Updated to use modern tf.keras.utils to fix Pylance error
    img = tf.keras.utils.load_img(img_path, target_size=(224, 224))
    img_array = tf.keras.utils.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = image_model.predict(img_array, verbose=0)
    return preds[0]

# -------------------------------
# TEXT PREDICTION
# -------------------------------
def predict_text(text):
    if not text:
        return np.zeros(len(CATEGORIES))  # fallback if empty

    vec = vectorizer.transform([text])
    preds = text_model.predict_proba(vec)[0]

    # Convert to same order as CATEGORIES
    text_probs = np.zeros(len(CATEGORIES))
    for i, label in enumerate(text_model.classes_):
        if label in CATEGORIES:
            idx = CATEGORIES.index(label)
            text_probs[idx] = preds[i]

    return text_probs

# -------------------------------
# FINAL HYBRID PREDICTION
# -------------------------------
def final_prediction(image_path, text=""):
    img_pred = predict_image(image_path)
    text_pred = predict_text(text)

    # Weighted fusion (image more important)
    final = 0.8 * img_pred + 0.2 * text_pred

    confidence = float(np.max(final))

    # Fallback for uncertain predictions
    if confidence < 0.5:
        return "OTHER", confidence

    category_index = int(np.argmax(final))
    return CATEGORIES[category_index], confidence

# -------------------------------
# PRIORITY LOGIC
# -------------------------------
def get_priority(category):
    category = category.upper()

    priority_map = {
        "WATER": 5,
        "DRAINAGE": 5,
        "POTHOLE": 4,
        "GARBAGE": 3,
        "STREETLIGHT": 2,
        "OTHER": 1
    }

    return priority_map.get(category, 1)