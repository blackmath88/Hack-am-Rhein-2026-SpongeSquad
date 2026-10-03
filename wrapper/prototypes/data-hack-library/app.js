const cardsEl = document.querySelector("#cards");
const detailEl = document.querySelector("#detail");

const data = await fetch("./hacks.json").then((res) => {
  if (!res.ok) throw new Error(`Could not load hacks.json: ${res.status}`);
  return res.json();
});

let selected = data.hacks[0]?.id ?? null;

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderCards() {
  cardsEl.innerHTML = data.hacks.map((hack) => `
    <button class="card" type="button" data-id="${esc(hack.id)}" aria-pressed="${hack.id === selected}">
      <div class="num">HACK ${esc(hack.number)}</div>
      <h3>${esc(hack.title)}</h3>
      <p>${esc(hack.strapline)}</p>
    </button>
  `).join("");

  cardsEl.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      selected = card.dataset.id;
      render();
    });
  });
}

function field(label, body) {
  return `<div class="field"><div class="field-label">${esc(label)}</div>${body}</div>`;
}

function renderDetail() {
  const hack = data.hacks.find((item) => item.id === selected);
  if (!hack) {
    detailEl.innerHTML = '<div class="detail-empty">Select a data hack.</div>';
    return;
  }

  detailEl.innerHTML = `
    <div class="detail-head">
      <div>
        <div class="eyebrow">Hack ${esc(hack.number)}</div>
        <h3>${esc(hack.title)}</h3>
      </div>
      <div class="badge">candidate evidence</div>
    </div>
    <div class="contract">
      ${field("Data gap", `<p>${esc(hack.gap)}</p>`)}
      ${field("Hack / method", `<p>${esc(hack.method)}</p>`)}
      ${field("Inputs", `<div class="tags">${hack.inputs.map((v) => `<span class="tag">${esc(v)}</span>`).join("")}</div>`)}
      ${field("Candidate output", `<p>${esc(hack.output)}</p>`)}
      ${field("Confidence", `<p>${esc(hack.confidence)}</p>`)}
      ${field("Validation", `<p>${esc(hack.validation)}</p>`)}
      ${field("Gatekeeper", `<p>${esc(hack.gatekeeper)}</p>`)}
      ${field("Explicit limit", `<p>${esc(hack.limit)}</p>`)}
      ${field("Next action", `<p>${esc(hack.next_action)}</p>`)}
    </div>
  `;
}

function render() {
  renderCards();
  renderDetail();
}

render();
