from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time

def init_driver():
    options = Options()
    options.add_argument("--headless")  # Run headless for background execution
    options.add_argument("--disable-gpu")
    driver = webdriver.Chrome(options=options)
    return driver

def scrape_reviews(product_url):
    driver = init_driver()
    driver.get(product_url)

    try:
        # Wait for the reviews section to be loaded (look for specific class or XPath for reviews)
        WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.XPATH, "//span[contains(@id, 'acrCustomerReviewText')]")))  # Check for the review count
    except TimeoutException:
        print("Reviews section not found within the timeout period")
        driver.quit()
        return []

    # Scroll until all reviews are loaded
    last_height = driver.execute_script("return document.body.scrollHeight")
    scroll_pause_time = 3  # seconds

    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(scroll_pause_time)
        new_height = driver.execute_script("return document.body.scrollHeight")
        
        if new_height == last_height:
            break
        last_height = new_height

    reviews = []
    review_elements = driver.find_elements(By.XPATH, "//div[@data-asin]")  # Locate all review blocks

    for review in review_elements[:100]:  # Limit to 100 reviews
        try:
            review_text = review.find_element(By.XPATH, ".//span[@class='a-size-base review-text']").text
            review_rating = review.find_element(By.XPATH, ".//span[@class='a-icon-alt']").text
            reviews.append({
                "text": review_text,
                "rating": review_rating,
            })
        except Exception as e:
            print("Error extracting review:", e)

    driver.quit()
    return reviews

# Example usage for scraping reviews of "Redmi Note 3"
product_url = 'https://www.amazon.in/dp/B08D6D38P5'  # Sample URL for Redmi Note 3
reviews = scrape_reviews(product_url)
print(f"Found {len(reviews)} reviews")
