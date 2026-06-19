/* site.js · Growth Intel: scroll-reveal + the live council demo */
(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Scroll reveal ---- */
    if ('IntersectionObserver' in window && !reduce) {
        var sel = '.section-label, .section-title, .section-intro, .step, .voice-item, .board-item, .board-value, .conversation-exchange, .pricing-card, .pilot-description, .about-block, .council-board, .hero-content > *';
        var els = Array.prototype.slice.call(document.querySelectorAll(sel));
        ['.step', '.voice-item', '.board-item', '.pricing-card'].forEach(function (s) {
            Array.prototype.forEach.call(document.querySelectorAll(s), function (el, i) {
                el.style.transitionDelay = (i * 0.08) + 's';
            });
        });
        els.forEach(function (el) { el.classList.add('reveal'); });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ---- Live council demo ---- */
    var dataEl = document.getElementById('councilData');
    var tabsEl = document.getElementById('cbTabs');
    var feedEl = document.getElementById('cbFeed');
    var section = document.getElementById('council');
    if (!dataEl || !tabsEl || !feedEl || !section) return;

    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var advisors = data.advisors || [];
    if (!advisors.length) return;

    var current = -1, timers = [], typer = null;

    advisors.forEach(function (a, i) {
        var b = document.createElement('button');
        b.className = 'cb-tab';
        b.type = 'button';
        b.textContent = a.seat || a.name;
        b.addEventListener('click', function () { play(i, true); });
        tabsEl.appendChild(b);
    });

    function clearTimers() {
        timers.forEach(clearTimeout); timers = [];
        if (typer) { clearInterval(typer); typer = null; }
    }
    function setActive(i) {
        Array.prototype.forEach.call(tabsEl.children, function (b, bi) {
            b.classList.toggle('is-active', bi === i);
        });
    }

    function play(i, manual) {
        clearTimers();
        current = i;
        setActive(i);
        var a = advisors[i];
        feedEl.innerHTML = '';

        var u = document.createElement('div');
        u.className = 'cb-msg user';
        u.textContent = a.q;
        feedEl.appendChild(u);

        var adv = document.createElement('div');
        adv.className = 'cb-msg advisor';
        var nm = document.createElement('span');
        nm.className = 'cb-name';
        nm.textContent = a.name;
        var tx = document.createElement('span');
        tx.className = 'cb-text';
        adv.appendChild(nm);
        adv.appendChild(tx);
        feedEl.appendChild(adv);

        if (reduce) {
            tx.textContent = a.a;
            return;
        }

        var cursor = document.createElement('span');
        cursor.className = 'cb-cursor';
        adv.appendChild(cursor);

        var full = a.a, n = 0;
        timers.push(setTimeout(function () {
            typer = setInterval(function () {
                n++;
                tx.textContent = full.slice(0, n);
                if (n >= full.length) {
                    clearInterval(typer); typer = null;
                    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
                    if (!manual) timers.push(setTimeout(next, 3400));
                }
            }, 28);
        }, 500));
    }

    function next() { play((current + 1) % advisors.length, false); }

    var started = false;
    if ('IntersectionObserver' in window) {
        var io2 = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting && !started) { started = true; play(0, false); }
            });
        }, { threshold: 0.3 });
        io2.observe(section);
    } else {
        play(0, reduce);
    }
})();

/* Beta application form, interim mailto delivery (swap to GHL later) */
(function () {
    var form = document.getElementById('betaForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var to = form.getAttribute('data-recipient') || '';
        var subject = form.getAttribute('data-subject') || 'Growth Intel application';
        var get = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
        var body = 'Name: ' + get('name') + '\nEmail: ' + get('email') + '\n\n' + get('pitch');
        var note = document.getElementById('betaFormNote');
        if (note) note.hidden = false;
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
})();
