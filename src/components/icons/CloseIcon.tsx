interface CloseIconProps {
  size?: number;
  className?: string;
}

export function CloseIcon({ size = 26, className = "" }: CloseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.5 6.5L19.5 19.5M6.5 19.5L19.5 6.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
