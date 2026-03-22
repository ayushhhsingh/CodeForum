type Shape = "square" | "circle";

interface ConfettiOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  flat?: boolean;
  ticks?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: Shape[];
  zIndex?: number;
  disableForReducedMotion?: boolean;
  useWorker?: boolean;
  resize?: boolean;
  canvas?: HTMLCanvasElement | null;
  scalar?: number;
}

type ShapeFromPathOptions = {
  path: string;
};

type ShapeFromTextOptions = {
  text: string;
};

const DEFAULT_COLORS = ["#f97316", "#facc15", "#22c55e", "#38bdf8", "#e879f9"];

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const Confetti = (options: ConfettiOptions) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (
    options.disableForReducedMotion &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const particleCount = options.particleCount ?? 24;
  const origin = options.origin ?? { x: 0.5, y: 0.5 };
  const colors = options.colors?.length ? options.colors : DEFAULT_COLORS;
  const gravity = options.gravity ?? 0.9;
  const spread = options.spread ?? 45;
  const startVelocity = options.startVelocity ?? 45;
  const scalar = options.scalar ?? 1;
  const zIndex = options.zIndex ?? 9999;

  const layer = document.createElement("div");
  layer.style.position = "fixed";
  layer.style.left = "0";
  layer.style.top = "0";
  layer.style.width = "100vw";
  layer.style.height = "100vh";
  layer.style.pointerEvents = "none";
  layer.style.overflow = "hidden";
  layer.style.zIndex = String(zIndex);
  document.body.appendChild(layer);

  const startX = origin.x * window.innerWidth;
  const startY = origin.y * window.innerHeight;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const size = randomBetween(6, 12) * scalar;
    const angleOffset = randomBetween(-spread, spread) * (Math.PI / 180);
    const velocity = randomBetween(startVelocity * 0.6, startVelocity * 1.2);
    const distance = velocity * randomBetween(6, 10);
    const x = Math.cos(angleOffset) * distance;
    const y = Math.sin(angleOffset) * distance - gravity * 40;
    const rotation = randomBetween(-240, 240);
    const color = colors[index % colors.length];

    particle.style.position = "absolute";
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.borderRadius = index % 2 === 0 ? "999px" : "2px";
    particle.style.opacity = "1";
    particle.style.transform = "translate(-50%, -50%)";
    particle.style.willChange = "transform, opacity";
    particle.animate(
      [
        { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: randomBetween(700, 1100),
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        fill: "forwards",
      }
    );

    layer.appendChild(particle);
  }

  window.setTimeout(() => {
    layer.remove();
  }, 1200);
};

Confetti.shapeFromPath = (_options: ShapeFromPathOptions) => "square" as Shape;
Confetti.shapeFromText = (_options: ShapeFromTextOptions) => "square" as Shape;

export { Confetti };
