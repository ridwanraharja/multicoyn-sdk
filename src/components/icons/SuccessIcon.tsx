interface SuccessIconProps {
  size?: number;
  className?: string;
}

export function SuccessIcon({ size = 95, className = "" }: SuccessIconProps) {
  return (
    <svg
      width={size * 2.1}
      height={size}
      viewBox="0 0 200 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background decorations */}
      <circle cx="30" cy="20" r="3" fill="#FCD34D" />
      <circle cx="170" cy="25" r="4" fill="#5EEAD4" />
      <circle cx="25" cy="70" r="2" fill="#A78BFA" />
      <circle cx="175" cy="65" r="3" fill="#F472B6" />
      <circle cx="50" cy="85" r="2" fill="#60A5FA" />
      <circle cx="150" cy="80" r="2" fill="#FCD34D" />

      {/* Stars */}
      <path d="M45 30L46 33L49 33L47 35L48 38L45 36L42 38L43 35L41 33L44 33Z" fill="#FCD34D" />
      <path d="M160 45L161 47L163 47L161.5 48.5L162 51L160 49.5L158 51L158.5 48.5L157 47L159 47Z" fill="#FCD34D" />

      {/* Main circle with gradient */}
      <circle cx="100" cy="47" r="35" fill="url(#successGradient)" />
      <circle cx="100" cy="47" r="30" fill="#22C55E" />

      {/* Checkmark */}
      <path
        d="M85 47L95 57L115 37"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer ring glow */}
      <circle cx="100" cy="47" r="38" stroke="#22C55E" strokeWidth="2" strokeOpacity="0.3" />
      <circle cx="100" cy="47" r="42" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.2" />

      <defs>
        <linearGradient id="successGradient" x1="65" y1="12" x2="135" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ADE80" />
          <stop offset="1" stopColor="#16A34A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
