interface Props {
  isVisible: boolean;
}

export default function AiThinkingIndicator({ isVisible }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center h-16 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
      <div className="flex items-center gap-3 bg-neutral-800/50 px-6 py-3 rounded-full border border-neutral-700/50">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        <span className="text-neutral-300 font-medium tracking-wide">Opponent is thinking...</span>
      </div>
    </div>
  );
}
