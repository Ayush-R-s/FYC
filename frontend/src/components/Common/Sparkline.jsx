export const Sparkline = ({ data, className = "" }) => (
    <div className={`flex items-end gap-px h-12 w-24 ${className}`}>
        {data.slice(-7).map((val, i) => (
            <div
                key={i}
                className="flex-1 bg-orange-400 hover:bg-orange-500 transition-colors rounded-t"
                style={{ height: `${Math.max(val, 10)}%` }}
                title={`${val}%`}
            />
        ))}
    </div>
);