import torch
from transformers import BertTokenizer, BertForSequenceClassification

# Load the fine-tuned TinyBERT model
model_path = "D:/Personal/Projects/Web Extension/Pacman_2/Pacman/Server/scripts/tinybert.pt"
tokenizer = BertTokenizer.from_pretrained('prajjwal1/bert-tiny')
model = BertForSequenceClassification.from_pretrained('prajjwal1/bert-tiny', num_labels=8)
model.load_state_dict(torch.load(model_path))
model.eval()

# Function to predict classes for new input sentences
def predict_classes(sentence):
    inputs = tokenizer(sentence, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=1)
    predicted_class = torch.argmax(probabilities, dim=1).item()
    return predicted_class

# Example usage
sentence = "I want to be uneducated."
predicted_class = predict_classes(sentence)
categories = {
        0: 'Not Dark Pattern',
        1: 'Social Proof',
        2: 'Scarcity',
        3: 'Urgency',
        4: 'Confirm Shaming',
        5: 'Obstruction',
        6: "Sneaking",
        7: "Forced Action"
    }
predicted_category = categories[predicted_class]
print(predicted_category)