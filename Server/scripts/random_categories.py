import pandas as pd
import nltk
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

# Load the dataset
data = pd.read_csv('D:\Personal\Projects\Web Extension\Pacman_2\Pacman\Server\scripts\sentences.csv')
# Split the data into features (X) and labels (y)
X = data['text']
y_label = data['label']
categories = data['Pattern_Category']

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

# Function to get category by label
def get_category(label):
    return categories[data[data['label'] == label].index[0]]

input_file_path = 'D:\Personal\Projects\Web Extension\Pacman_2\Pacman\Server\scripts\input_paragraph.txt'  # Update with your file path
with open(input_file_path, 'r', encoding='utf-8') as file:
    input_paragraph = file.read()

# Tokenize the input paragraph into sentences
sentences = sent_tokenize(input_paragraph)

import os

def find_patterns(sentences):
    # Create lists to store sentences, labels, and categories
    all_sentences = []
    all_categories = []

    # Create a dictionary to store sentences to ignore
    sentences_to_ignore = {
        "Flipkart Internet Private Limited,.": True,
        "Work hard and no play?": True,
        "Amazon Great India Sale": True,
        "Sale":True,
        "items":True,
        "No Cost EMI":True,
        "Wishlist":True,
        "Profile":True,
        "cart":True,
        "bag":True,
        "Sign in": True,
        "Subscribe":True,
        "In Stock":True,
    }

    # Predict dark patterns for each sentence
    for sentence in sentences:
        # Check if the sentence exists in the ignore dictionary
        if sentence in sentences_to_ignore:
            continue  # Skip prediction for this sentence
        
        # Tokenize the sentence
        tokens = nltk.word_tokenize(sentence)
        # Join tokens to form a statement
        statement = ' '.join(tokens)
        label_prediction = predict_dark_pattern(statement)
        if label_prediction == 1:
            category = get_category(label_prediction)
            all_sentences.append(sentence.strip())
            all_categories.append(category)
        else:
            # If the prediction is not a dark pattern, add it to the ignore dictionary
            sentences_to_ignore[sentence] = True
    
    # Write sentences to 'sentences.txt'
    with open('D:\Personal\Projects\Web Extension\Pacman_2\Pacman\Server\scripts\sentences.txt', 'w', encoding='utf-8') as sentences_file:
        for sentence in all_sentences:
            sentence = sentence.rstrip('.')
            sentences_file.write(sentence + '\n')
    # print(all_sentences)
    # Write categories to 'categories.txt'
    with open('D:\Personal\Projects\Web Extension\Pacman_2\Pacman\Server\scripts\categories.txt', 'w', encoding='utf-8') as categories_file:
        for category in all_categories:
            categories_file.write(category + '\n')

# Call the function with the input sentences
find_patterns(sentences)
