"""
Sentiment Analysis Command Line Tool

This script provides a command-line interface for analyzing 
product sentiment based on reviews stored in the database.
"""

import os
import sys
import json
import requests
from getpass import getpass


def login_to_api():
    """Login to the API and get authentication token"""
    api_url = "http://localhost:8000/api/auth/login/"
    
    print("\n=== Login to Sentiment Analysis Platform ===")
    email = input("Email: ")
    password = getpass("Password: ")
    
    credentials = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(api_url, json=credentials)
        response.raise_for_status()
        return response.json()["token"]
    except requests.exceptions.RequestException as e:
        print(f"Login failed: {e}")
        if hasattr(e, "response") and e.response:
            print(f"Server response: {e.response.text}")
        return None


def get_product_list(token):
    """Fetch list of products from the API"""
    api_url = "http://localhost:8000/api/products/"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch products: {e}")
        return []


def display_product_menu(products):
    """Display list of products to choose from"""
    print("\n=== Available Products ===")
    
    if not products:
        print("No products found in the database.")
        return False
    
    # List products with alphabetical labels
    for i, product in enumerate(products):
        print(f"{chr(97 + i)}. {product['name']}")
    
    return True


def analyze_sentiment(token, product_id):
    """Call API to analyze sentiment for the selected product"""
    api_url = f"http://localhost:8000/api/sentiment/analyze/{product_id}/"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Failed to analyze sentiment: {e}")
        return None


def display_sentiment_results(result):
    """Display sentiment analysis results in a user-friendly format"""
    if not result:
        print("No sentiment analysis results available.")
        return
    
    print("\n" + "="*60)
    print(f"Sentiment Analysis for: {result['product']}")
    print("="*60)
    
    # Overall sentiment
    sentiment = result['overallSentiment']
    sentiment_percentage = int(sentiment * 100)
    sentiment_label = "Positive" if sentiment > 0.6 else "Negative" if sentiment < 0.4 else "Mixed"
    
    print(f"\nOverall Sentiment: {sentiment_percentage}% ({sentiment_label})")
    
    # Display sentiment meter
    meter_width = 40
    filled_chars = int(sentiment * meter_width)
    empty_chars = meter_width - filled_chars
    
    if sentiment > 0.6:
        color = '\033[92m'  # Green
    elif sentiment < 0.4:
        color = '\033[91m'  # Red
    else:
        color = '\033[93m'  # Yellow
    
    reset_color = '\033[0m'
    print(f"{color}[{'#' * filled_chars}{' ' * empty_chars}]{reset_color}")
    
    # Positive aspects
    print("\nPeople liked this product for:")
    if result['positiveAspects']:
        for aspect in result['positiveAspects']:
            print(f"  ✓ {aspect}")
    else:
        print("  No positive aspects found")
    
    # Negative aspects
    print("\nPeople were not happy about:")
    if result['negativeAspects']:
        for aspect in result['negativeAspects']:
            print(f"  ✗ {aspect}")
    else:
        print("  No negative aspects found")
    
    # Aspect breakdown
    print("\nSentiment Breakdown by Aspect:")
    print("-" * 40)
    
    for aspect, score in result['sentimentBreakdown'].items():
        score_percentage = int(score * 100)
        bar_width = 20
        filled = int(score * bar_width)
        
        if score > 0.6:
            aspect_color = '\033[92m'  # Green
        elif score < 0.4:
            aspect_color = '\033[91m'  # Red
        else:
            aspect_color = '\033[93m'  # Yellow
        
        print(f"{aspect}: {score_percentage}% {aspect_color}{'█' * filled}{reset_color}{'░' * (bar_width - filled)}")
    
    print("\n" + "="*60)


def main():
    # Login to the API
    token = login_to_api()
    if not token:
        print("Authentication failed. Exiting.")
        sys.exit(1)
    
    while True:
        # Get and display product list
        products = get_product_list(token)
        if not display_product_menu(products):
            break
        
        # Get user choice
        choice = input("\nEnter your choice to get reviews (or 'q' to quit): ").lower().strip()
        
        if choice == 'q':
            break
        
        # Convert letter choice to product index
        try:
            choice_index = ord(choice) - 97  # 'a' -> 0, 'b' -> 1, etc.
            if choice_index < 0 or choice_index >= len(products):
                print("Invalid choice. Please try again.")
                continue
            
            product_id = products[choice_index]['id']
            
            # Show analyzing message
            print(f"\nAnalyzing sentiment for {products[choice_index]['name']}...")
            
            # Call sentiment analysis API
            result = analyze_sentiment(token, product_id)
            
            # Display results
            display_sentiment_results(result)
            
            input("\nPress Enter to continue...")
        
        except (ValueError, IndexError):
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting the sentiment analysis tool.")
        sys.exit(0)