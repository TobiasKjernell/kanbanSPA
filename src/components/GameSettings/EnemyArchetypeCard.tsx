import type { EnemyArchetype } from "./gameBalanceDefaults";

interface EnemyArchetypeCardProps {
    archetype: EnemyArchetype;
    onChange: (field: keyof EnemyArchetype, value: number | string) => void;
    onUpdate: () => void;
}

function formatEnemyName(id: string): string {
    return id.replace(/_/g, " ").replace(/\s*AI\s*Variant\s*/i, "").replace(/\s*AI\s*/i, "").trim();
}

const numericFields: { key: keyof EnemyArchetype; label: string }[] = [
    { key: "healthMultiplier", label: "Health Multiplier" },
    { key: "walkSpeedMultiplier", label: "Walk Speed Multiplier" },
    { key: "meleeMinDamage", label: "Melee Min Damage" },
    { key: "meleeMaxDamage", label: "Melee Max Damage" },
];

const EnemyArchetypeCard = ({ archetype, onChange, onUpdate }: EnemyArchetypeCardProps) => {
    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 flex flex-col">
            <h4 className="text-sm font-semibold psp-text-gold mb-3 border-b border-zinc-700 pb-2 truncate" title={archetype.id}>
                {formatEnemyName(archetype.id)}
            </h4>
            <div className="flex flex-col gap-2 flex-1">
                {numericFields.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                        <label className="text-zinc-400 text-xs shrink-0 max-w-[17ch] sm:max-w-full truncate" title={label}>{label}</label>
                        <input
                            type="number"
                            value={archetype[key] as number}
                            onChange={(e) => onChange(key, parseFloat(e.target.value) || 0)}
                            step="any"
                            className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white text-sm w-20 text-right focus:outline-none focus:border-[#cea86f] transition-colors"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={onUpdate}
                className="mt-3 w-full py-1.5 rounded bg-zinc-700 hover:bg-[#cea86f] hover:text-zinc-900 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
                Update
            </button>
        </div>
    );
};

export default EnemyArchetypeCard;
