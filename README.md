# ✈ TripMind AI — Intelligent Group Travel Planner

An AI-powered travel planning assistant that generates fully personalized trip plans for groups of any composition — kids, teens, adults, seniors — all at once.

## 🚀 Setup (5 minutes)

### 1. Clone & install
```bash
cd tripmind
pip install -r requirements.txt
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your keys
```

You need:
- `ANTHROPIC_API_KEY` → get from https://console.anthropic.com
- `OPENWEATHER_API_KEY` → free at https://openweathermap.org/api (optional, works without it)

### 3. Run locally
```bash
python app.py
```
Open http://localhost:5000

---

## 🏗 Project Structure

```
tripmind/
├── app.py                  # Flask backend + Claude API + Weather API
├── requirements.txt
├── Procfile                # For Railway/Render deployment
├── .env.example
├── templates/
│   └── index.html          # Main UI
└── static/
    ├── css/style.css       # All styles
    └── js/app.js           # Form logic + result rendering
```

---

## 🌐 Deploy to Railway (free, 5 mins on hackathon day)

1. Push to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard
4. Done — live URL in 2 minutes

---

## 👥 Team task split for hackathon day

| Person | Task |
|--------|------|
| You | Already done ✅ — backend, API, UI |
| Person 2 | PDF export button (use `jsPDF` library) |
| Person 3 | "Share trip" feature — copy link or WhatsApp share |
| Person 4 | Presentation slides + demo script |

---

## 💡 Demo script (for judges)

1. Enter: **Goa**, 4 days, ₹50,000, travel date next week
2. Group: 1 child (5), 2 teens (15), 2 adults (38), 2 seniors (63)
3. Hit **Generate** → show full day-by-day plan
4. Point out: age-appropriate activities, budget breakdown, packing list, pro tips
5. Show weather integration

---

## 🔧 How it works

```
User fills form
      ↓
Flask receives group details
      ↓
OpenWeatherMap API → current weather at destination
      ↓
Claude API (Sonnet) → structured JSON itinerary
      ↓
JavaScript renders beautiful day-by-day plan
```
