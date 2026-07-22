/* site.js · Growth Intel: scroll-reveal + beta application form */
(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Scroll reveal ---- */
    if ('IntersectionObserver' in window && !reduce) {
        var sel = '.section-label, .section-title, .section-intro, .step, .board-item, .board-value, .conversation-exchange, .testimonial, .pricing-card, .pilot-description, .about-block, .lead-prose, .compare, .pull-quote, .scope-item, .not-block, .value-maths, .pillar, .trap-list, .trap-close, .timeline-step, .timeline-close, .hero-content > *, .council-panel';
        var els = Array.prototype.slice.call(document.querySelectorAll(sel));
        ['.step', '.board-item', '.testimonial', '.pricing-card', '.scope-item', '.pillar', '.timeline-step', '.seat'].forEach(function (s) {
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
