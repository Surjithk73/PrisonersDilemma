interface Props {
  onMove: (move: 'C' | 'D') => void;
  disabled: boolean;
}

export default function MoveButtons({ onMove, disabled }: Props) {
  return (
    <div className="flex justify-center gap-6 mt-8">
      <button
        onClick={() => onMove('C')}
        disabled={disabled}
        className="w-40 py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold text-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:shadow-none"
      >
        Cooperate
      </button>
      <button
        onClick={() => onMove('D')}
        disabled={disabled}
        className="w-40 py-6 rounded-2xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold text-xl transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:shadow-none"
      >
        Defect
      </button>
    </div>
  );
}
