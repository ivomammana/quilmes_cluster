const SPREADSHEET_ID = "1Bf1pOOSn-nCrGlalyHqA8u6End_0iVsv10Na-AI42v0";

const params = new URLSearchParams(window.location.search);
const sheetName = params.get("sheet");

if (!sheetName) {
  document.getElementById("gameTitle").innerText = "Game no especificado";
} else {
  document.getElementById("gameTitle").innerText = sheetName;
  loadGameSheet(sheetName);
}

function goBack() {
  window.history.back();
}

async function loadGameSheet(sheet) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${encodeURIComponent(sheet)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    renderFullGameTable(rows);

  } catch (error) {
    document.getElementById("gameContent").innerHTML =
      "<p>Error cargando el partido.</p>";
    console.error(error);
  }
}

function renderFullGameTable(rows) {
  const container = document.getElementById("gameContent");

  if (!rows || !rows.length) {
    container.innerHTML = "<p>No hay datos disponibles.</p>";
    return;
  }

  // ✅ EXTRAER A1 COMO NOMBRE DE CANCHA
  const courtName = rows[0]?.c?.[0]?.v ?? "";

  const columns = Array.from({ length: 16 }, (_, i) => i);

  function renderHeader() {
  return `
    <colgroup>
      <col style="width:18%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
      <col style="width:6%">
    </colgroup>
    <tr class="header-row">
      <th>Player</th>
      <th>ID</th>
      <th>PTS</th>
      <th>REBS</th>
      <th>ASSISTS</th>
      <th>STEALS</th>
      <th>BLOCKS</th>
      <th>2 PTM</th>
      <th>2 PTA</th>
      <th>2PT %</th>
      <th>3 PTM</th>
      <th>3 PTA</th>
      <th>3PT %</th>
      <th>TO</th>
      <th>Jugado</th>
      <th>WIN</th>
    </tr>
  `;
}


  let html = "";

  // ✅ MOSTRAR CANCHA ARRIBA DE LA TABLA
  if (courtName) {
    html += `<h2 class="court-name">${courtName}</h2>`;
  }

  let currentTableOpen = false;

  // ✅ EMPEZAR DESDE LA FILA 1 (SALTAMOS A1)
  rows.slice(1).forEach(row => {
    const firstCell = (row.c?.[0]?.v ?? "").toString().toLowerCase();

    // Ignorar filas irrelevantes
    if (
      firstCell === "" ||
      firstCell === "claros" ||
      firstCell === "oscuros" ||
      firstCell.includes("player")
    ) {
      return;
    }

    // Si encontramos Totals
    if (firstCell.includes("total")) {
      html += "<tr class='total-row'>";

      columns.forEach(colIndex => {
        let value = row.c?.[colIndex]?.v ?? "";

        if (colIndex === 9 || colIndex === 12) {
          value = parseFloat(value);
          value = formatPercentage(value);
        }

        html += `<td>${value}</td>`;
      });

      html += "</tr>";
      html += "</table>";
      currentTableOpen = false;
      return;
    }

    // Abrir nueva tabla si no hay una abierta
    if (!currentTableOpen) {
      html += `<table class="game-table">`;
      html += renderHeader();
      currentTableOpen = true;
    }

    html += "<tr>";

    columns.forEach(colIndex => {
      let value = row.c?.[colIndex]?.v ?? "";

      // Formatear columnas de porcentaje
      if (colIndex === 9 || colIndex === 12) {
        value = parseFloat(value);
        value = formatPercentage(value);
      }

      html += `<td>${value}</td>`;
    });

    html += "</tr>";
  });

  // Cerrar tabla si quedó abierta
  if (currentTableOpen) {
    html += "</table>";
  }

  container.innerHTML = html;
}

function formatPercentage(value) {
  if (isNaN(value)) return "";

  if (value <= 1) {
    return (value * 100).toFixed(1) + "%";
  }

  return value.toFixed(1) + "%";
}
