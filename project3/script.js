$(document).ready(function () {

  const $circles = $(".circle-btn");
  const speeds = [];
  const positions = [];

  function initCircles() {
    const w = $(window).width();
    const h = $(window).height();

    $circles.each(function (i) {
      const $c = $(this);
      const size = $c.outerWidth() || 160;

      const x = Math.random() * (w - size - 60) + 30;
      const y = Math.random() * (h - size - 60) + 30;

      positions[i] = { x, y };
      $c.css({ left: x, top: y });

      speeds[i] = {
        vx: (Math.random() * 0.12 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.12 + 0.02) * (Math.random() > 0.5 ? 1 : -1)
      };
    });
  }

  function animateCircles() {
    const w = $(window).width();
    const h = $(window).height();

    $circles.each(function (i) {
      const $c = $(this);
      const size = $c.outerWidth();
      const pos = positions[i];

      pos.x += speeds[i].vx;
      pos.y += speeds[i].vy;

      if (pos.x <= 0 || pos.x + size >= w) speeds[i].vx *= -1;
      if (pos.y <= 0 || pos.y + size >= h) speeds[i].vy *= -1;

      $c.css({ left: pos.x + "px", top: pos.y + "px" });
    });

    $circles.css("filter", "brightness(1)");

    $circles.each(function (i) {
      const $c1 = $(this);
      const r1 = this.getBoundingClientRect();
      const c1x = r1.left + r1.width / 2;
      const c1y = r1.top + r1.height / 2;
      const rad1 = r1.width / 2;

      $circles.each(function (j) {
        if (i === j) return;

        const $c2 = $(this);
        const r2 = this.getBoundingClientRect();
        const c2x = r2.left + r2.width / 2;
        const c2y = r2.top + r2.height / 2;
        const rad2 = r2.width / 2;

        const dx = c1x - c2x;
        const dy = c1y - c2y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < rad1 + rad2) {
          $c1.css("filter", "brightness(1.5)");
          $c2.css("filter", "brightness(1.5)");
        }
      });
    });

    requestAnimationFrame(animateCircles);
  }

  initCircles();
  animateCircles();
  $(window).on("resize", initCircles);
});