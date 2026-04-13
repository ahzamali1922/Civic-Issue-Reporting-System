import numpy as np
import tensorflow as tf
import pickle
import os
import logging

logger = logging.getLogger(__name__)

# -------------------------------
# LOAD MODELS (safe paths)
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

image_model = None
text_model = None
vectorizer = None

def load_models():
    """Load models with error handling"""
    global image_model, text_model, vectorizer
    
    try:
        image_model_path = os.path.join(BASE_DIR, "image_model.h5")
        if not os.path.exists(image_model_path):
            raise FileNotFoundError(f"Image model not found at {image_model_path}")
        
        logger.info(f"Loading image model from {image_model_path}")
        image_model = tf.keras.models.load_model(image_model_path)
        logger.info("Image model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load image model: {str(e)}")
        raise

    try:
        text_model_path = os.path.join(BASE_DIR, "text_model.pkl")
        if not os.path.exists(text_model_path):
            raise FileNotFoundError(f"Text model not found at {text_model_path}")
        
        logger.info(f"Loading text model from {text_model_path}")
        with open(text_model_path, "rb") as f:
            text_model = pickle.load(f)
        logger.info("Text model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load text model: {str(e)}")
        raise

    try:
        vectorizer_path = os.path.join(BASE_DIR, "vectorizer.pkl")
        if not os.path.exists(vectorizer_path):
            raise FileNotFoundError(f"Vectorizer not found at {vectorizer_path}")
        
        logger.info(f"Loading vectorizer from {vectorizer_path}")
        with open(vectorizer_path, "rb") as f:
            vectorizer = pickle.load(f)
        logger.info("Vectorizer loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load vectorizer: {str(e)}")
        raise

# Initialize models on import
try:
    load_models()
except Exception as e:
    logger.error(f"Model initialization failed: {str(e)}")

# -------------------------------
# CATEGORY ORDER (MUST MATCH TRAINING)
# -------------------------------
CATEGORIES = [
    'BROKEN_SIGN',
    'DAMAGED_STRUCTURE',
    'ELECTRICAL',
    'FALLEN_TREE',
    'GARBAGE',
    'GRAFFITI',
    'ROAD_DAMAGE'
]

# -------------------------------
# IMAGE PREDICTION
# -------------------------------
def predict_image(img_path):
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image file not found at {img_path}")
    
    if image_model is None:
        raise RuntimeError("Image model not loaded. Check model files.")
    
    try:
        # Updated to use modern tf.keras.utils to fix Pylance error
        img = tf.keras.utils.load_img(img_path, target_size=(224, 224))
        img_array = tf.keras.utils.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        preds = image_model.predict(img_array, verbose=0)
        return preds[0]
    except Exception as e:
        logger.error(f"Image prediction failed: {str(e)}")
        raise

# -------------------------------
# TEXT PREDICTION
# -------------------------------
def predict_text(text):
    if text_model is None or vectorizer is None:
        raise RuntimeError("Text model or vectorizer not loaded. Check model files.")
    
    try:
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
    except Exception as e:
        logger.error(f"Text prediction failed: {str(e)}")
        raise

# -------------------------------
# FINAL HYBRID PREDICTION
# -------------------------------
def final_prediction(image_path, text=""):
    try:
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
    except Exception as e:
        logger.error(f"Final prediction failed: {str(e)}")
        raise

# -------------------------------
# PRIORITY LOGIC
# -------------------------------
def get_priority(category):
    category = category.upper()

    priority_map = {
    "ROAD_DAMAGE": 5,
    "FALLEN_TREE": 5,
    "ELECTRICAL": 5,
    "BROKEN_SIGN": 4,
    "DAMAGED_STRUCTURE": 4,
    "GARBAGE": 3,
    "GRAFFITI": 2,
    "OTHER": 1
}

    return priority_map.get(category, 1)