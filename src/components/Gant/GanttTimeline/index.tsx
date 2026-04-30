import type { RefObject, MouseEvent } from 'react';
import type { GanttPerson, GanttBlock } from '../../../hooks/useGantt';
import { GanttBlockItem } from '../GanttBlock';
import { DAY_WIDTH, ROW_HEIGHT, TODAY_DAY } from '../constants';
import { dayToDate } from '../utils';

interface Month {
    label: string;
    startDay: number;
    days: number;
}

interface GanttTimelineProps {
    months: Month[];
    totalDays: number;
    people: GanttPerson[];
    blocks: GanttBlock[];
    editingBlock: string | null;
    colorPicker: string | null;
    addingPerson: boolean;
    scrollRef: RefObject<HTMLDivElement | null>;
    todayRef: RefObject<HTMLDivElement | null>;
    setEditingBlock: (id: string | null) => void;
    setColorPicker: (id: string | null) => void;
    onRowClick: (e: MouseEvent<HTMLDivElement>, personId: string) => void;
    onStartDrag: (e: MouseEvent, blockId: string, type: 'move' | 'resize-left' | 'resize-right') => void;
    onChangeBlockLabel: (blockId: string, label: string) => void;
    onDeleteBlock: (id: string) => void;
    onChangeBlockColor: (blockId: string, color: string) => void;
}

export function GanttTimeline({ months, totalDays, people, blocks, editingBlock, colorPicker, addingPerson, scrollRef, todayRef, setEditingBlock, setColorPicker, onRowClick, onStartDrag, onChangeBlockLabel, onDeleteBlock, onChangeBlockColor }: GanttTimelineProps) {
    const totalWidth = totalDays * DAY_WIDTH;

    return (
        <div className="gantt-timeline-scroll" ref={scrollRef}>
            <div className="gantt-timeline-inner" style={{ width: totalWidth }}>
                <div className="gantt-months" style={{ height: 40 }}>
                    {months.map(m => (
                        <div key={m.startDay} className="gantt-month-cell" style={{ width: m.days * DAY_WIDTH }}>
                            {m.label}
                        </div>
                    ))}
                </div>

                <div className="gantt-days" style={{ top: 40, height: 28 }}>
                    {Array.from({ length: totalDays }).map((_, i) => (
                        <div
                            key={i}
                            ref={i === TODAY_DAY ? todayRef : null}
                            className={['gantt-day-cell show', i === TODAY_DAY ? 'today' : ''].join(' ')}
                            style={{ width: DAY_WIDTH }}
                        >
                            {dayToDate(i).getDate()}
                        </div>
                    ))}
                </div>

                {people.map(person => (
                    <div key={person.id} className="gantt-row" style={{ height: ROW_HEIGHT }} onClick={e => onRowClick(e, person.id)}>
                        {months.map(m => (
                            <div key={m.startDay} className="gantt-grid-line" style={{ left: m.startDay * DAY_WIDTH }} />
                        ))}
                        {TODAY_DAY >= 0 && TODAY_DAY < totalDays && (
                            <div className="gantt-today-line" style={{ left: TODAY_DAY * DAY_WIDTH }} />
                        )}
                        {blocks.filter(b => b.personId === person.id).map(block => (
                            <GanttBlockItem
                                key={block.id}
                                block={block}
                                isEditing={editingBlock === block.id}
                                showColorPicker={colorPicker === block.id}
                                onStartDrag={onStartDrag}
                                onEdit={() => setEditingBlock(block.id)}
                                onEditDone={label => onChangeBlockLabel(block.id, label)}
                                onDelete={() => onDeleteBlock(block.id)}
                                onColorChange={c => onChangeBlockColor(block.id, c)}
                                onToggleColorPicker={e => { e.stopPropagation(); setColorPicker(colorPicker === block.id ? null : block.id); }}
                            />
                        ))}
                    </div>
                ))}

                {addingPerson && (
                    <div className="gantt-row" style={{ height: ROW_HEIGHT, opacity: 0.3, pointerEvents: 'none' }}>
                        {months.map(m => (
                            <div key={m.startDay} className="gantt-grid-line" style={{ left: m.startDay * DAY_WIDTH }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
