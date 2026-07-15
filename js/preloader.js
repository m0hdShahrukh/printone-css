// Printone Preloader
(function () {
    console.log('[preloader] fired at', Date.now(), 'readyState:', document.readyState);
    // Prevent duplicate execution if cache/minify plugins inject the script twice.
    if (window.__printonePreloaderInitialized) return;
    window.__printonePreloaderInitialized = true;

    var root = document.getElementById('printonePreloader');
    if (!root) return;

    var printer = document.getElementById('printonePrinter');
    var led = document.getElementById('printoneLed');
    var printhead = document.getElementById('printonePrinthead');
    var paper = document.getElementById('printonePaper');
    var pctVal = document.getElementById('printonePctVal');
    var fillBar = document.getElementById('printoneFillBar');
    var stamp = document.getElementById('printoneStamp');
    var title = document.getElementById('printoneTitle');
    var subtitle = document.getElementById('printoneSubtitle');
    var lines = Array.prototype.slice.call(root.querySelectorAll('.printone-line'));

    var CREEP_TO = 90;
    var CREEP_MS = 3200;
    var FINISH_MS = 350;
    var HOLD_MS = 550;
    var FADE_MS = 500;
    var SAFETY_TIMEOUT_MS = 9000;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pageLoaded = false;
    var clackTimer = null;
    var finished = false;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animate(from, to, duration, easing, onUpdate, onDone) {
        var start = null;

        function frame(now) {
            if (start === null) start = now;
            var raw = Math.min(1, (now - start) / duration);
            var eased = easing(raw);
            onUpdate(from + (to - from) * eased);

            if (raw < 1) {
                requestAnimationFrame(frame);
            } else if (onDone) {
                onDone();
            }
        }

        requestAnimationFrame(frame);
    }

    function applyFraction(pct) {
        var rounded = Math.round(pct);

        paper.style.height = pct + '%';
        paper.style.transform = 'rotateX(' + ((100 - pct) / 100 * 8) + 'deg)';
        fillBar.style.width = pct + '%';
        pctVal.textContent = rounded;

        lines.forEach(function (line) {
            var th = +line.dataset.th;
            if (rounded >= th) {
                line.style.width = line.dataset.w;
                line.classList.add('printone-show');
            }
        });
    }

    function startClack() {
        if (reduced) return;

        clackTimer = setInterval(function () {
            if (!printer) return;
            printer.classList.add('printone-clack');
            setTimeout(function () {
                if (printer) printer.classList.remove('printone-clack');
            }, 180);
        }, 260);
    }

    function stopClack() {
        if (clackTimer) {
            clearInterval(clackTimer);
            clackTimer = null;
        }
    }

    function hideOverlay() {
        root.classList.add('printone-hide');
        document.documentElement.classList.remove('printone-locked');

        setTimeout(function () {
            if (root && root.parentNode) {
                root.parentNode.removeChild(root);
            }
        }, FADE_MS);
    }

    function finish() {
        if (finished) return;
        finished = true;

        stopClack();

        animate(CREEP_TO, 100, FINISH_MS, easeOutCubic, applyFraction, function () {
            if (led) led.classList.add('printone-done');
            if (printhead) printhead.classList.add('printone-paused');
            if (stamp) stamp.classList.add('printone-show');
            if (title) title.textContent = 'All done!';
            if (subtitle) subtitle.textContent = 'Your document is ready';

            setTimeout(hideOverlay, HOLD_MS);
        });
    }

    function onPageLoad() {
        if (pageLoaded) return;
        pageLoaded = true;
        finish();
    }

    document.documentElement.classList.add('printone-locked');

    startClack();
    animate(0, CREEP_TO, CREEP_MS, easeOutCubic, applyFraction);

    if (document.readyState === 'complete') {
        onPageLoad();
    } else {
        window.addEventListener('load', onPageLoad, { once: true });
    }

    window.addEventListener('pageshow', function (e) {
        if (e.persisted) onPageLoad();
    }, { once: true });

    setTimeout(onPageLoad, SAFETY_TIMEOUT_MS);
})();