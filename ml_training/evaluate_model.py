import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator # type: ignore

IMG_SIZE = 224
BATCH_SIZE = 8

val_dir = "dataset/val"

# Load model
model = tf.keras.models.load_model("image_model.h5")

# Data generator
val_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
    val_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

# Evaluate
loss, accuracy = model.evaluate(val_gen)

print("\n✅ Validation Accuracy:", accuracy)