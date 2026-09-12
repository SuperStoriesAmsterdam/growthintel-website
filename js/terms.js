/* terms.js · Growth Intel: acceptance form for the Software Use terms.
   Interim mailto delivery, mirroring site.js (swap to a backend later). */
(function () {
    var form = document.getElementById('acceptForm');
    if (!form) return;

    /* Stamp today's date into the read-only date field. */
    var dateInput = form.querySelector('[name="date"]');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var to = form.getAttribute('data-recipient') || '';
        var subject = form.getAttribute('data-subject') || 'Growth Intel — terms accepted';
        var get = function (n) {
            var el = form.querySelector('[name="' + n + '"]');
            return el ? el.value.trim() : '';
        };
        var body =
            'Software Use and Responsibility Terms — electronic acceptance\n\n' +
            'Client / company: ' + get('company') + '\n' +
            'Name: ' + get('name') + '\n' +
            'Role: ' + get('role') + '\n' +
            'Email: ' + get('email') + '\n' +
            'Date: ' + get('date') + '\n' +
            'Accepted: yes (acceptance box ticked)';

        var note = document.getElementById('acceptNote');
        if (note) note.hidden = false;
        window.location.href = 'mailto:' + to +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
    });
})();
