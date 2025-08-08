(function () {
    let descending = true;

    const btn = document.createElement('button');
    btn.textContent = 'Ordenar (↓ mais recentes)';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '10px 15px',
        zIndex: 9999,
        background: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    });
    document.body.appendChild(btn);

    function parseDate(text) {
        text = text.trim().toLowerCase();
        const now = new Date();
        const numberMatch = text.match(/\d+/);
        const number = numberMatch ? parseInt(numberMatch[0]) : 0;

        if (text.includes('hora') || text.includes('hour')) {
            return new Date(now.getTime() - number * 60 * 60 * 1000);
        }

        if (text.includes('minuto') || text.includes('minute')) {
            return new Date(now.getTime() - number * 60 * 1000);
        }

        if (text.includes('dia') || text.includes('day')) {
            return new Date(now.getTime() - number * 24 * 60 * 60 * 1000);
        }

        if (text.includes('ontem') || text.includes('yesterday')) {
            const d = new Date(now);
            d.setDate(d.getDate() - 1);
            return d;
        }

        const parts = text.split('/');
        if (parts.length === 3) {
            const [a, b, c] = parts.map(p => parseInt(p, 10));
            if (a > 12) return new Date(c, b - 1, a); // dd/mm/yyyy
            if (b > 12) return new Date(c, a - 1, b); // mm/dd/yyyy
            return new Date(c, b - 1, a); // assume dd/mm/yyyy
        }

        return now; // fallback
    }

    function parseChapter(text) {
        const match = text.match(/cap[ií]tulo\s*(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
    }

    function getInfo(tr) {
        const chapterEl = tr.querySelector('.list-chapter .chapter a');
        const dateEl = tr.querySelector('.list-chapter .post-on');

        const chapterNum = chapterEl ? parseChapter(chapterEl.textContent) : 0;
        const date = dateEl ? parseDate(dateEl.textContent) : new Date(0);

        return { chapterNum, date };
    }

    btn.addEventListener('click', () => {
        const tbody = document.querySelector('tbody');
        if (!tbody) return alert('Nenhuma <tbody> encontrada.');

        const rows = Array.from(tbody.querySelectorAll('tr')).filter(tr =>
            tr.querySelector('.mange-name')
        );

        rows.sort((a, b) => {
            const infoA = getInfo(a);
            const infoB = getInfo(b);

            if (infoA.date > infoB.date) return descending ? -1 : 1;
            if (infoA.date < infoB.date) return descending ? 1 : -1;

            return descending
                ? infoB.chapterNum - infoA.chapterNum
                : infoA.chapterNum - infoB.chapterNum;
        });

        rows.forEach(row => tbody.appendChild(row));

        descending = !descending;
        btn.textContent = descending
            ? 'Ordenar (↓ mais recentes)'
            : 'Ordenar (↑ mais antigos)';
    });
})();
