function loadRanking() {
  const url =
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq` +
    `?tqx=out:json&sheet=ranking`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;

      const container = document.getElementById("rankingCards");
      if (!container) {
        console.error("❌ No existe #rankingCards en el HTML");
        return;
      }

      container.innerHTML = "";

      rows.forEach(row => {
        const estadistica = row.c[0]?.v;
        const nombre = row.c[1]?.v;
        const cleanName = nombre.replace(/^#\d+\s*/, "");

        const valor = row.c[2]?.v;
        let displayValue = valor;

// Si es porcentaje, convertir a %
if (estadistica === "2PT%" || estadistica === "3PT%") {
  displayValue = `${(valor * 100).toFixed(1)}%`;
}

        if (!estadistica || !nombre || valor == null) return;

        // Extrae ID desde "#20 MANU"
        const playerId = nombre.match(/#(\d+)/)?.[1];
        if (!playerId) return;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <img src="assets/players/${playerId}.png"
               alt="${nombre}"
               class="player-photo">
         <h3>${cleanName}</h3>
          <p class="stat">${estadistica}</p>
          <p class="value">${displayValue}</p>

        `;

        card.addEventListener("click", () => {
          window.location.href =
            `player.html?player=${encodeURIComponent(nombre)}`;
        });

        container.appendChild(card);
      });
    })
    .catch(err => console.error("Error ranking:", err));
}

document.addEventListener("DOMContentLoaded", loadRanking);


