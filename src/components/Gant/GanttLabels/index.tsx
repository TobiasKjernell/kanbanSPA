import type { RefObject } from 'react';
import type { GanttPerson } from '../../../hooks/useGantt';
import { LABEL_WIDTH, ROW_HEIGHT } from '../constants';

interface GanttLabelsProps {
    people: GanttPerson[];
    headerH: number;
    editingPerson: string | null;
    setEditingPerson: (id: string | null) => void;
    renamePerson: (id: string, name: string) => void;
    removePerson: (id: string) => void;
    addingPerson: boolean;
    newPersonName: string;
    setNewPersonName: (name: string) => void;
    commitAddPerson: () => void;
    cancelAddPerson: () => void;
    addInputRef: RefObject<HTMLInputElement | null>;
}

export function GanttLabels({ people, headerH, editingPerson, setEditingPerson, renamePerson, removePerson, addingPerson, newPersonName, setNewPersonName, commitAddPerson, cancelAddPerson, addInputRef }: GanttLabelsProps) {
    return (
        <div className="gantt-labels" style={{ width: LABEL_WIDTH }}>
            <div className="gantt-labels-header" style={{ height: headerH }} />

            {people.map(person => (
                <div key={person.id} className="gantt-person-row" style={{ height: ROW_HEIGHT }}>
                    <div className="gantt-person-dot" />
                    {editingPerson === person.id ? (
                        <input
                            autoFocus
                            className="gantt-person-input"
                            defaultValue={person.name}
                            onBlur={e => renamePerson(person.id, e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                if (e.key === 'Escape') setEditingPerson(null);
                            }}
                        />
                    ) : (
                        <span
                            className="gantt-person-name"
                            onDoubleClick={() => setEditingPerson(person.id)}
                            title="Double-click to rename"
                        >
                            {person.name}
                        </span>
                    )}
                    <button className="btn-delete-person" onClick={() => removePerson(person.id)}>✕</button>
                </div>
            ))}

            {addingPerson && (
                <div className="gantt-person-row" style={{ height: ROW_HEIGHT }}>
                    <div className="gantt-person-dot" />
                    <input
                        ref={addInputRef}
                        className="gantt-person-input"
                        placeholder="Name…"
                        value={newPersonName}
                        onChange={e => setNewPersonName(e.target.value)}
                        onBlur={commitAddPerson}
                        onKeyDown={e => {
                            if (e.key === 'Enter') commitAddPerson();
                            if (e.key === 'Escape') cancelAddPerson();
                        }}
                    />
                </div>
            )}
        </div>
    );
}
