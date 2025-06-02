interface ToggleSwitchProps {
  isOneTime: boolean;
  onToggle: (newState: boolean) => void;
}

export default function ToggleSwitch({
  isOneTime,
  onToggle,
}: ToggleSwitchProps) {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) =>
    onToggle(e.target.checked);

  return (
    <div className="flex justify-end items-center gap-[4px]">
      <div className="tooltip">
        <span className="tooltiptext">
          설정된 요일과 상관 없이 1번 발생하고 삭제됩니다.
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="#6e6c6c"
          className="mt-[2px]"
        >
          <g id="Warning / Info">
            <path
              id="Vector"
              d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </div>

      <div className="one-time-toggle">
        <label
          htmlFor="oneTimeAlarm"
          className="text-[14px] text-white font-bold"
        >
          1회용 알람
        </label>
        <label className="switch">
          <input
            type="checkbox"
            id="oneTimeAlarm"
            checked={isOneTime}
            onChange={handleToggle}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
}
