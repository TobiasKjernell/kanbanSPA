import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import {
    supabase,
    type IdProject,
    createGanttPerson, updateGanttPerson, deleteGanttPerson,
    createGanttBlock, updateGanttBlock, deleteGanttBlock, deleteGanttBlocksByPerson,
    type GanttPersonRow, type GanttBlockRow,
} from '../../lib/supabase/queriesClient';
import { useGantt, dbPersonToGantt, dbBlockToGantt, ganttBlockToDb, type GanttPerson, type GanttBlock } from '../../hooks/useGantt';
import { useRealtimePresenceRoom } from '../../hooks/useOnlineTracking';
import { Spinner } from '../shared/Spinner/spinner';
import './GanttChart.css';
import { useHorizontalScroll } from '../../hooks/useHorizontalBar';

const DAY_WIDTH = 32;
const ROW_HEIGHT = 60;
const LABEL_WIDTH = 200;
const MIN_DURATION = 1;

const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
];

const START_DATE = new Date(2026, 0, 1);
const TODAY_DAY = Math.floor((Date.now() - START_DATE.getTime()) / 86400000);

function dayToDate(day: number): Date {
    const d = new Date(START_DATE);
    d.setDate(d.getDate() + day);
    return d;
}

function generateMonths(totalDays: number) {
    const out: { label: string; startDay: number; days: number }[] = [];
    let day = 0;
    while (day < totalDays) {
        const d = dayToDate(day);
        const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        const remaining = daysInMonth - (d.getDate() - 1);
        const days = Math.min(remaining, totalDays - day);
        out.push({ label: d.toLocaleString('default', { month: 'long', year: 'numeric' }), startDay: day, days });
        day += days;
    }
    return out;
}

function daysInMonth(monthIndex: number): number {
    const d = dayToDate(0);
    return new Date(d.getFullYear(), d.getMonth() + monthIndex + 1, 0).getDate();
}

// ── Outer shell: waits for data, then mounts inner with stable initial state ──

export default function GanttChart({ currentProjectID }: { currentProjectID: IdProject }) {
    const { data, isPending } = useGantt(currentProjectID);

    if (isPending || !data) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>;
    }

    return <GanttChartInner key={currentProjectID} initialData={data} currentProjectID={currentProjectID} />;
}

// ── Inner: initializes once from data, realtime handles all updates after ──

interface InitialData {
    people: GanttPersonRow[];
    blocks: GanttBlockRow[];
}

