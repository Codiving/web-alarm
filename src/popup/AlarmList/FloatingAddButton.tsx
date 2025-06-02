interface FloatingAddButtonProps {
  onClick: () => void;
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <svg
      id="add-alarm-btn"
      className="duration-200 hover:scale-[1.07] bg-[rgba(0,0,0,0.36)] hover:bg-[rgba(0,0,0,0.45)] shadow-[0_5px_15px_rgba(0,0,0,0.35)] absolute left-1/2 transform -translate-x-1/2 bottom-[10px] cursor-pointer rounded-full p-[6px]"
      xmlns="http://www.w3.org/2000/svg"
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      fill="none"
      onClick={onClick}
    >
      <path
        d="M11.9997 15.5815V9.58148M8.9997 12.5815H14.9997M18.9997 20.5815L16.4114 18.0165M4.9997 20.5815L7.58797 18.0165M6.74234 3.99735C6.36727 3.62228 5.85856 3.41156 5.32812 3.41156C4.79769 3.41156 4.28898 3.62228 3.91391 3.99735M20.0858 6.82413C20.4609 6.44905 20.6716 5.94035 20.6716 5.40991C20.6716 4.87948 20.4609 4.37077 20.0858 3.9957C19.7107 3.62063 19.202 3.40991 18.6716 3.40991C18.1411 3.40991 17.6324 3.62063 17.2574 3.9957M18.9997 12.5815C18.9997 16.4475 15.8657 19.5815 11.9997 19.5815C8.1337 19.5815 4.9997 16.4475 4.9997 12.5815C4.9997 8.71549 8.1337 5.58149 11.9997 5.58149C15.8657 5.58149 18.9997 8.71549 18.9997 12.5815Z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
