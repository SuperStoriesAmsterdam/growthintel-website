/* theme.js · Growth Intel — day / night colour setting
 *
 * Loaded in <head> WITHOUT defer, on purpose. It has to write data-theme
 * before the body paints, otherwise a night visitor sees a flash of paper
 * (and the other way round) on every page load.
 *
 * Order of precedence:
 *   1. an explicit choice, remembered in localStorage
 *   2. night
 *
 * Night is the default for everyone, deliberately. The operating system's
 * light/dark setting is NOT consulted: this is the brand's home key, and a
 * visitor on a Mac in light mode should still arrive in night. Day is
 * something you choose, not something your laptop chooses for you.
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
        return 'night';
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

    });
})();