function GanttChartInner({ initialData, currentProjectID }: { initialData: InitialData; currentProjectID: IdProject }) {
    const { users: usersMap } = useRealtimePresenceRoom(`gantt_room_${currentProjectID}`);
    const presentNames = useMemo(
        () => Array.from(new Set(Object.values(usersMap).map(u => u.name).filter(Boolean))) as string[],
        [usersMap]
    );

    const [people, setPeople] = useState<GanttPerson[]>(() => initialData.people.map(dbPersonToGantt));
    const [blocks, setBlocks] = useState<GanttBlock[]>(() => initialData.blocks.map(dbBlockToGantt));
    const [isOnline, setIsOnline] = useState('');
    const [editingBlock, setEditingBlock] = useState<string | null>(null);
    const [editingPerson, setEditingPerson] = useState<string | null>(null);
    const [addingPerson, setAddingPerson] = useState(false);
    const [newPersonName, setNewPersonName] = useState('');
    const [colorPicker, setColorPicker] = useState<string | null>(null);
    const [totalDays, setTotalDays] = useState(183);

    const totalDaysRef = useRef(totalDays);
    const blocksRef = useRef(blocks);
    const scrollRef = useHorizontalScroll({speed: 2, debounce: false})
    const addInputRef = useRef<HTMLInputElement>(null);
    const dragRef = useRef<{
        type: 'move' | 'resize-left' | 'resize-right';
        blockId: string; startX: number; origStart: number; origDur: number;
    } | null>(null);
    const didDragRef = useRef(false);
 

    // Keep refs in sync via effects (avoids "ref during render" lint error)
    useEffect(() => { totalDaysRef.current = totalDays; }, [totalDays]);
    useEffect(() => { blocksRef.current = blocks; }, [blocks]);

    // Realtime
    useEffect(() => {
        const channel = supabase
            .channel(`gantt_changes_${currentProjectID}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: `ganttPeople_${currentProjectID}` }, (payload) => {
                switch (payload.eventType) {
                    case 'INSERT':
                        setPeople(prev => prev.some(p => p.id === payload.new.id) ? prev
                            : [...prev, dbPersonToGantt(payload.new as GanttPersonRow)].sort((a, b) => a.position - b.position));
                        break;
                    case 'UPDATE':
                        setPeople(prev => prev.map(p => p.id === payload.new.id ? dbPersonToGantt(payload.new as GanttPersonRow) : p));
                        break;
                    case 'DELETE':
                        setPeople(prev => prev.filter(p => p.id !== payload.old.id));
                        break;
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: `ganttBlocks_${currentProjectID}` }, (payload) => {
                switch (payload.eventType) {
                    case 'INSERT':
                        setBlocks(prev => prev.some(b => b.id === payload.new.id) ? prev
                            : [...prev, dbBlockToGantt(payload.new as GanttBlockRow)]);
                        break;
                    case 'UPDATE':
                        setBlocks(prev => prev.map(b => b.id === payload.new.id ? dbBlockToGantt(payload.new as GanttBlockRow) : b));
                        break;
                    case 'DELETE':
                        setBlocks(prev => prev.filter(b => b.id !== payload.old.id));
                        break;
                }
            })
            .subscribe(status => setIsOnline(status));  
        return () => { channel.unsubscribe(); };
    }, [currentProjectID]);

    const months = useMemo(() => generateMonths(totalDays), [totalDays]);

    function addMonth() { setTotalDays(prev => prev + daysInMonth(generateMonths(prev).length)); }
    function removeMonth() {
        setTotalDays(prev => {
            const ms = generateMonths(prev);
            if (ms.length <= 1) return prev;
            const last = ms[ms.length - 1];
            if (blocks.some(b => b.startDay + b.durationDays > last.startDay)) return prev;
            return prev - last.days;
        });
    }

    function commitAddPerson() {
        const name = newPersonName.trim();
        if (!name) { setAddingPerson(false); setNewPersonName(''); return; }
        const id = crypto.randomUUID();
        const position = people.length;
        setPeople(prev => [...prev, { id, name, position }]);
        setAddingPerson(false);
        setNewPersonName('');
        createGanttPerson(currentProjectID, id, name, position).catch(console.error);
    }

    function renamePerson(id: string, name: string) {
        const trimmed = name.trim();
        if (!trimmed) { setEditingPerson(null); return; }
        setPeople(prev => prev.map(p => p.id === id ? { ...p, name: trimmed } : p));
        setEditingPerson(null);
        updateGanttPerson(currentProjectID, id, trimmed).catch(console.error);
    }

    function removePerson(id: string) {
        setPeople(prev => prev.filter(p => p.id !== id));
        setBlocks(prev => prev.filter(b => b.personId !== id));
        deleteGanttBlocksByPerson(currentProjectID, id).catch(console.error);
        deleteGanttPerson(currentProjectID, id).catch(console.error);
    }

    const onMouseMove = useCallback((e: globalThis.MouseEvent) => {
        if (!dragRef.current) return;
        const { type, blockId, startX, origStart, origDur } = dragRef.current;
        const delta = Math.round((e.clientX - startX) / DAY_WIDTH);
        const maxDay = totalDaysRef.current;
        setBlocks(prev => prev.map(b => {
            if (b.id !== blockId) return b;
            if (type === 'move') return { ...b, startDay: Math.max(0, Math.min(origStart + delta, maxDay - b.durationDays)) };
            if (type === 'resize-right') return { ...b, durationDays: Math.max(MIN_DURATION, Math.min(origDur + delta, maxDay - b.startDay)) };
            const newStart = Math.max(0, origStart + delta);
            return { ...b, startDay: newStart, durationDays: Math.max(MIN_DURATION, Math.min(origDur - (newStart - origStart), maxDay - newStart)) };
        }));
    }, []);

    const onMouseUp = useCallback(() => {
        if (dragRef.current) {
            didDragRef.current = true;
            setTimeout(() => { didDragRef.current = false; }, 0);
            const block = blocksRef.current.find(b => b.id === dragRef.current!.blockId);
            if (block) updateGanttBlock(currentProjectID, block.id, { start_day: block.startDay, duration_days: block.durationDays }).catch(console.error);
        }
        dragRef.current = null;
    }, [currentProjectID]);

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
    }, [onMouseMove, onMouseUp]);

    function startDrag(e: MouseEvent, blockId: string, type: 'move' | 'resize-left' | 'resize-right') {
        e.preventDefault(); e.stopPropagation();
        const b = blocks.find(x => x.id === blockId)!;
        dragRef.current = { type, blockId, startX: e.clientX, origStart: b.startDay, origDur: b.durationDays };
    }

    function handleRowClick(e: MouseEvent<HTMLDivElement>, personId: string) {
        if (editingBlock || didDragRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const day = Math.max(0, Math.floor((e.clientX - rect.left) / DAY_WIDTH));
        const id = crypto.randomUUID();
        const duration = 14;
        const color = COLORS[blocks.length % COLORS.length];
        const newBlock: GanttBlock = { id, personId, label: 'New task', startDay: day, durationDays: duration, color };
        setBlocks(prev => [...prev, newBlock]);
        setEditingBlock(id);
        setTotalDays(prev => (day + duration >= prev - 7) ? prev + daysInMonth(generateMonths(prev).length) : prev);
        createGanttBlock(currentProjectID, ganttBlockToDb(newBlock)).catch(console.error);
    }

    function deleteBlock(id: string) {
        setBlocks(prev => prev.filter(b => b.id !== id));
        if (colorPicker === id) setColorPicker(null);
        if (editingBlock === id) setEditingBlock(null);
        deleteGanttBlock(currentProjectID, id).catch(console.error);
    }

    function changeBlockColor(blockId: string, color: string) {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, color } : b));
        setColorPicker(null);
        updateGanttBlock(currentProjectID, blockId, { color }).catch(console.error);
    }

    function changeBlockLabel(blockId: string, label: string) {
        const trimmed = label.trim();
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, label: trimmed || b.label } : b));
        setEditingBlock(null);
        updateGanttBlock(currentProjectID, blockId, { label: trimmed }).catch(console.error);
    }

    const totalWidth = totalDays * DAY_WIDTH;
    const headerH = 40 + 28;
    const connectionLabel =
        isOnline === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED ? 'Connected' :
        isOnline === '' ? 'Connecting...' :
        'Disconnected';
    const connectionColor =
        isOnline === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED ? 'text-green-400' :
        isOnline === '' ? 'text-zinc-400' :
        'text-red-500';
      
    return (
        <div className="gantt-root" onClick={() => setColorPicker(null)}>
            <div className="gantt-topbar">
                <h1>Roadmap</h1>
                <span className="gantt-topbar-hint">Click a row to add · Double-click label to edit</span>
                <div className="gantt-topbar-spacer" />

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-400">Status:</span>
                    <span className={connectionColor}>{connectionLabel}</span>
                </div>

                {presentNames.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-400">Watching:</span>
                        {presentNames.map(name => <span key={name} className="psp-text-gold">{name}</span>)}
                    </div>
                )}

                <div className="gantt-topbar-divider" />
                <div className="gantt-month-controls">
                    <button className="btn-month" onClick={removeMonth}>−</button>
                    <span className="gantt-month-count">{months.length} months</span>
                    <button className="btn-month" onClick={addMonth}>+</button>
                </div>
                <div className="gantt-topbar-divider" />
                <button className="btn-add-person" onClick={() => { setAddingPerson(true); setTimeout(() => addInputRef.current?.focus(), 0); }}>
                    + Add person
                </button>
            </div>

            <div className="gantt-body">
                <div className="gantt-labels" style={{ width: LABEL_WIDTH }}>
                    <div className="gantt-labels-header" style={{ height: headerH }} />
                    {people.map(person => (
                        <div key={person.id} className="gantt-person-row" style={{ height: ROW_HEIGHT }}>
                            <div className="gantt-person-dot" />
                            {editingPerson === person.id ? (
                                <input autoFocus className="gantt-person-input" defaultValue={person.name}
                                    onBlur={e => renamePerson(person.id, e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') setEditingPerson(null); }} />
                            ) : (
                                <span className="gantt-person-name" onDoubleClick={() => setEditingPerson(person.id)} title="Double-click to rename">
                                    {person.name}
                                </span>
                            )}
                            <button className="btn-delete-person" onClick={() => removePerson(person.id)}>✕</button>
                        </div>
                    ))}
                    {addingPerson && (
                        <div className="gantt-person-row" style={{ height: ROW_HEIGHT }}>
                            <div className="gantt-person-dot" />
                            <input ref={addInputRef} className="gantt-person-input" placeholder="Name…"
                                value={newPersonName} onChange={e => setNewPersonName(e.target.value)}
                                onBlur={commitAddPerson}
                                onKeyDown={e => { if (e.key === 'Enter') commitAddPerson(); if (e.key === 'Escape') { setAddingPerson(false); setNewPersonName(''); } }} />
                        </div>
                    )}
                </div>

                <div className="gantt-timeline-scroll" ref={scrollRef}>
                    <div className="gantt-timeline-inner" style={{ width: totalWidth }}>
                        <div className="gantt-months" style={{ height: 40 }}>
                            {months.map(m => <div key={m.startDay} className="gantt-month-cell" style={{ width: m.days * DAY_WIDTH }}>{m.label}</div>)}
                        </div>
                        <div className="gantt-days" style={{ top: 40, height: 28 }}>
                            {Array.from({ length: totalDays }).map((_, i) => (
                                <div key={i} className={['gantt-day-cell show', i === TODAY_DAY ? 'today' : ''].join(' ')} style={{ width: DAY_WIDTH }}>
                                    {dayToDate(i).getDate()}
                                </div>
                            ))}
                        </div>
                        {people.map(person => (
                            <div key={person.id} className="gantt-row" style={{ height: ROW_HEIGHT }} onClick={e => handleRowClick(e, person.id)}>
                                {months.map(m => <div key={m.startDay} className="gantt-grid-line" style={{ left: m.startDay * DAY_WIDTH }} />)}
                                {TODAY_DAY >= 0 && TODAY_DAY < totalDays && <div className="gantt-today-line" style={{ left: TODAY_DAY * DAY_WIDTH }} />}
                                {blocks.filter(b => b.personId === person.id).map(block => (
                                    <GanttBlock key={block.id} block={block}
                                        isEditing={editingBlock === block.id} showColorPicker={colorPicker === block.id}
                                        onStartDrag={startDrag} onEdit={() => setEditingBlock(block.id)}
                                        onEditDone={label => changeBlockLabel(block.id, label)}
                                        onDelete={() => deleteBlock(block.id)}
                                        onColorChange={c => changeBlockColor(block.id, c)}
                                        onToggleColorPicker={e => { e.stopPropagation(); setColorPicker(colorPicker === block.id ? null : block.id); }} />
                                ))}
                            </div>
                        ))}
                        {addingPerson && (
                            <div className="gantt-row" style={{ height: ROW_HEIGHT, opacity: 0.3, pointerEvents: 'none' }}>
                                {months.map(m => <div key={m.startDay} className="gantt-grid-line" style={{ left: m.startDay * DAY_WIDTH }} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface GanttBlockProps {
    block: GanttBlock; isEditing: boolean; showColorPicker: boolean;
    onStartDrag: (e: MouseEvent, id: string, type: 'move' | 'resize-left' | 'resize-right') => void;
    onEdit: () => void; onEditDone: (label: string) => void; onDelete: () => void;
    onColorChange: (c: string) => void; onToggleColorPicker: (e: MouseEvent) => void;
}

function GanttBlock({ block, isEditing, showColorPicker, onStartDrag, onEdit, onEditDone, onDelete, onColorChange, onToggleColorPicker }: GanttBlockProps) {
    const [hovered, setHovered] = useState(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const TOOLBAR_H = 28;
    const BLOCK_H = ROW_HEIGHT - 20;

    return (
        <div className="gantt-block-wrap"
            style={{ left: block.startDay * DAY_WIDTH, width: block.durationDays * DAY_WIDTH, top: 10 - TOOLBAR_H, height: BLOCK_H + TOOLBAR_H, zIndex: hovered || showColorPicker ? 35 : 10 }}
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); setHovered(true); }}
            onMouseLeave={() => { hideTimer.current = setTimeout(() => setHovered(false), 120); }}>
            <div className={`gantt-block-toolbar${(hovered || showColorPicker) ? '' : ' hidden'}`} style={{ height: TOOLBAR_H }}>
                <button onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onEdit(); }} title="Edit">✎</button>
                <button onMouseDown={e => e.stopPropagation()} onClick={onToggleColorPicker} title="Color">◉</button>
                <button className="del" onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete">✕</button>
            </div>
            <div className="gantt-block-main">
                <div className="gantt-block" style={{ backgroundColor: block.color }} onMouseDown={e => onStartDrag(e, block.id, 'move')}>
                    <div className="gantt-block-handle left" onMouseDown={e => onStartDrag(e, block.id, 'resize-left')} />
                    <span className={`gantt-block-label${isEditing ? '' : ' editable'}`} onDoubleClick={e => { e.stopPropagation(); onEdit(); }}>
                        {isEditing ? '' : block.label}
                    </span>
                    <div className="gantt-block-handle right" onMouseDown={e => onStartDrag(e, block.id, 'resize-right')} />
                </div>
                {isEditing && (
                    <div className="gantt-block-edit" onMouseDown={e => e.stopPropagation()}>
                        <input autoFocus defaultValue={block.label} onBlur={e => onEditDone(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
                    </div>
                )}
                {showColorPicker && (
                    <div className="gantt-color-picker" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                        {COLORS.map(c => <button key={c} className={`gantt-color-swatch${block.color === c ? ' active' : ''}`} style={{ backgroundColor: c }} onClick={e => { e.stopPropagation(); onColorChange(c); }} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
