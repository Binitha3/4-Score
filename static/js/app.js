let memberCount = 0;

function addMember(count = 1, type = "") {
  memberCount++;
  const id = `member-${memberCount}`;
  const div = document.createElement("div");
  div.className = "member-row";
  div.id = id;
  div.innerHTML = `
    <input type="number" min="1" max="10" value="${count}" placeholder="No."/>
    <input type="text" value="${type}" placeholder="e.g. adult (age 30), child (age 8), senior (age 65)"/>
    <button class="btn-remove" onclick="removeMember('${id}')" title="Remove">×</button>
  `;
  document.getElementById("group-list").appendChild(div);
}

function removeMember(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function getGroup() {
  const rows = document.querySelectorAll(".member-row");
  const group = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    const count = parseInt(inputs[0].value) || 1;
    const type = inputs[1].value.trim();
    if (type) group.push({ count, type });
  });
  return group;
}

async function generatePlan() {
  const destination = document.getElementById("destination").value.trim();
  const days = document.getElementById("days").value;
  const budget = document.getElementById("budget").value;
  const travel_date = document.getElementById("travel_date").value;
  const group = getGroup();

  if (!destination) { alert("Please enter a destination!"); return; }
  if (!group.length) { alert("Please add at least one group member!"); return; }

  const btn = document.getElementById("plan-btn");
  const btnText = document.getElementById("btn-text");
  const btnLoader = document.getElementById("btn-loader");

  btn.disabled = true;
  btnText.classList.add("hidden");
  btnLoader.classList.remove("hidden");

  const resultDiv = document.getElementById("result");
  resultDiv.classList.add("hidden");
  resultDiv.innerHTML = "";

  try {
    const res = await fetch("/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, days, budget, travel_date, group })
    });
    const json = await res.json();

    if (json.success) {
      resultDiv.innerHTML = renderResult(json.data);
      resultDiv.classList.remove("hidden");
      resultDiv.scrollIntoView({ behavior: "smooth" });
    } else {
      resultDiv.innerHTML = `<div class="error-box">⚠️ ${json.error}</div>`;
      resultDiv.classList.remove("hidden");
    }
  } catch (e) {
    resultDiv.innerHTML = `<div class="error-box">⚠️ Network error: ${e.message}</div>`;
    resultDiv.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btnText.classList.remove("hidden");
    btnLoader.classList.add("hidden");
  }
}

function renderResult(data) {
  const { destination, days, total_budget, weather_summary, budget_breakdown,
          itinerary, accommodation, packing_list, pro_tips } = data;

  // Header
  let html = `
    <div class="result-header">
      <h2>Your ${days}-day trip to ${destination}</h2>
      <div class="meta">
        <span class="meta-pill">₹${parseInt(total_budget).toLocaleString("en-IN")} budget</span>
        <span class="meta-pill weather">🌤 ${weather_summary}</span>
        <span class="meta-pill">${days} days</span>
      </div>
    </div>
  `;

  // Budget breakdown
  if (budget_breakdown) {
    html += `<div class="card" style="margin-bottom:20px">
      <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#555;margin-bottom:16px">Budget breakdown</h2>
      <div class="budget-grid">`;
    for (const [key, val] of Object.entries(budget_breakdown)) {
      html += `<div class="budget-box">
        <div class="label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
        <div class="amount">${val}</div>
      </div>`;
    }
    html += `</div></div>`;
  }

  // Day-by-day
  (itinerary || []).forEach(day => {
    html += `
      <div class="day-card">
        <div class="day-header">
          <div>
            <div class="day-num">Day ${day.day}</div>
            <div class="day-title">${day.title}</div>
          </div>
        </div>
        <div class="day-body">
          <div class="time-slots">
            ${renderSlot("Morning", day.morning)}
            ${renderSlot("Afternoon", day.afternoon)}
            ${renderSlot("Evening", day.evening)}
          </div>
          <div class="meals-row">
            ${renderMeal("Breakfast", day.meals?.breakfast)}
            ${renderMeal("Lunch", day.meals?.lunch)}
            ${renderMeal("Dinner", day.meals?.dinner)}
          </div>
          <div class="transport-row"><span>🚗 Transport:</span> ${day.transport}</div>
        </div>
      </div>
    `;
  });

  // Accommodation
  if (accommodation) {
    html += `
      <div class="hotel-card">
        <h3>Where to stay</h3>
        <div class="hotel-name">${accommodation.name}</div>
        <div class="hotel-meta">${accommodation.type}</div>
        <div class="hotel-why">${accommodation.why}</div>
        <div class="hotel-price">${accommodation.price_range} / night</div>
      </div>
    `;
  }

  // Packing + tips
  html += `<div class="two-col">`;
  if (packing_list) {
    const allItems = [
      ...(packing_list.essentials || []),
      ...(packing_list.weather_specific || []),
      ...(packing_list.kids_items || [])
    ];
    html += `<div class="list-card">
      <h3>Packing list</h3>
      <ul>${allItems.map(i => `<li>${i}</li>`).join("")}</ul>
    </div>`;
  }
  if (pro_tips?.length) {
    html += `<div class="list-card">
      <h3>Pro tips</h3>
      ${pro_tips.map(t => `<div class="tip-item">${t}</div>`).join("")}
    </div>`;
  }
  html += `</div>`;

  return html;
}

function renderSlot(time, slot) {
  if (!slot) return "";
  return `
    <div class="slot">
      <div class="slot-time">${time}</div>
      <div class="slot-name">${slot.activity}</div>
      <div class="slot-desc">${slot.description}</div>
      <div class="slot-age">${slot.age_notes}</div>
      <div class="slot-cost">${slot.cost}</div>
    </div>
  `;
}

function renderMeal(label, text) {
  return `
    <div class="meal">
      <div class="meal-label">${label}</div>
      <div class="meal-text">${text || "—"}</div>
    </div>
  `;
}
