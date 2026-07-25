document.addEventListener("DOMContentLoaded", () => {

    const curso = window.curso;

    if (!curso) {
        console.error("No se ha encontrado window.curso");
        return;
    }

    // ====== ESTADO GLOBAL ======
    const state = {
        darkMode: localStorage.getItem('darkMode') === 'true',
        visitedSections: JSON.parse(localStorage.getItem('visitedSections') || '[]'),
        favoriteSections: JSON.parse(localStorage.getItem('favoriteSections') || '[]'),
        searchQuery: ''
    };

    // ====== INICIALIZAR MODO OSCURO ======
    if (state.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // ====== RENDERIZAR INTERFAZ PRINCIPAL ======
    renderHeader();
    renderTableOfContents();
    renderHero();
    renderContent();
    renderControls();
    attachEventListeners();

    function renderHeader() {
        const header = document.querySelector('.topbar');
        
        // Agregar controles en la esquina superior derecha
        const controls = document.createElement('div');
        controls.className = 'header-controls';
        controls.innerHTML = `
            <button id="toggle-dark-mode" class="btn-icon" title="Cambiar tema">
                <span id="dark-icon">🌙</span>
            </button>
            <input 
                type="text" 
                id="search-input" 
                class="search-box" 
                placeholder="Buscar en la guía..."
            />
        `;
        header.appendChild(controls);
    }

    function renderTableOfContents() {
        const container = document.getElementById('content');
        const toc = document.createElement('div');
        toc.id = 'table-of-contents';
        toc.className = 'toc';
        toc.innerHTML = `
            <h3>Índice</h3>
            <ul>
                ${curso.secciones.map((section, index) => `
                    <li>
                        <a href="#section-${index}" class="toc-link">
                            ${section.titulo}
                            <span class="toc-marker"></span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
        container.parentElement.insertBefore(toc, container);
    }

    // HERO

    function renderHero() {
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
    }

    // CONTENIDO

    function renderContent() {
        const container = document.getElementById("content");

        container.innerHTML = `
            <h2 class="section-title">Programa del curso</h2>
            <div id="sections-container">
                ${curso.secciones
                    .map((section, index) => renderSection(section, index))
                    .join("")}
            </div>
            <div class="section-nav">
                <button id="prev-section" class="btn-nav" disabled>← Anterior</button>
                <span id="section-counter">1 / ${curso.secciones.length}</span>
                <button id="next-section" class="btn-nav">Siguiente →</button>
            </div>
        `;
    }

    function renderSection(section, index) {

        const isVisited = state.visitedSections.includes(index);
        const isFavorite = state.favoriteSections.includes(index);
        const abierto = index === 0 ? " open" : "";

        let html = "";

        // Tarjetas
        if (section.tarjetas) {

            const columnas = section.tarjetas.length === 2
                ? "grid grid-2"
                : "grid grid-3";

            html += `<div class="${columnas}">`;

            section.tarjetas.forEach((card, cardIndex) => {

                html += `
                    <div class="card" data-card-index="${cardIndex}">

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

                html += `
                    <button class="btn-copy" title="Copiar contenido">📋</button>
                    </div>`;

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

            <details 
                class="accordion ${isVisited ? 'visited' : ''} ${isFavorite ? 'favorite' : ''}"
                id="section-${index}"
                data-section-index="${index}"
            >

                <summary>

                    <div class="summary-content">
                        <span>${section.titulo}</span>
                        <span class="icons-summary">
                            <button class="btn-favorite ${isFavorite ? 'active' : ''}" title="Marcar como favorito">⭐</button>
                        </span>
                    </div>

                    <span class="icon"></span>

                </summary>

                <div class="panel">

                    ${html}

                </div>

            </details>

        `;

    }

    function renderControls() {
        const container = document.getElementById('content');
        const controls = document.createElement('div');
        controls.className = 'view-controls';
        controls.innerHTML = `
            <label>
                <input type="checkbox" id="show-only-favorites" />
                Solo favoritos
            </label>
            <label>
                <input type="checkbox" id="show-visited" />
                Marcar visitadas
            </label>
        `;
        container.parentElement.insertBefore(controls, container);
    }

    function attachEventListeners() {
        
        // Dark mode toggle
        document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);

        // Search
        document.getElementById('search-input').addEventListener('input', handleSearch);

        // Favorite buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-favorite')) {
                e.stopPropagation();
                const section = e.target.closest('.accordion');
                const index = parseInt(section.dataset.sectionIndex);
                toggleFavorite(index);
            }
        });

        // Copy buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-copy')) {
                e.stopPropagation();
                const card = e.target.closest('.card');
                copyCardContent(card);
            }
        });

        // Mark sections as visited
        document.addEventListener('toggle', (e) => {
            if (e.target.classList.contains('accordion')) {
                const index = parseInt(e.target.dataset.sectionIndex);
                if (e.target.open && !state.visitedSections.includes(index)) {
                    state.visitedSections.push(index);
                    localStorage.setItem('visitedSections', JSON.stringify(state.visitedSections));
                    e.target.classList.add('visited');
                }
                updateSectionNav();
            }
        });

        // Navigation between sections
        document.getElementById('prev-section').addEventListener('click', navigatePrevious);
        document.getElementById('next-section').addEventListener('click', navigateNext);

        // TOC links
        document.querySelectorAll('.toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                target.scrollIntoView({ behavior: 'smooth' });
                if (!target.open) target.open = true;
            });
        });

        // Filtro de favoritos
        document.getElementById('show-only-favorites').addEventListener('change', (e) => {
            filterSections(e.target.checked ? 'favorites' : null);
        });

        // Mostrar visited
        document.getElementById('show-visited').addEventListener('change', (e) => {
            document.getElementById('sections-container').classList.toggle('show-visited', e.target.checked);
        });
    }

    function toggleDarkMode() {
        state.darkMode = !state.darkMode;
        localStorage.setItem('darkMode', state.darkMode);
        document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
        document.getElementById('dark-icon').textContent = state.darkMode ? '☀️' : '🌙';
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase();
        state.searchQuery = query;

        const sections = document.querySelectorAll('.accordion');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const matches = text.includes(query);
            
            if (query === '') {
                section.style.display = '';
                section.classList.remove('highlight-search');
            } else if (matches) {
                section.style.display = '';
                section.classList.add('highlight-search');
                if (!section.open) section.open = true;
            } else {
                section.style.display = 'none';
            }
        });
    }

    function toggleFavorite(index) {
        const idx = state.favoriteSections.indexOf(index);
        if (idx === -1) {
            state.favoriteSections.push(index);
        } else {
            state.favoriteSections.splice(idx, 1);
        }
        localStorage.setItem('favoriteSections', JSON.stringify(state.favoriteSections));
        
        const section = document.querySelector(`[data-section-index="${index}"]`);
        const btn = section.querySelector('.btn-favorite');
        section.classList.toggle('favorite');
        btn.classList.toggle('active');
    }

    function copyCardContent(card) {
        const text = card.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const btn = card.querySelector('.btn-copy');
            const originalText = btn.textContent;
            btn.textContent = '✅';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1500);
        });
    }

    function navigatePrevious() {
        const sections = document.querySelectorAll('.accordion');
        for (let i = sections.length - 1; i >= 0; i--) {
            if (sections[i].style.display !== 'none') {
                sections[i].scrollIntoView({ behavior: 'smooth' });
                if (!sections[i].open) sections[i].open = true;
                return;
            }
        }
    }

    function navigateNext() {
        const sections = document.querySelectorAll('.accordion');
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].style.display !== 'none') {
                sections[i].scrollIntoView({ behavior: 'smooth' });
                if (!sections[i].open) sections[i].open = true;
                return;
            }
        }
    }

    function updateSectionNav() {
        const sections = document.querySelectorAll('.accordion');
        let visibleIndex = 0;
        let totalVisible = 0;

        sections.forEach((section, i) => {
            if (section.style.display !== 'none') {
                totalVisible++;
                if (section.open) visibleIndex = totalVisible;
            }
        });

        const counter = document.getElementById('section-counter');
        if (counter) counter.textContent = `${visibleIndex} / ${totalVisible}`;
    }

    function filterSections(filter) {
        const sections = document.querySelectorAll('.accordion');
        sections.forEach(section => {
            if (filter === 'favorites') {
                section.style.display = state.favoriteSections.includes(parseInt(section.dataset.sectionIndex)) ? '' : 'none';
            } else {
                section.style.display = '';
            }
        });
    }

});
