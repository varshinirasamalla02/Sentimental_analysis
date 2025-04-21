# 📚 Sentimental Analysis Project

This is a Django-based Sentimental Analysis project with a custom-built Admin panel and API endpoints for managing product reviews.

## 📂 Project Structure

```
project-bolt-sb1-8fz8qsdj/
├── manage.py
├── project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── app/ (your Django app)
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── tests.py
├── requirements.txt
└── README.md
```

---

## 🚀 How to Run the Project Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/varshinirasamalla02/Sentimental_analysis.git
   cd Sentimental_analysis
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate     # Linux/Mac
   venv\Scripts\activate        # Windows
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a Superuser (Admin)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the Development Server**
   ```bash
   python manage.py runserver
   ```

---

## 🌐 Application URLs

- **Admin Panel:**  
  [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)  
  (Login using the superuser credentials you created.)

- **API - Reviews Endpoint:**  
  [http://127.0.0.1:8000/api/reviews/](http://127.0.0.1:8000/api/reviews/)

---

## 🚰 Features

- Django Admin Panel to manage database entries.
- REST API for product reviews (built using Django REST Framework).
- CRUD operations for reviews.
- Simple and clean project structure.

---

## 📊 System Flow Diagram


[User] --> [Django Views / API Views] --> [Models (Database)]
                         |
                         ↓
             [Admin Panel / API Endpoints]






