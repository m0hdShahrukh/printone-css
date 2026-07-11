document.addEventListener("DOMContentLoaded", function () {
  const marquee = document.querySelector(".brand-logos-marquee");
  const track = document.querySelector("[data-brand-track]");

  if (!marquee || !track) return;

  const originalItems = Array.from(track.children);

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  marquee.addEventListener("mouseenter", function () {
    marquee.classList.add("is-paused");
  });

  marquee.addEventListener("mouseleave", function () {
    marquee.classList.remove("is-paused");
  });

  marquee.addEventListener("touchstart", function () {
    marquee.classList.add("is-paused");
  }, { passive: true });

  marquee.addEventListener("touchend", function () {
    marquee.classList.remove("is-paused");
  });
});
/* ==========================================================================
   Printone Preloader — WordPress version
   Runs once. Creeps to ~90% while the page is still loading, then finishes
   to 100% and fades out as soon as the browser's `load` event fires
   (i.e. once all images, CSS, and scripts have actually finished).
   ========================================================================== */
(function(){
  var root = document.getElementById('printonePreloader');
  if (!root) return;

  var printer    = document.getElementById('printonePrinter');
  var led        = document.getElementById('printoneLed');
  var printhead  = document.getElementById('printonePrinthead');
  var paper      = document.getElementById('printonePaper');
  var pctVal     = document.getElementById('printonePctVal');
  var fillBar    = document.getElementById('printoneFillBar');
  var stamp      = document.getElementById('printoneStamp');
  var title      = document.getElementById('printoneTitle');
  var subtitle   = document.getElementById('printoneSubtitle');
  var lines      = Array.prototype.slice.call(root.querySelectorAll('.printone-line'));

  var CREEP_TO      = 90;   // parked here until the real load event fires
  var CREEP_MS      = 3200;
  var FINISH_MS     = 350;
  var HOLD_MS       = 550;
  var FADE_MS       = 500;
  var SAFETY_TIMEOUT_MS = 9000; // force-hide even if `load` never fires

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

  function animate(from, to, duration, easing, onUpdate, onDone){
    var start = null;
    function frame(now){
      if (start === null) start = now;
      var raw = Math.min(1, (now - start) / duration);
      var eased = easing(raw);
      onUpdate(from + (to - from) * eased);
      if (raw < 1){
        requestAnimationFrame(frame);
      } else if (onDone){
        onDone();
      }
    }
    requestAnimationFrame(frame);
  }

  function applyFraction(pct){
    var rounded = Math.round(pct);
    paper.style.height = pct + '%';
    paper.style.transform = 'rotateX(' + ((100 - pct) / 100 * 8) + 'deg)';
    fillBar.style.width = pct + '%';
    pctVal.textContent = rounded;
    lines.forEach(function(line){
      var th = +line.dataset.th;
      if (rounded >= th){
        line.style.width = line.dataset.w;
        line.classList.add('printone-show');
      }
    });
  }

  var clackTimer = null;
  function startClack(){
    if (reduced) return;
    clackTimer = setInterval(function(){
      printer.classList.add('printone-clack');
      setTimeout(function(){ printer.classList.remove('printone-clack'); }, 180);
    }, 260);
  }
  function stopClack(){
    if (clackTimer){ clearInterval(clackTimer); clackTimer = null; }
  }

  function finish(){
    stopClack();
    animate(CREEP_TO, 100, FINISH_MS, easeOutCubic, applyFraction, function(){
      led.classList.add('printone-done');
      printhead.classList.add('printone-paused');
      stamp.classList.add('printone-show');
      title.textContent = 'All done!';
      subtitle.textContent = 'Your document is ready';

      setTimeout(hideOverlay, HOLD_MS);
    });
  }

  function hideOverlay(){
    root.classList.add('printone-hide');
    document.documentElement.classList.remove('printone-locked');
    setTimeout(function(){
      if (root && root.parentNode){
        root.parentNode.removeChild(root);
      }
    }, FADE_MS);
  }

  var pageLoaded = false;
  function onPageLoad(){
    if (pageLoaded) return;
    pageLoaded = true;
    finish();
  }

  // Lock scroll while the overlay is up.
  document.documentElement.classList.add('printone-locked');

  startClack();
  animate(0, CREEP_TO, CREEP_MS, easeOutCubic, applyFraction, function(){
    // reached the parked position; if the page already finished loading
    // in the meantime, finish() will already have fired via the load
    // listener below.
  });

  if (document.readyState === 'complete'){
    onPageLoad();
  } else {
    window.addEventListener('load', onPageLoad);
  }

  // Safety net so the overlay can never get stuck on a slow/broken asset.
  setTimeout(onPageLoad, SAFETY_TIMEOUT_MS);
})();