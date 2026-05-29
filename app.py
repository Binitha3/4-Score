import os
import json
import requests
from google import genai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
import os
from google import genai

api_key = os.getenv("GOOGLE_API_KEY")

client = genai.Client(api_key=api_key)

WEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY", "")

def get_weather(destination):
    if not WEATHER_API_KEY:
        return {
            "description": "Sunny and warm",
            "temp": 30,
            "note": "API key missing"
        }

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={destination}&appid={WEATHER_API_KEY}&units=metric"

        res = requests.get(url, timeout=5)

        print(res.status_code)
        print(res.text)

        data = res.json()

        return {
            "description": data["weather"][0]["description"].capitalize(),
            "temp": round(data["main"]["temp"]),
            "humidity": data["main"]["humidity"],
            "note": "Live weather data"
        }

    except Exception as e:
        print("ERROR:", e)

        return {
            "description": "Weather unavailable",
            "temp": "--",
            "note": str(e)
        }


def build_prompt(destination, group, budget, days, weather):
    group_str = ", ".join([f"{a['count']} {a['type']}" for a in group])
    return f"""You are TripMind, an expert AI travel planner specializing in personalized group travel.

Plan a {days}-day trip to {destination} for a group of: {group_str}.
Total budget: ₹{budget}
Weather: {weather['description']}, ~{weather['temp']}°C

Return ONLY a valid JSON object (no markdown, no explanation, no code fences) with this exact structure:
{{
  "destination": "{destination}",
  "days": {days},
  "total_budget": "{budget}",
  "weather_summary": "{weather['description']} at {weather['temp']}°C",
  "budget_breakdown": {{
    "accommodation": "₹XXXX",
    "food": "₹XXXX",
    "transport": "₹XXXX",
    "activities": "₹XXXX"
  }},
  "itinerary": [
    {{
      "day": 1,
      "title": "Catchy day title",
      "morning": {{
        "activity": "Activity name",
        "description": "2 sentence description",
        "age_notes": "Why this works for the group ages",
        "cost": "₹XXX per person"
      }},
      "afternoon": {{
        "activity": "Activity name",
        "description": "2 sentence description",
        "age_notes": "Why this works for the group ages",
        "cost": "₹XXX per person"
      }},
      "evening": {{
        "activity": "Activity name",
        "description": "2 sentence description",
        "age_notes": "Why this works for the group ages",
        "cost": "₹XXX per person"
      }},
      "meals": {{
        "breakfast": "Restaurant/place name and dish",
        "lunch": "Restaurant/place name and dish",
        "dinner": "Restaurant/place name and dish"
      }},
      "transport": "How to get around this day"
    }}
  ],
  "accommodation": {{
    "name": "Hotel/resort name",
    "type": "Type of stay",
    "why": "Why it suits this group",
    "price_range": "₹XXXX"
  }},
  "packing_list": {{
    "essentials": ["item1", "item2"],
    "weather_specific": ["item1", "item2"],
    "kids_items": ["item1", "item2"]
  }},
  "pro_tips": ["tip1", "tip2", "tip3"]
}}

Be specific to {destination}. Activities MUST be age-appropriate for the group. Keep within ₹{budget} budget. Be practical and realistic. Return ONLY the JSON, nothing else."""


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/plan", methods=["POST"])
def plan():
    try:
        data = request.json
        destination = data.get("destination", "Goa")
        days = int(data.get("days", 4))
        budget = data.get("budget", "50000")
        group_members = data.get("group", [])

        weather = get_weather(destination)
        prompt = build_prompt(destination, group_members, budget, days, weather)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        raw = response.text.strip()

        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]
            raw = raw.rsplit("```", 1)[0]

        itinerary = json.loads(raw)
        itinerary["weather"] = weather
        return jsonify({"success": True, "data": itinerary})

    except json.JSONDecodeError as e:
        return jsonify({"success": False, "error": f"Failed to parse itinerary: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)
