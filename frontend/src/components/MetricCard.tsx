interface Props {
  title: string;
  value: string | number;
  description: string;
}

export default function MetricCard({ title, value, description }: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg flex flex-col justify-between space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">{title}</h4>
        <div className="text-3xl font-black text-white">{value}</div>
      </div>
      <p className="text-sm text-neutral-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
