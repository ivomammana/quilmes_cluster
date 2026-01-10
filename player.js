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


document.getElementById("averagesGrid").innerHTML = `
  <div>
    <strong>PTS</strong>
    <span class="stat-value">${pts}</span>
  </div>

  <div>
    <strong>REB</strong>
    <span class="stat-value">${rebs}</span>
  </div>

  <div>
    <strong>ASS</strong>
    <span class="stat-value">${assists}</span>
  </div>

  <div>
    <strong>STL</strong>
    <span class="stat-value">${steals}</span>
  </div>

  <div>
    <strong>BLK</strong>
    <span class="stat-value">${blocks}</span>
  </div>

  <div>
    <strong>TO</strong>
    <span class="stat-value">${turnovers}</span>
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
    <strong>PLAYED</strong>
    <span class="stat-value">${played}</span>
  </div>
`;

         })
    .catch(err => {
      console.error("Error cargando hoja del jugador:", err);
    });
}

function formatPct(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

loadPlayerAverages();