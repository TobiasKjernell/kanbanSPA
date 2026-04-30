import type { RefObject } from 'react';

interface GanttTopbarProps {
    connectionLabel: string;
    connectionColor: string;
    presentNames: string[];
    monthCount: number;
    onAddMonth: () => void;
    onRemoveMonth: () => void;
    onAddPerson: () => void;
    todayRef: RefObject<HTMLDivElement | null>;
}

export function GanttTopbar({ connectionLabel, connectionColor, presentNames, monthCount, onAddMonth, onRemoveMonth, onAddPerson, todayRef }: GanttTopbarProps) {
    return (
        <div className="gantt-topbar">
            <h1>Roadmap</h1>
            <span className="gantt-topbar-hint">Click a row to add · Double-click label to edit</span>
            <div className="gantt-topbar-spacer" />

            <button
                className="psp-text-gold cursor-pointer border rounded-md px-2 text-sm hover:bg-[#cea86f] hover:text-zinc-900"
                onClick={() => todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })}
            >
                Scroll to today
            </button>

            <div className="flex items-center gap-2 text-sm">
                <span className="text-zinc-400">Status:</span>
                <span className={connectionColor}>{connectionLabel}</span>
            </div>

            {presentNames.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-400">Watching:</span>
                    {presentNames.map(name => (
                        <span key={name} className="psp-text-gold">{name}</span>
                    ))}
                </div>
            )}

            <div className="gantt-topbar-divider" />

            <div className="gantt-month-controls">
                <button className="btn-month" onClick={onRemoveMonth}>−</button>
                <span className="gantt-month-count">{monthCount} months</span>
                <button className="btn-month" onClick={onAddMonth}>+</button>
            </div>

            <div className="gantt-topbar-divider" />

            <button className="btn-add-person" onClick={onAddPerson}>
                + Add person
            </button>
        </div>
    );
}
