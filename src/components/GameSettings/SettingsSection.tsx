interface SettingsSectionProps {
    title: string;
    data: Record<string, number | boolean | string>;
    onChange: (field: string, value: number | boolean | string) => void;
    onUpdate: () => void;
    isDirty: boolean;
    isSaving: boolean;
    compact?: boolean;
}

function formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

const SettingsSection = ({ title, data, onChange, onUpdate, isDirty, isSaving, compact }: SettingsSectionProps) => {
    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 flex flex-col">
            <h3 className={`${compact ? "text-sm" : "text-lg"} font-semibold psp-text-gold mb-3 border-b border-zinc-700 pb-2 truncate`} title={title}>
                {title}
            </h3>
            <div className="flex flex-col gap-2 flex-1">
                {Object.entries(data).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                        <label className={`text-zinc-300 ${compact ? "text-xs" : "text-sm"} shrink-0 max-w-[17ch] sm:max-w-full truncate`} title={formatLabel(key)}>
                            {formatLabel(key)}
                        </label>
                        {typeof value === "boolean" ? (
                            <button
                                onClick={() => onChange(key, !value)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    value
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                                }`}
                            >
                                {value ? "ON" : "OFF"}
                            </button>
                        ) : (
                            <input
                                type="number"
                                value={value}
                                onChange={(e) =>
                                    onChange(key, parseFloat(e.target.value) || 0)
                                }
                                step="any"
                                className={`bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white text-sm ${compact ? "w-20" : "w-24"} text-right focus:outline-none focus:border-[#cea86f] transition-colors`}
                            />
                        )}
                    </div>
                ))}
            </div>
            <button
                onClick={onUpdate}
                disabled={!isDirty || isSaving}
                className={`${compact ? "mt-3 py-1.5 text-xs" : "mt-4 py-2 text-sm"} w-full rounded font-semibold transition-colors cursor-pointer ${
                    isDirty
                        ? "bg-zinc-700 hover:bg-[#cea86f] hover:text-zinc-900 text-white"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
            >
                {isSaving ? "Saving..." : isDirty ? `Update ${title}` : "No changes"}
            </button>
        </div>
    );
};

export default SettingsSection;
