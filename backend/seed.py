import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

MONGO_URI = "mongodb://mongo:27017/apihub"

APIS = [
    {
        "name": "OpenWeather API",
        "description": "Get real-time weather data, forecasts, and historical weather for any location worldwide.",
        "category": "Weather",
        "base_url": "https://api.openweathermap.org/data/2.5",
        "logo": "https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png",
        "plan": "Freemium",
        "rating": 4.5,
        "rating_count": 120,
        "tags": ["weather", "forecast", "climate"],
        "approved": True,
    },
    {
        "name": "GitHub API",
        "description": "Access GitHub repositories, users, issues, pull requests, and more programmatically.",
        "category": "Social",
        "base_url": "https://api.github.com",
        "logo": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        "plan": "Free",
        "rating": 4.8,
        "rating_count": 340,
        "tags": ["git", "repos", "code", "developer"],
        "approved": True,
    },
    {
        "name": "Spotify API",
        "description": "Access music data including tracks, albums, artists, playlists and user data from Spotify.",
        "category": "Social",
        "base_url": "https://api.spotify.com/v1",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png",
        "plan": "Freemium",
        "rating": 4.6,
        "rating_count": 210,
        "tags": ["music", "streaming", "playlist"],
        "approved": True,
    },
    {
        "name": "NewsAPI",
        "description": "Search news articles from over 80,000 sources worldwide in real time.",
        "category": "Data",
        "base_url": "https://newsapi.org/v2",
        "logo": "https://newsapi.org/images/n-logo-border.png",
        "plan": "Freemium",
        "rating": 4.3,
        "rating_count": 98,
        "tags": ["news", "articles", "media"],
        "approved": True,
    },
    {
        "name": "Stripe API",
        "description": "Accept payments, manage subscriptions, and handle payouts with Stripe's powerful payments platform.",
        "category": "Payments",
        "base_url": "https://api.stripe.com/v1",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/320px-Stripe_Logo%2C_revised_2016.svg.png",
        "plan": "Paid",
        "rating": 4.9,
        "rating_count": 512,
        "tags": ["payments", "billing", "subscriptions"],
        "approved": True,
    },
    {
        "name": "Google Maps API",
        "description": "Embed maps, geocode addresses, calculate routes, and find places with Google Maps Platform.",
        "category": "Maps",
        "base_url": "https://maps.googleapis.com/maps/api",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/150px-Google_Maps_icon_%282020%29.svg.png",
        "plan": "Freemium",
        "rating": 4.7,
        "rating_count": 430,
        "tags": ["maps", "geocoding", "routes", "places"],
        "approved": True,
    },
    {
        "name": "OpenAI API",
        "description": "Access GPT-4, DALL-E, Whisper and other powerful AI models for text, image and audio generation.",
        "category": "AI/ML",
        "base_url": "https://api.openai.com/v1",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/320px-OpenAI_Logo.svg.png",
        "plan": "Paid",
        "rating": 4.9,
        "rating_count": 890,
        "tags": ["ai", "gpt", "llm", "image", "text"],
        "approved": True,
    },
    {
        "name": "Twilio API",
        "description": "Send SMS, make voice calls, and build communication workflows with Twilio's cloud communications API.",
        "category": "Communication",
        "base_url": "https://api.twilio.com/2010-04-01",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Twilio-logo-red.svg/320px-Twilio-logo-red.svg.png",
        "plan": "Paid",
        "rating": 4.6,
        "rating_count": 275,
        "tags": ["sms", "voice", "communication", "messaging"],
        "approved": True,
    },
    {
        "name": "CoinGecko API",
        "description": "Get real-time cryptocurrency prices, market data, charts and historical data for 10,000+ coins.",
        "category": "Finance",
        "base_url": "https://api.coingecko.com/api/v3",
        "logo": "https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d3574718525625ae0f8acd4b45c.png",
        "plan": "Free",
        "rating": 4.5,
        "rating_count": 185,
        "tags": ["crypto", "bitcoin", "finance", "prices"],
        "approved": True,
    },
    {
        "name": "Alpha Vantage API",
        "description": "Access real-time and historical stock market data, forex rates, and cryptocurrency data.",
        "category": "Finance",
        "base_url": "https://www.alphavantage.co/query",
        "logo": "https://www.alphavantage.co/static/img/alpha-vantage-logo.png",
        "plan": "Freemium",
        "rating": 4.2,
        "rating_count": 143,
        "tags": ["stocks", "forex", "finance", "market"],
        "approved": True,
    },
    {
        "name": "HuggingFace API",
        "description": "Run thousands of open-source ML models for NLP, vision, audio and more via a simple API.",
        "category": "AI/ML",
        "base_url": "https://api-inference.huggingface.co/models",
        "logo": "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
        "plan": "Freemium",
        "rating": 4.7,
        "rating_count": 320,
        "tags": ["ml", "nlp", "models", "ai", "open-source"],
        "approved": True,
    },
    {
        "name": "IPInfo API",
        "description": "Get geolocation, ISP, and other data for any IP address. Used for fraud detection and analytics.",
        "category": "Data",
        "base_url": "https://ipinfo.io",
        "logo": "https://ipinfo.io/static/ipinfo-logo.svg",
        "plan": "Freemium",
        "rating": 4.3,
        "rating_count": 112,
        "tags": ["ip", "geolocation", "security"],
        "approved": True,
    },
    {
        "name": "APIHub Weather",
        "description": "Sandbox API for getting mock weather data for any location.",
        "category": "Weather",
        "base_url": "http://localhost:8000/api/sandbox",
        "logo": "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
        "plan": "Free",
        "rating": 5.0,
        "rating_count": 999,
        "tags": ["weather", "sandbox", "free"],
        "approved": True,
    },
    {
        "name": "APIHub Users",
        "description": "Sandbox API for generating mock user profiles for testing.",
        "category": "Data",
        "base_url": "http://localhost:8000/api/sandbox",
        "logo": "https://cdn-icons-png.flaticon.com/512/6073/6073873.png",
        "plan": "Free",
        "rating": 5.0,
        "rating_count": 999,
        "tags": ["users", "sandbox", "mock"],
        "approved": True,
    },
    {
        "name": "APIHub Products",
        "description": "Sandbox API for retrieving a mock e-commerce product catalog.",
        "category": "Data",
        "base_url": "http://localhost:8000/api/sandbox",
        "logo": "https://cdn-icons-png.flaticon.com/512/1170/1170628.png",
        "plan": "Free",
        "rating": 5.0,
        "rating_count": 999,
        "tags": ["ecommerce", "sandbox", "products"],
        "approved": True,
    },
]

async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["apihub"]

    existing = await db["api_listings"].count_documents({})
    if existing > 0:
        print(f"Already have {existing} APIs. Skipping seed.")
        client.close()
        return

    docs = []
    for api in APIS:
        docs.append({
            "_id": str(uuid.uuid4()),
            **api,
            "submitted_by": None,
            "created_at": datetime.utcnow(),
        })

    await db["api_listings"].insert_many(docs)
    print(f"Seeded {len(docs)} APIs successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())