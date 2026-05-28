# ✦ TripMind AI — Intelligent Group Travel Planner

> \*Every traveler. One perfect trip.\*

TripMind AI is an agentic travel planning assistant that takes in your group's details — ages, budget, destination, and travel dates — and instantly generates a fully personalized, day-by-day trip plan for every kind of traveler in the group.

\---

## 🧠 The Problem

Travel planning tools today are generic and one-size-fits-all. They don't account for group composition, age-specific needs, or budget constraints all at once — leaving travelers overwhelmed, underprepared, and often disappointed.

\---

## 💡 Our Solution

TripMind AI collects group details and uses **Gemini AI** to generate:

* 📅 Full day-by-day itinerary (morning, afternoon, evening)
* 🎯 Age-appropriate activities for every member
* 💰 Smart budget breakdown across accommodation, food, transport \& activities
* 🏨 Hotel/stay recommendations suited to the group
* 🍽️ Local food \& restaurant suggestions
* 🌤️ Weather-aware packing list
* 🚗 Transport recommendations per day
* 💡 Pro tips from AI

\---

## 🔄 How It Works

```
User fills form (destination, group ages, budget, dates)
        ↓
Flask backend receives the request
        ↓
OpenWeatherMap API → fetches live weather at destination
        ↓
Gemini 2.5 Flash AI → generates structured JSON itinerary
        ↓
Frontend renders beautiful day-by-day trip plan
```

\---

## 🛠️ Tech Stack

|Layer|Technology|
|-|-|
|Frontend|HTML, CSS, Vanilla JS|
|Backend|Python, Flask|
|AI Model|Google Gemini 2.5 Flash|
|Weather|OpenWeatherMap API|
|Deployment|Railway|
|Fonts|Playfair Display, DM Sans|

\---

## 🚀 Running Locally

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set your API key
set GOOGLE\_API\_KEY=your\_google\_api\_key\_here

# 3. Run the app
python app.py

# 4. Open in browser
http://localhost:5000
```

\---

## 👥 Team

\## 👥 Team Details



| Name              | Role                        |

|-------------------|-----------------------------|

| Binitha E         | Full Stack \& AI Integration |

| Vilesh S          | Frontend \& UI               |

| Rohan JC          | API \& Backend               |

| Alina Anum        | Testing \& Deployment        |



Institution: BMS Institute of Technology \& Management

Hackathon: AGENTATHON



### Trip Results

Full AI-generated itinerary with day cards, meal recommendations, hotel suggestions, packing list, and pro tips.

