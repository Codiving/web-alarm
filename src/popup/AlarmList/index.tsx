import { OnChangeDialog } from "../Popup";

interface AlarmListProps {
  onChangeDialog: OnChangeDialog;
}

export default function AlarmList({ onChangeDialog }: AlarmListProps) {
  return (
    <div
      id="alarm-list-overlay"
      className="select-none flex flex-col gap-[8px] px-[12px] py-[8px] h-[400px]"
    >
      <h1 className="text-center text-[22px] font-bold text-white sticky top-0">
        Web Alarm
      </h1>
      <div className="scrollbar-hide overflow-auto flex-1 flex flex-col gap-[8px]">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="text-white p-[10px] pb-[8px] gap-[8px] w-full rounded-xl bg-[#5c5c5c] flex flex-col"
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-[6px]">
                <p className="text-[14px]">월, 화, 수, 목, 금</p>
                <div className="flex items-end gap-[14px]">
                  <span>오전</span>
                  <span className="text-[24px] mb-[-4px]">07:00</span>
                </div>
              </div>
              <div className="items-start flex gap-[6px]">
                <span className="cursor-pointer py-[4px] px-[8px] text-[14px] bg-[#434040] hover:bg-[#2d2a2a] duration-300 rounded-[12px] text-[#ff8800]">
                  수정
                </span>
                <span className="cursor-pointer py-[4px] px-[8px] text-[14px] bg-[#434040] hover:bg-[#2d2a2a] duration-300 rounded-[12px] text-[#ff8800]">
                  삭제
                </span>
              </div>
            </div>
            {/*  */}
            {i % 2 === 0 && (
              <div className="flex gap-[6px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14px"
                  height="14px"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-[3px]"
                >
                  <path
                    d="M7.2 21C6.07989 21 5.51984 21 5.09202 20.782C4.71569 20.5903 4.40973 20.2843 4.21799 19.908C4 19.4802 4 18.9201 4 17.8V6.2C4 5.07989 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V7M8 7H14M8 15H9M8 11H12M11.1954 20.8945L12.5102 20.6347C13.2197 20.4945 13.5744 20.4244 13.9052 20.2952C14.1988 20.1806 14.4778 20.0317 14.7365 19.8516C15.0279 19.6486 15.2836 19.393 15.7949 18.8816L20.9434 13.7332C21.6306 13.0459 21.6306 11.9316 20.9434 11.2444C20.2561 10.5571 19.1418 10.5571 18.4546 11.2444L13.2182 16.4808C12.739 16.96 12.4994 17.1996 12.3059 17.4712C12.1341 17.7123 11.9896 17.9717 11.8751 18.2447C11.7461 18.5522 11.6686 18.882 11.5135 19.5417L11.1954 20.8945Z"
                    stroke="#fff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="text-[14px]">
                  아니 이게 메모라고? 말이 된다고 생각하나????
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <svg
        id="add-alarm-btn"
        className="duration-200 hover:scale-[1.07] bg-[rgba(0,0,0,0.36)] hover:bg-[rgba(0,0,0,0.45)] shadow-[0_5px_15px_rgba(0,0,0,0.35)] absolute left-1/2 transform -translate-x-1/2 bottom-[10px] cursor-pointer rounded-full p-[6px]"
        xmlns="http://www.w3.org/2000/svg"
        width="40px"
        height="40px"
        viewBox="0 0 24 24"
        fill="none"
        onClick={() => {
          onChangeDialog("add", { open: true });
        }}
      >
        <path
          d="M11.9997 15.5815V9.58148M8.9997 12.5815H14.9997M18.9997 20.5815L16.4114 18.0165M4.9997 20.5815L7.58797 18.0165M6.74234 3.99735C6.36727 3.62228 5.85856 3.41156 5.32812 3.41156C4.79769 3.41156 4.28898 3.62228 3.91391 3.99735M20.0858 6.82413C20.4609 6.44905 20.6716 5.94035 20.6716 5.40991C20.6716 4.87948 20.4609 4.37077 20.0858 3.9957C19.7107 3.62063 19.202 3.40991 18.6716 3.40991C18.1411 3.40991 17.6324 3.62063 17.2574 3.9957M18.9997 12.5815C18.9997 16.4475 15.8657 19.5815 11.9997 19.5815C8.1337 19.5815 4.9997 16.4475 4.9997 12.5815C4.9997 8.71549 8.1337 5.58149 11.9997 5.58149C15.8657 5.58149 18.9997 8.71549 18.9997 12.5815Z"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
