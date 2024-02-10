import pandas as pd
import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

# Load the dataset
data = pd.read_csv('Pacman/Server/scripts/RF/sentences.csv')
# Split the data into features (X) and labels (y)
X = data['text']
y_label = data['label']

# Vectorize the text using TF-IDF
vectorizer = TfidfVectorizer()
X_vectorized = vectorizer.fit_transform(X)

# Train the Random Forest classifier for label prediction
rf_classifier_label = RandomForestClassifier(n_estimators=100, random_state=42)
rf_classifier_label.fit(X_vectorized, y_label)

# Function to predict dark pattern for a given statement
def predict_dark_pattern(statement):
    statement_vectorized = vectorizer.transform([statement])
    label_prediction = rf_classifier_label.predict(statement_vectorized)[0]
    return label_prediction

input_file_path = 'Pacman/Server/scripts/RF/input_paragraph.txt'  # Update with your file path
with open(input_file_path, 'r', encoding='utf-8') as file:
    input_paragraph = file.read()

# Tokenize the input paragraph into sentences
sentences = sent_tokenize(input_paragraph)

# Predict dark patterns for each sentence
for sentence in sentences:
    # Tokenize the sentence
    tokens = nltk.word_tokenize(sentence)
    # Join tokens to form a statement
    statement = ' '.join(tokens)
    # Predict dark pattern for the statement
    label_prediction = predict_dark_pattern(statement)
    if label_prediction == 0:
        pass
    else: 
        print(f"Sentence: {sentence.strip()}")
        print(f"Label Prediction: {label_prediction}")
        print()
