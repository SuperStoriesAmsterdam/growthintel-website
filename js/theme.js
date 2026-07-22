/* theme.js · Growth Intel — day / night colour setting
 *
 * Loaded in <head> WITHOUT defer, on purpose. It has to write data-theme
 * before the body paints, otherwise a night visitor sees a flash of paper
 * (and the other way round) on every page load.
 *
 * Order of precedence:
 *   1. an explicit choice, remembered in localStorage
 *   2. the operating system's setting
 *   3. night, which is the brand's home key
 *
 * An explicit choice always writes data-theme, so the rest of the CSS and the
 * toggle's own label never have to guess what is currently showing.
 */
(function () {
    var KEY = 'gi-theme';
    var root = document.documentElement;

    function resolve() {
        try {
            var saved = localStorage.getItem(KEY);
            if (saved === 'day' || saved === 'night') return saved;
        } catch (e) { /* private mode, fall through */ }
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night';
    }

    function apply(mode) {
        root.setAttribute('data-theme', mode);
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        var isNight = mode === 'night';
        btn.setAttribute('aria-label', isNight ? 'Switch to day mode' : 'Switch to night mode');
        var label = btn.querySelector('.theme-label');
        if (label) label.textContent = isNight ? 'Night' : 'Day';
    }

    /* Before paint */
    apply(resolve());

    document.addEventListener('DOMContentLoaded', function () {
        apply(root.getAttribute('data-theme'));

        var btn = document.getElementById('themeToggle');
        if (btn) {
            btn.addEventListener('click', function () {
                var next = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
                try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
                apply(next);
            });
        }

        /* Follow the system if the visitor has never chosen for themselves */
        var mq = window.matchMedia('(prefers-color-scheme: light)');
        var onChange = function (e) {
            var chosen = null;
            try { chosen = localStorage.getItem(KEY); } catch (err) { /* ignore */ }
            if (!chosen) apply(e.matches ? 'day' : 'night');
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    });
})();
