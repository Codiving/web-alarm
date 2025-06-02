interface MemoInputProps {
  memo: string;
  onChange: (memo: string) => void;
}

export default function MemoInput({ memo, onChange }: MemoInputProps) {
  const handleMemo = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-[4px] mt-[12px]">
      <input
        className="focus:outline-none focus:ring-0 px-[8px] text-[14px] bg-white mx-[8px] rounded-[8px] h-[34px] placeholder:text-[14px]"
        placeholder="메모"
        value={memo}
        onChange={handleMemo}
      />
    </div>
  );
}
