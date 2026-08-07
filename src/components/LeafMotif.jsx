export default function LeafMotif({ className = '', color = 'currentColor' }) {
  const leaves = [
    { cx: 18, cy: 46, rx: 8, ry: 4, rot: -35 },
    { cx: 38, cy: 34, rx: 9, ry: 4.5, rot: -30 },
    { cx: 60, cy: 24, rx: 9, ry: 4.5, rot: -22 },
    { cx: 84, cy: 16, rx: 8, ry: 4, rot: -15 },
    { cx: 106, cy: 10, rx: 7.5, ry: 3.8, rot: -8 },
    { cx: 126, cy: 6, rx: 7, ry: 3.5, rot: 0 },
  ];
  return (
    <svg
      className={className}
      viewBox="0 0 140 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 52C42 38 72 22 136 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      {leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx={l.rx}
          ry={l.ry}
          fill={color}
          opacity={0.55 + i * 0.06}
          transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
        />
      ))}
    </svg>
  );
}
