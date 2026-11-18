const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
const finePointer = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
const canvas = document.querySelector("[data-signal-map]");
const context = canvas.getContext("2d");

const center = { x: 220, y: 170 };
const observations = [[103, 208], [123, 218], [148, 211], [172, 192], [200, 163], [228, 142], [255, 135]];
const predictions = [[255, 135], [284, 134], [309, 118], [331, 90], [345, 61]];
const returns = Array.from({ length: 56 }, (_, index) => {
  const angle = index * 2.39996;
  const distance = 38 + (index * 41 % 100);
  return [center.x + Math.cos(angle) * distance, center.y + Math.sin(angle) * distance];
});

function drawSignal(angle) {
  if (!context) return;

  context.clearRect(0, 0, 440, 340);
  context.lineWidth = 1;
  context.strokeStyle = "#5d969067";
  for (const radius of [40, 78, 116, 151]) {
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(center.x - 164, center.y);
  context.lineTo(center.x + 164, center.y);
  context.moveTo(center.x, center.y - 157);
  context.lineTo(center.x, center.y + 157);
  context.stroke();

  for (let slice = 0; slice < 26; slice++) {
    const trailing = slice * 0.023;
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.arc(center.x, center.y, 151, angle - trailing - 0.024, angle - trailing);
    context.closePath();
    context.fillStyle = `rgba(95, 233, 178, ${0.27 * (1 - slice / 26) ** 1.6})`;
    context.fill();
  }
  context.strokeStyle = "#82f0bf";
  context.beginPath();
  context.moveTo(center.x, center.y);
  context.lineTo(center.x + 151 * Math.cos(angle), center.y + 151 * Math.sin(angle));
  context.stroke();

  context.fillStyle = "#76bbae";
  for (const [x, y] of returns) {
    context.fillRect(x, y, 1.5, 1.5);
  }

  for (const [points, color, dashed] of [
    [observations, "#82f0bf", []],
    [predictions, "#c9b5f9", [4, 5]],
  ]) {
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 1.7;
    context.setLineDash(dashed);
    context.beginPath();
    context.moveTo(...points[0]);
    for (const point of points.slice(1)) context.lineTo(...point);
    context.stroke();
    context.setLineDash([]);

    for (const [x, y] of points) {
      context.beginPath();
      context.arc(x, y, 3.1, 0, Math.PI * 2);
      context.fill();
    }
  }
}

const restingAngle = -0.6;
if (context) {
  const resolution = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = 440 * resolution;
  canvas.height = 340 * resolution;
  context.scale(resolution, resolution);
  drawSignal(restingAngle);
}

for (const surface of document.querySelectorAll("[data-pointer-surface]")) {
  const isHero = surface.contains(canvas);
  let frame = 0;

  function reset() {
    cancelAnimationFrame(frame);
    surface.style.setProperty("--spotlight", "0");
    surface.style.removeProperty("--map-x");
    surface.style.removeProperty("--map-y");
    if (isHero) drawSignal(restingAngle);
  }

  surface.addEventListener("pointermove", (event) => {
    if (!motion.matches || !finePointer.matches || event.pointerType === "touch") return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = surface.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      surface.style.setProperty("--pointer-x", `${x * 100}%`);
      surface.style.setProperty("--pointer-y", `${y * 100}%`);
      surface.style.setProperty("--spotlight", isHero ? "0.62" : "0.48");

      if (isHero) {
        surface.style.setProperty("--map-x", `${(x - 0.5) * 15}px`);
        surface.style.setProperty("--map-y", `${(y - 0.5) * 12}px`);
        drawSignal(restingAngle + (x - 0.5) * 2.1 + (y - 0.5) * 0.65);
      }
    });
  }, { passive: true });
  surface.addEventListener("pointerleave", reset);
  motion.addEventListener("change", reset);
}

if ("IntersectionObserver" in window && "animate" in Element.prototype) {
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      if (!motion.matches) continue;
      target.animate(
        [{ opacity: 0.45, translate: "0 12px" }, { opacity: 1, translate: "0 0" }],
        { duration: 430, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
      );
    }
  }, { threshold: 0.16 });

  const sections = document.querySelectorAll("[data-scroll-reveal]");
  for (const section of sections) observer.observe(section);
  motion.addEventListener("change", () => {
    if (motion.matches) return;
    for (const section of sections) {
      for (const animation of section.getAnimations()) animation.cancel();
    }
  });
}
