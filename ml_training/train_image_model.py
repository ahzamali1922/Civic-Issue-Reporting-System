import tensorflow as tf  # type: ignore
from tensorflow.keras.applications import MobileNetV2  # type: ignore
from tensorflow.keras.preprocessing.image import ImageDataGenerator  # type: ignore
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D  # type: ignore
from tensorflow.keras.models import Model  # type: ignore
import os
from tensorflow.keras.layers import Dropout # type: ignore

IMG_SIZE = 224
BATCH_SIZE = 8  # keep small if laptop is slow

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
train_dir = os.path.join(BASE_DIR, "dataset/train")
val_dir = os.path.join(BASE_DIR, "dataset/val")

# Verify directories exist
if not os.path.exists(train_dir):
    raise FileNotFoundError(f"Training dataset not found at {train_dir}")
if not os.path.exists(val_dir):
    raise FileNotFoundError(f"Validation dataset not found at {val_dir}")

# Data generators
train_gen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=25,
    zoom_range=0.3,
    horizontal_flip=True,
    brightness_range=[0.7, 1.3],
    shear_range=0.2

).flow_from_directory(
    train_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

val_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
    val_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# Load base model
base_model = MobileNetV2(weights='imagenet', include_top=False)

# Add custom layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(5, activation='softmax')(x)  # 5 classes

model = Model(inputs=base_model.input, outputs=predictions)

# Freeze base layers
for layer in base_model.layers[:-50]:
    layer.trainable = False

for layer in base_model.layers[-50:]:
    layer.trainable = True

# Compile model
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

from tensorflow.keras.callbacks import EarlyStopping # type: ignore

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=3,
    restore_best_weights=True
)

# Train
model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=25,
    callbacks=[early_stop]
)
print("Class indices:", train_gen.class_indices)

# Save model
model_path = os.path.join(BASE_DIR, "image_model.h5")
model.save(model_path)

print(f"✅ Image model saved successfully at {model_path}")