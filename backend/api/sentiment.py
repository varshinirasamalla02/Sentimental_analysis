import os
import json
from django.conf import settings
import openai

# Set OpenAI API key from settings
openai.api_key = settings.OPENAI_API_KEY


def analyze_product_sentiment(product_name, reviews):
    """
    Analyze sentiment of product reviews using OpenAI's API
    
    Args:
        product_name (str): Name of the product
        reviews (list): List of review texts
    
    Returns:
        dict: Sentiment analysis results
    """
    # If no OpenAI API key is available, return mock data
    if not openai.api_key:
        return generate_mock_sentiment_analysis(product_name, reviews)
    
    # Combine reviews into a single string
    combined_reviews = "\n".join([f"- {review}" for review in reviews])
    
    # Create prompt for OpenAI
    prompt = f"""
    Analyze the sentiment of the following reviews for {product_name}:
    
    {combined_reviews}
    
    Please provide:
    1. A list of positive aspects that people liked about the product
    2. A list of negative aspects that people disliked about the product
    3. A list of neutral aspects or mixed opinions
    4. An overall sentiment score from 0 to 1 (0 being entirely negative, 1 being entirely positive)
    5. A breakdown of sentiment by different aspects (e.g., camera: 0.8, battery: 0.3, etc.)
    
    Format your response as a JSON object with the following structure:
    {{
        "positiveAspects": ["aspect1", "aspect2", ...],
        "negativeAspects": ["aspect1", "aspect2", ...],
        "neutralAspects": ["aspect1", "aspect2", ...],
        "overallSentiment": 0.X,
        "sentimentBreakdown": {{
            "aspect1": 0.X,
            "aspect2": 0.Y,
            ...
        }}
    }}
    """
    
    try:
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a sentiment analysis expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        # Extract JSON response
        result_json = response.choices[0].message.content.strip()
        # Parse JSON from the response
        result = json.loads(result_json)
        
        # Add product name to result
        result['product'] = product_name
        
        return result
    
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        # Fallback to mock data if API call fails
        return generate_mock_sentiment_analysis(product_name, reviews)


def generate_mock_sentiment_analysis(product_name, reviews):
    """
    Generate mock sentiment analysis when OpenAI API is not available
    
    Args:
        product_name (str): Name of the product
        reviews (list): List of review texts
    
    Returns:
        dict: Mock sentiment analysis results
    """
    # Calculate simple sentiment based on presence of positive/negative words
    positive_words = ["great", "good", "excellent", "amazing", "love", "best", "perfect"]
    negative_words = ["bad", "poor", "terrible", "worst", "hate", "disappointing", "failure"]
    
    positive_count = 0
    negative_count = 0
    
    for review in reviews:
        review_lower = review.lower()
        for word in positive_words:
            if word in review_lower:
                positive_count += 1
        for word in negative_words:
            if word in review_lower:
                negative_count += 1
    
    total_count = positive_count + negative_count
    if total_count == 0:
        overall_sentiment = 0.5  # Neutral if no sentiment words found
    else:
        overall_sentiment = positive_count / total_count
    
    # Create mock aspects based on common product features
    common_aspects = {
        "phone": ["camera", "battery", "display", "performance", "price"],
        "laptop": ["keyboard", "battery", "screen", "performance", "portability"],
        "headphones": ["sound quality", "comfort", "battery", "noise cancellation", "price"]
    }
    
    # Determine which aspects to use
    aspects = []
    for category, category_aspects in common_aspects.items():
        if category.lower() in product_name.lower():
            aspects = category_aspects
            break
    
    if not aspects:
        # Default aspects if product type not determined
        aspects = ["quality", "price", "design", "functionality", "durability"]
    
    # Generate random sentiment scores for each aspect
    import random
    sentiment_breakdown = {}
    for aspect in aspects:
        # Skew the sentiment to follow overall sentiment
        base = overall_sentiment
        variation = 0.2
        sentiment_breakdown[aspect] = max(0, min(1, base + (random.random() - 0.5) * variation))
    
    # Sort aspects by sentiment score
    positive_aspects = [aspect for aspect, score in sentiment_breakdown.items() if score >= 0.6]
    negative_aspects = [aspect for aspect, score in sentiment_breakdown.items() if score < 0.4]
    neutral_aspects = [aspect for aspect, score in sentiment_breakdown.items() 
                     if score >= 0.4 and score < 0.6]
    
    return {
        "product": product_name,
        "positiveAspects": positive_aspects,
        "negativeAspects": negative_aspects,
        "neutralAspects": neutral_aspects,
        "overallSentiment": overall_sentiment,
        "sentimentBreakdown": sentiment_breakdown
    }