#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1MzIwNDIyLCJpYXQiOjE3NDUyMzQwMjIsImp0aSI6IjcyNjZlZGQ0ZjIyMzRiYjk5MmNlMWU0ODkyMWE4MzNkIiwidXNlcl9pZCI6MX0.aaFj6nWH9asgnVqaPHWHximn-JKGNcOGgJPhjcRMUas"
URL="http://127.0.0.1:8000/api/reviews/"

PRODUCTS=("Redmi Note 3" "iPhone 16" "Vivo V50" "Samsung Galaxy" "OnePlus 12" "Pixel 8" "Realme X7" "Motorola Edge" "Asus ROG Phone" "Nothing Phone 2" "Infinix Zero 5G" "Poco F5" "Honor 90" "Nokia XR21")

POSITIVE_REVIEWS=(
  "Fantastic value for money!"
  "Superb screen quality."
  "Handles multitasking very well."
  "Fast charging is a game-changer!"
  "User interface is clean and smooth."
  "Great speakers and sound clarity."
  "Excellent for gaming!"
  "Stylish design and lightweight."
  "Impressed with durability."
  "Very stable performance even after months."
)

NEGATIVE_REVIEWS=(
  "Terrible battery experience."
  "Screen cracked easily."
  "UI lags and freezes often."
  "Camera struggles in low light."
  "Too bulky and heavy."
  "Heats up badly with gaming."
  "Charging is slow compared to competitors."
  "Frequent network drops."
  "Software updates are unreliable."
  "Fingerprint sensor is inconsistent."
)

for i in {1..100}
do
  PRODUCT=${PRODUCTS[$RANDOM % ${#PRODUCTS[@]}]}

  if (( RANDOM % 2 )); then
    REVIEW=${POSITIVE_REVIEWS[$RANDOM % ${#POSITIVE_REVIEWS[@]}]}
    RATING=$((4 + RANDOM % 2))  # 4 or 5 stars
  else
    REVIEW=${NEGATIVE_REVIEWS[$RANDOM % ${#NEGATIVE_REVIEWS[@]}]}
    RATING=$((1 + RANDOM % 2))  # 1 or 2 stars
  fi

  echo "Posting Review $i: [$PRODUCT] - [$RATING stars] - [$REVIEW]"

  curl -s -X POST "$URL" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "product": "'"$PRODUCT"'",
      "rating": '"$RATING"',
      "review": "'"$REVIEW"'"
    }' > /dev/null
done

echo "✅ Another 100 reviews posted successfully!"
