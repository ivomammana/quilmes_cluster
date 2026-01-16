const SPREADSHEET_ID = "1Bf1pOOSn-nCrGlalyHqA8u6End_0iVsv10Na-AI42v0";
const params = new URLSearchParams(window.location.search);
const sheetName = params.get("player");
const [numberFromUrl, ...nameParts] = sheetName.split(" ");
const playerNameFromUrl = nameParts.join(" ");

console.log("Jugador seleccionado:", sheetName);

function loadPlayerAverages() {
  if (!sheetName) return;

  const url =
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;
      console.log("TOTAL FILAS:", rows.length);

rows.forEach((row, i) => {
  const valores = row.c?.map((c, j) =>
    c && c.v !== null ? `[${j}] ${c.v}` : null
  ).filter(Boolean);

  if (valores?.length) {
    console.log(`Fila ${i}:`, valores.join(" | "));
  }
});

      // B8:B9 nombre | B10 ID

      
const playerId = rows[3]?.c[1]?.v || "";
const photoElement = document.querySelector(".player-photo");

if (playerId) {
  photoElement.style.backgroundImage = `url("assets/players/${playerId}.png")`;
} else {
  photoElement.style.backgroundImage = "none";
}
document.getElementById("playerName").textContent = playerNameFromUrl;
document.getElementById("playerId").textContent = numberFromUrl;






// ===== PROMEDIOS =====
// Fila 0
const pts     = rows[0]?.c[4]?.v ?? 0;
const rebs    = rows[1]?.c[4]?.v ?? 0;
const assists = rows[2]?.c[4]?.v ?? 0;
const steals  = rows[0]?.c[6]?.v ?? 0;

// Fila 1
const blocks    = rows[1]?.c[6]?.v ?? 0;
const turnovers = rows[2]?.c[6]?.v ?? 0;
const played    = rows[1]?.c[11]?.v ?? 0;

// Fila 2
const twoPtPct   = rows[2]?.c[8]?.v ?? 0;
const threePtPct = rows[2]?.c[10]?.v ?? 0;

// 👉 EFICIENCIA (L8)
const efficiency = rows[2]?.c[11]?.v ?? 0;

console.log("EFICIENCIA (L8):", efficiency);

// FORMATEO DE DECIMALES
function formatStat(value, decimals = 1) {
  return Number(value).toFixed(decimals);
}

function formatPct(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

function formatInt(value) {
  return Math.round(value);
}


document.getElementById("averagesGrid").innerHTML = `
  <div>
    <strong>PTS</strong>
    <span class="stat-value">${formatStat(pts)}</span>
  </div>

  <div>
    <strong>REB</strong>
    <span class="stat-value">${formatStat(rebs)}</span>
  </div>

  <div>
    <strong>ASS</strong>
    <span class="stat-value">${formatStat(assists)}</span>
  </div>

  <div>
    <strong>STL</strong>
    <span class="stat-value">${formatStat(steals)}</span>
  </div>

  <div>
    <strong>BLK</strong>
    <span class="stat-value">${formatStat(blocks)}</span>
  </div>

  <div>
    <strong>TO</strong>
    <span class="stat-value">${formatStat(turnovers)}</span>
  </div>

  <div>
    <strong>2PT%</strong>
    <span class="stat-value">${formatPct(twoPtPct)}</span>
  </div>

  <div>
    <strong>3PT%</strong>
    <span class="stat-value">${formatPct(threePtPct)}</span>
  </div>

  <div>
    <strong>EFF</strong>
    <span class="stat-value">${formatStat(efficiency)}</span>
  </div>

  <div>
    <strong>PLAYED</strong>
    <span class="stat-value">${formatInt(played)}</span>
  </div>
`;




// ===== TABLA DE PARTIDOS =====
const table = document.getElementById("gamesTable");
const thead = table.querySelector("thead");
const tbody = table.querySelector("tbody");
const allGames = [];


thead.innerHTML = `
  <tr>
    <th>GAME</th>
    <th>PTS</th>
    <th>REB</th>
    <th>ASS</th>
    <th>STL</th>
    <th>BLK</th>
    <th>2PT%</th>
    <th>3PT%</th>
    <th>TO</th>
  </tr>
`;


tbody.innerHTML = "";


let lastGameName = "";



for (let i = 0; i < rows.length; i++) {
  const row = rows[i]?.c;
  if (!row) continue;



  // Nombre del partido (puede venir combinado)
  if (row[0]?.v) {
    lastGameName = row[0].v;
  }

  // Si no hay partido aún, seguimos
  if (!lastGameName) continue;

  const pts = row[1]?.v;

  // 🔴 CLAVE: si no hay PTS, no es una fila de partido
  if (pts === null || pts === undefined) continue;

  const rebs = row[2]?.v ?? 0;
  const assists = row[3]?.v ?? 0;
  const steals = row[4]?.v ?? 0;
  const blocks = row[5]?.v ?? 0;
  const twoPtPct = row[8]?.v ?? 0;
  const threePtPct = row[11]?.v ?? 0;
  const turnovers = row[12]?.v ?? 0;





const tr = document.createElement("tr");
tr.innerHTML = `
  <td>${lastGameName}</td>
  <td>${pts}</td>
  <td>${rebs}</td>
  <td>${assists}</td>
  <td>${steals}</td>
  <td>${blocks}</td>
  <td>${formatPct(twoPtPct)}</td>
  <td>${formatPct(threePtPct)}</td>
  <td>${turnovers}</td>
`;


  tbody.appendChild(tr);
}


         })
    .catch(err => {
      console.error("Error cargando hoja del jugador:", err);
    });
}

function formatPct(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

loadPlayerAverages();

// ===== DEBUG PARTIDOS =====

// Encabezados (fila 12 → index 11)
const headersRow = rows[11]?.c;
console.log("HEADERS:", headersRow?.map(c => c?.v));

// Primer partido (fila 13 → index 12)
const firstGameRow = rows[12]?.c;
console.log("GAME 1:", firstGameRow?.map(c => c?.v));