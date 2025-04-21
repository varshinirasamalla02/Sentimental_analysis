# Sentiment Analysis Platform

A comprehensive platform for extracting product reviews, storing them in a database, and analyzing consumer sentiment using Large Language Models.

## Features

- User authentication system with JWT tokens
- RESTful API for managing product reviews
- Web scraping functionality to collect reviews from e-commerce platforms
- Sentiment analysis using Large Language Models
- Interactive dashboard for visualizing sentiment analysis results
- Command-line interface for quick sentiment analysis

## Project Structure

```
sentiment-analysis-platform/
├── backend/                  # Django REST Framework backend
│   ├── api/                  # API app with models, views, and serializers
│   ├── sentiment_analysis/   # Django project settings
│   ├── scraper.py            # Web scraper for e-commerce reviews
│   └── sentiment_analyzer.py # CLI tool for sentiment analysis
│
├── src/                      # React frontend
│   ├── components/           # Reusable UI components
│   ├── context/              # Global state (auth context)
│   └── pages/                # App pages and routes
│
├── public/                   # Static assets
└── README.md                 # Project documentation
```

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Chart.js
- **Backend**: Django, Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT (JSON Web Tokens)
- **Web Scraping**: Selenium, BeautifulSoup
- **Sentiment Analysis**: OpenAI API

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Chrome browser (for web scraping)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Run migrations:
   ```
   python manage.py makemigrations api
   python manage.py migrate
   ```

6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

7. Start the Django server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. From the project root, install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the project root with the following:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Usage

### Web Scraping

Run the web scraper to collect product reviews:

```
cd backend
python scraper.py
```

The scraper will:
1. Log in to the API using your credentials
2. Scrape reviews from configured e-commerce sites
3. Save the reviews to the database via the API

### Sentiment Analysis CLI

Use the command-line tool to analyze product sentiment:

```
cd backend
python sentiment_analyzer.py
```

Follow the prompts to:
1. Log in with your credentials
2. Select a product from the list
3. View detailed sentiment analysis

### Web Interface

The web interface provides a complete dashboard for:
- Managing product reviews
- Visualizing sentiment analysis
- Tracking review statistics

Access the web interface at http://localhost:5173 (or the port specified by Vite).

## API Documentation

The API includes the following endpoints:

- **Authentication**:
  - POST `/api/auth/register/`: Register a new user
  - POST `/api/auth/login/`: Log in and get JWT token

- **Reviews**:
  - GET `/api/reviews/`: List all reviews (supports search parameter)
  - POST `/api/reviews/`: Create a new review
  - GET `/api/reviews/{id}/`: Retrieve a specific review
  - PUT `/api/reviews/{id}/`: Update a review
  - DELETE `/api/reviews/{id}/`: Delete a review

- **Products**:
  - GET `/api/products/`: List unique products
  - GET `/api/products/top/`: List top products by review count

- **Sentiment Analysis**:
  - GET `/api/sentiment/analyze/{product_id}/`: Analyze sentiment for a product

## Process Flow

1. **Data Collection**:
   - Scrape reviews from e-commerce websites
   - Store reviews in the database

2. **Sentiment Analysis**:
   - Process reviews using LLM to extract sentiment
   - Identify product strengths and weaknesses

3. **Visualization**:
   - View analysis results in the dashboard
   - Track sentiment trends over time

## License

MIT License

## Contributors

- [Your Name]

## Acknowledgements

- OpenAI for the sentiment analysis API
- Django REST Framework for the backend
- React and Tailwind CSS for the frontend