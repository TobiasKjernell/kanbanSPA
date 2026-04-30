import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import type { GanttBlock } from '../../../hooks/useGantt';
import { DAY_WIDTH, ROW_HEIGHT, COLORS } from '../constants';

export interface GanttBlockProps {
    block: GanttBlock;
    isEditing: boolean;
    showColorPicker: boolean;
    onStartDrag: (e: MouseEvent, id: string, type: 'move' | 'resize-left' | 'resize-right') => void;
    onEdit: () => void;
    onEditDone: (label: string) => void;
    onDelete: () => void;
    onColorChange: (c: string) => void;
    onToggleColorPicker: (e: MouseEvent) => void;
}

const TOOLBAR_H = 28;
const BLOCK_H = ROW_HEIGHT - 20;

export function GanttBlockItem({ block, isEditing, showColorPicker, onStartDrag, onEdit, onEditDone, onDelete, onColorChange, onToggleColorPicker }: GanttBlockProps) {
    const [hovered, setHovered] = useState(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (
        <div
            className="gantt-block-wrap"
            style={{
                left: block.startDay * DAY_WIDTH,
                width: block.durationDays * DAY_WIDTH,
                top: 10 - TOOLBAR_H,
                height: BLOCK_H + TOOLBAR_H,
                zIndex: hovered || showColorPicker ? 35 : 10,
            }}
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); setHovered(true); }}
            onMouseLeave={() => { hideTimer.current = setTimeout(() => setHovered(false), 120); }}
        >
            <div className={`gantt-block-toolbar${hovered || showColorPicker ? '' : ' hidden'}`} style={{ height: TOOLBAR_H }}>
                <button onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onEdit(); }} title="Edit">✎</button>
                <button onMouseDown={e => e.stopPropagation()} onClick={onToggleColorPicker} title="Color">◉</button>
                <button className="del" onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete">✕</button>
            </div>

            <div className="gantt-block-main">
                <div className="gantt-block" style={{ backgroundColor: block.color }} onMouseDown={e => onStartDrag(e, block.id, 'move')}>
                    <div className="gantt-block-handle left" onMouseDown={e => onStartDrag(e, block.id, 'resize-left')} />
                    <span
                        className={`gantt-block-label${isEditing ? '' : ' editable'}`}
                        onDoubleClick={e => { e.stopPropagation(); onEdit(); }}
                    >
                        {isEditing ? '' : block.label}
                    </span>
                    <div className="gantt-block-handle right" onMouseDown={e => onStartDrag(e, block.id, 'resize-right')} />
                </div>

                {isEditing && (
                    <div className="gantt-block-edit" onMouseDown={e => e.stopPropagation()}>
                        <input
                            autoFocus
                            defaultValue={block.label}
                            onBlur={e => onEditDone(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        />
                    </div>
                )}

                {showColorPicker && (
                    <div className="gantt-color-picker" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                        {COLORS.map(c => (
                            <button
                                key={c}
                                className={`gantt-color-swatch${block.color === c ? ' active' : ''}`}
                                style={{ backgroundColor: c }}
                                onClick={e => { e.stopPropagation(); onColorChange(c); }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
