// Calendario interactivo para Producción Digital I & II
class CalendarSchedule {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date(2026, 9, 1); // Octubre 2026
        
        this.events = [
            // Producción Digital I
            { start: new Date(2026, 9, 13), end: new Date(2026, 9, 15), type: 'pd1', time: '16:00 a 17:50', title: 'Producción Digital I' },
            { start: new Date(2026, 9, 19), end: new Date(2026, 9, 22), type: 'pd1', time: '16:00 a 19:00', title: 'Producción Digital I' },
            { start: new Date(2026, 9, 26), end: new Date(2026, 9, 29), type: 'pd1', time: '16:00 a 17:50', title: 'Producción Digital I' },
            { start: new Date(2026, 10, 2), end: new Date(2026, 10, 5), type: 'pd1', time: '16:00 a 20:00', title: 'Producción Digital I' },
            { start: new Date(2026, 10, 9), end: new Date(2026, 10, 12), type: 'pd1', time: '16:00 a 20:00', title: 'Producción Digital I' },
            
            // Producción Digital II
            { start: new Date(2027, 4, 3), end: new Date(2027, 4, 6), type: 'pd2', time: '16:00 a 21:00', title: 'Producción Digital II' },
            { start: new Date(2027, 4, 10), end: new Date(2027, 4, 13), type: 'pd2', time: '16:00 a 21:00', title: 'Producción Digital II' },
            { start: new Date(2027, 4, 18), end: new Date(2027, 4, 21), type: 'pd2', time: '16:00 a 21:00', title: 'Producción Digital II' },
            
            // Trabajo asíncrono
            { date: new Date(2027, 4, 6), type: 'async', time: 'Trabajo asíncrono', title: 'Trabajo asíncrono' },
            { date: new Date(2027, 4, 13), type: 'async', time: 'Trabajo asíncrono', title: 'Trabajo asíncrono' },
            { date: new Date(2027, 4, 21), type: 'async', time: 'Trabajo asíncrono', title: 'Trabajo asíncrono' },
            
            // Festivos
            { date: new Date(2027, 4, 17), type: 'holiday', title: 'Festivo' },
        ];
    }

    render() {
        this.container.innerHTML = `
            <div class="calendar-wrapper">
                <div class="calendar-header">
                    <button class="calendar-nav-btn" id="prev-month">← Anterior</button>
                    <h3 id="month-year"></h3>
                    <button class="calendar-nav-btn" id="next-month">Siguiente →</button>
                </div>
                
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="legend-color pd1"></span>
                        <span>Producción Digital I</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color pd2"></span>
                        <span>Producción Digital II</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color async"></span>
                        <span>Asíncrono</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color holiday"></span>
                        <span>Festivo</span>
                    </div>
                </div>
                
                <div class="calendar-grid" id="calendar-grid"></div>
                <div class="calendar-info" id="calendar-info"></div>
            </div>
        `;

        this.attachEventListeners();
        this.renderCalendar();
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Actualizar título
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        let calendarHTML = `
            <div class="calendar-day-header">
                <div>Dom</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sáb</div>
            </div>
            <div class="calendar-days">
        `;
        
        // Días vacíos antes del primer día
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(year, month, day);
            const dayClasses = this.getDayClasses(currentDay);
            const dayInfo = this.getDayInfo(currentDay);
            
            calendarHTML += `
                <div class="calendar-day ${dayClasses}" data-date="${currentDay.toISOString()}">
                    <div class="day-number">${day}</div>
                    ${dayInfo ? `<div class="day-marker"></div>` : ''}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        
        document.getElementById('calendar-grid').innerHTML = calendarHTML;
        
        // Agregar event listeners a los días
        document.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', (e) => this.showDayInfo(e));
            dayEl.addEventListener('mouseenter', (e) => this.showDayInfo(e));
        });
        
        // Botones de navegación
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        prevBtn.disabled = year === 2026 && month === 9; // No ir antes de octubre 2026
        nextBtn.disabled = year === 2027 && month === 4; // No ir después de mayo 2027
    }

    getDayClasses(date) {
        let classes = [];
        
        for (let event of this.events) {
            if (event.date && this.isSameDay(event.date, date)) {
                classes.push(`event-${event.type}`);
            } else if (event.start && event.end) {
                if (date >= event.start && date <= event.end) {
                    classes.push(`event-${event.type}`);
                }
            }
        }
        
        return classes.join(' ');
    }

    getDayInfo(date) {
        for (let event of this.events) {
            if (event.date && this.isSameDay(event.date, date)) {
                return event;
            } else if (event.start && event.end) {
                if (date >= event.start && date <= event.end) {
                    return event;
                }
            }
        }
        return null;
    }

    showDayInfo(event) {
        const dayEl = event.currentTarget;
        const dateStr = dayEl.getAttribute('data-date');
        const date = new Date(dateStr);
        const dayInfo = this.getDayInfo(date);
        
        const infoEl = document.getElementById('calendar-info');
        
        if (dayInfo) {
            const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateFormatted = date.toLocaleDateString('es-ES', options);
            
            let html = `
                <div class="info-box info-${dayInfo.type}">
                    <h4>${dayName[date.getDay()]} - ${dateFormatted}</h4>
                    <p><strong>${dayInfo.title}</strong></p>
            `;
            
            if (dayInfo.time) {
                html += `<p class="time">⏰ ${dayInfo.time}</p>`;
            }
            
            html += '</div>';
            infoEl.innerHTML = html;
        } else {
            infoEl.innerHTML = '';
        }
    }

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    attachEventListeners() {
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendar-schedule');
    if (calendarContainer) {
        const calendar = new CalendarSchedule('calendar-schedule');
        calendar.render();
    }
});