import requests
from bs4 import BeautifulSoup

def classify_website(description):
    description_lower = description.lower()

    ecommerce_keywords = ['shop', 'buy', 'store', 'purchase', 'order', 'checkout',
        'product', 'online', 'sale', 'retail', 'marketplace',
        'e-shop', 'e-store', 'catalog', 'cart', 'deal', 'discount',
        'shipping', 'delivery', 'add to cart', 'browse', 'inventory',
        'shopping', 'check out', 'shop now', 'get it now', 'limited stock']

    is_ecommerce = any(keyword in description_lower for keyword in ecommerce_keywords)

    return 1 if is_ecommerce else 0

def extract_website_content(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # List of tags and attributes to search for relevant information
        search_tags = [
            {'tag': 'meta', 'attrs': {'name': 'description'}},
            {'tag': 'meta', 'attrs': {'name': 'keywords'}},
            {'tag': 'meta', 'attrs': {'property': 'og:description'}},
            {'tag': 'title'},
            {'tag': 'h1'}
            # Add more tags and attributes as needed
        ]

        # Extract text content from specified tags and attributes
        extracted_content = []
        for tag_info in search_tags:
            tag = tag_info['tag']
            attrs = tag_info.get('attrs', {})
            elements = soup.find_all(tag, attrs=attrs)
            for element in elements:
                extracted_content.append(element.get_text())

        return ' '.join(extracted_content)

    except Exception as e:
        print(f"Error extracting website content: {e}")
        return None

# Example usage:
website_url = "https://www.google.com"
website_content = extract_website_content(website_url)

if website_content:
    print(f"Website Content: {website_content}")
    classification_result = classify_website(website_content)
    print(f"\nClassification result: {classification_result}")
else:
    print("Failed to extract website content.")