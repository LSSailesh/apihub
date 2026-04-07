from fastapi import APIRouter
import random
from typing import Optional

router = APIRouter()

@router.get("/weather")
async def get_weather(city: Optional[str] = "San Francisco"):
    """Mock weather data"""
    conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Stormy", "Snowy"]
    return {
        "location": city,
        "temperature_celsius": round(random.uniform(-5.0, 35.0), 1),
        "condition": random.choice(conditions),
        "humidity": random.randint(30, 90),
        "wind_kph": random.randint(0, 50)
    }

@router.get("/users")
async def get_users(limit: int = 5):
    """Mock user list"""
    first_names = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "Elijah"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
    
    users = []
    for _ in range(min(limit, 50)):
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        users.append({
            "id": random.randint(1000, 9999),
            "name": f"{fname} {lname}",
            "email": f"{fname.lower()}.{lname.lower()}@example.com",
            "role": random.choice(["User", "Admin", "Editor"])
        })
    return {"data": users, "total": len(users)}

@router.get("/products")
async def get_products(category: Optional[str] = None):
    """Mock product catalog"""
    all_products = [
        {"id": 1, "name": "Wireless Noise Cancelling Headphones", "price": 299.99, "category": "Electronics", "stock": 45},
        {"id": 2, "name": "Minimalist Leather Backpack", "price": 120.00, "category": "Accessories", "stock": 12},
        {"id": 3, "name": "Smart Fitness Watch", "price": 199.50, "category": "Electronics", "stock": 80},
        {"id": 4, "name": "Stainless Steel Water Bottle", "price": 35.00, "category": "Home", "stock": 150},
        {"id": 5, "name": "Mechanical Keyboard", "price": 145.00, "category": "Electronics", "stock": 30},
    ]
    
    if category:
        filtered = [p for p in all_products if p["category"].lower() == category.lower()]
    else:
        filtered = all_products
        
    return {"products": filtered, "count": len(filtered)}
