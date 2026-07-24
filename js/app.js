document.addEventListener("DOMContentLoaded", () => {

    const curso = window.curso;

    if (!curso) {
        console.error("No se ha encontrado window.curso");
        return;
    }

    // HERO

    document.getElementById("hero-title").innerHTML = curso.hero.titulo;
    document.getElementById("hero-subtitle").textContent = curso.hero.subtitulo;

    document.getElementById("hero-pills").innerHTML =
        curso.hero.pills
            .map(pill => `<span class="pill">${pill}</span>`)
            .join("");

    document.getElementById("hero-stats").innerHTML =
        curso.hero.stats
            .map(stat => `
                <div class="stat">
                    <span class="k">${stat.valor}</span>
                    <span class="l">${stat.texto}</span>
                </div>
            `)
            .join("");

    // CONTENIDO

    const container = document.getElementById("content");

    container.innerHTML = `
        <h2 class="section-title">Programa del curso</h2>
        ${curso.secciones
            .map((section, index) => renderSection(section, index))
            .join("")}
    `;

});


function renderSection(section, index) {

    const abierto = index === 0 ? " open" : "";

    let html = "";

    // Tarjetas

    if (section.tarjetas) {

        const columnas = section.tarjetas.length === 2
            ? "grid grid-2"
            : "grid grid-3";

        html += `<div class="${columnas}">`;

        section.tarjetas.forEach(card => {

            html += `
                <div class="card">

                    <h3>${card.titulo}</h3>
            `;

            if (card.texto) {

                html += `<p>${card.texto}</p>`;

            }

            if (card.lista) {

                html += `<ul class="list">`;

                card.lista.forEach(item => {

                    html += `<li>${item}</li>`;

                });

                html += `</ul>`;

            }

            html += `</div>`;

        });

        html += `</div>`;

    }

    // Caja extra

    if (section.extra) {

        html += `
            <div class="card full">

                <h3>${section.extra.titulo}</h3>

                <p>${section.extra.texto}</p>

            </div>
        `;

    }

    // Timeline

    if (section.timeline) {

        html += `<div class="timeline">`;

        section.timeline.forEach(step => {

            html += `
                <div class="step">

                    <div class="n">${step.numero}</div>

                    <div>

                        <div class="t">${step.titulo}</div>

                        <div class="d">${step.texto}</div>

                    </div>

                </div>
            `;

        });

        html += `</div>`;

    }

    // Cierre

    if (section.cierre) {

        html += `
            <div class="card full">

                <p class="quote">

                    ${section.cierre}

                </p>

            </div>
        `;

    }

    return `

        <details class="accordion"${abierto}>

            <summary>

                <span>${section.titulo}</span>

                <span class="icon"></span>

            </summary>

            <div class="panel">

                ${html}

            </div>

        </details>

    `;

}
