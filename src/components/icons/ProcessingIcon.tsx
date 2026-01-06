interface ProcessingIconProps {
  size?: number;
  className?: string;
}

export function ProcessingIcon({
  size = 134,
  className = "",
}: ProcessingIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 134 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="67" cy="66" r="55" fill="#5EEAD4" fillOpacity="0.2" />
      <circle cx="67" cy="66" r="45" fill="#5EEAD4" fillOpacity="0.3" />

      <rect x="35" y="30" width="45" height="72" rx="4" fill="#14B8A6" />
      <rect x="38" y="35" width="39" height="55" rx="2" fill="#0D9488" />

      <g className="animate-pulse">
        <rect x="55" y="50" width="50" height="32" rx="3" fill="#1E293B" />
        <rect x="60" y="56" width="20" height="3" rx="1" fill="#475569" />
        <rect x="60" y="62" width="30" height="2" rx="1" fill="#475569" />
        <rect x="60" y="68" width="15" height="2" rx="1" fill="#475569" />
      </g>

      <ellipse cx="95" cy="85" rx="12" ry="8" fill="#FCD9BD" />
      <rect x="88" y="78" width="8" height="20" rx="4" fill="#FCD9BD" />

      <circle cx="20" cy="25" r="8" fill="#FCD34D" />
      <text x="20" y="29" textAnchor="middle" fontSize="10" fill="#92400E">
        $
      </text>

      <circle cx="115" cy="35" r="6" fill="#FCD34D" />
      <text x="115" y="38" textAnchor="middle" fontSize="8" fill="#92400E">
        $
      </text>

      <circle cx="110" cy="20" r="5" fill="#FCD34D" fillOpacity="0.6" />
    </svg>
  );
}
