# scraper/review_scraper.py

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import requests

# Backend API endpoint to insert reviews
API_ENDPOINT = "http://127.0.0.1:8000/api/reviews/"

# Sample products with their Flipkart URLs
PRODUCTS = {
    "Redmi Note 3": "https://www.flipkart.com/redmi-note-3/product-reviews/...",
    "iPhone 16": "https://www.flipkart.com/iphone-16/product-reviews/...",
    # Add more product URLs here
}

# Setup Chrome options
options = Options()
options.add_argument("--headless")  # Run in headless mode
driver = webdriver.Chrome(executable_path="C:/webdrivers/chromedriver.exe", options=options)

def scrape_reviews(product_name, url):
    print(f"Scraping reviews for: {product_name}")
    driver.get(url)
    time.sleep(2)

    reviews = []
    for _ in range(10):  # Scrape 10 pages (~100 reviews)
        review_elements = driver.find_elements(By.CLASS_NAME, "_6K-7Co")
        for review in review_elements:
            reviews.append(review.text)
        try:
            next_btn = driver.find_element(By.CLASS_NAME, "_1LKTO3").click()
            time.sleep(1)
        except:
            break
    return reviews

def post_reviews(product_name, reviews):
    for review in reviews:
        payload = {
            "product_name": product_name,
            "review": review,
            "rating": 4  # Assume 4 stars; update if scraping rating too
        }
        response = requests.post(API_ENDPOINT, json=payload)
        print("Posted:", response.status_code)

def main():
    for name, url in PRODUCTS.items():
        reviews = scrape_reviews(name, url)
        post_reviews(name, reviews)

    driver.quit()

if __name__ == "__main__":
    main()
