
document.addEventListener("DOMContentLoaded", () => {
  const curso = window.curso;
  if (!curso) return;

  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle = document.getElementById("hero-subtitle");
  const heroPills = document.getElementById("hero-pills");
  const heroStats = document.getElementById("hero-stats");
  const content = document.getElementById("content");

  heroTitle.innerHTML = curso.hero.titulo;
  heroSubtitle.textContent = curso.hero.subtitulo;

  heroPills.innerHTML = curso.hero.pills
    .map((pill) => `<span class="pill">${pill}</span>`)
    .join("");

  heroStats.innerHTML = curso.hero.stats
    .map(
      (stat) => `
        <div class="stat">
          <span class="k">${stat.valor}</span>
          <span class="l">${stat.texto}</span>
        </div>`
    )
    .join("");

  content.innerHTML = `
    <h2 class="section-title">Contenido</h2>
    ${curso.secciones.map(renderSection).join("")}
  `;

  function renderSection(section) {
    const openAttr = " open";
    const body = [];

    if (section.tarjetas?.length) {
      const gridClass = section.tarjetas.length === 2 ? "grid grid-2" : "grid grid-3";
      body.push(`<div class="${gridClass}">`);
      section.tarjetas.forEach((card) => {
        body.push(`<div class="card">`);
        body.push(`<h3>${card.titulo}</h3>`);
        if (card.texto) body.push(`<p>${card.texto}</p>`);
        if (card.lista) {
          body.push(`<ul class="list">`);
          card.lista.forEach((item) => body.push(`<li>${item}</li>`));
          body.push(`</ul>`);
        }
        body.push(`</div>`);
      });
      body.push(`</div>`);
    }

    if (section.extra) {
      body.push(`<div class="section-spacer"></div>`);
      body.push(`<div class="card full"><h3>${section.extra.titulo}</h3><p>${section.extra.texto}</p></div>`);
    }

    if (section.timeline?.length) {
      body.push(`<div class="timeline">`);
      section.timeline.forEach((step) => {
        body.push(`
          <div class="step">
            <div class="n">${step.numero}</div>
            <div>
              <div class="t">${step.titulo}</div>
              <div class="d">${step.texto}</div>
            </div>
          </div>
        `);
      });
      body.push(`</div>`);
    }

    if (section.cierre) {
      body.push(`<div class="card full"><p class="quote">${section.cierre}</p></div>`);
    }

    return `
      <details class="accordion"${openAttr}>
        <summary><span>${section.titulo}</span><span class="icon"></span></summary>
        <div class="panel">
          ${body.join("")}
        </div>
      </details>
    `;
  }
});
