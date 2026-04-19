import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { MouseEvent } from 'react';
import './GanttChart.css';

const DAY_WIDTH = 32;
const ROW_HEIGHT = 60;
const LABEL_WIDTH = 180;
const MIN_DURATION = 1;

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
];

interface Person { id: string; name: string; }
interface Block {
  id: string; personId: string; label: string;
  startDay: number; durationDays: number; color: string;
}

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

export default function GanttChart() {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'André' },
    { id: '2', name: 'Mattias' },
  ]);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 'b1', personId: '1', label: 'Design phase', startDay: 5, durationDays: 30, color: '#3b82f6' },
    { id: 'b2', personId: '2', label: 'Development', startDay: 20, durationDays: 60, color: '#10b981' },
  ]);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editingPerson, setEditingPerson] = useState<string | null>(null);
  const [colorPicker, setColorPicker] = useState<string | null>(null);
  const [totalDays, setTotalDays] = useState(183);
  const totalDaysRef = useRef(183);
  const scrollRef = useRef<HTMLDivElement>(null);

  totalDaysRef.current = totalDays;
  const months = useMemo(() => generateMonths(totalDays), [totalDays]);

  function addMonth() {
    setTotalDays(prev => {
      const monthCount = generateMonths(prev).length;
      return prev + daysInMonth(monthCount);
    });
  }

  function removeMonth() {
    setTotalDays(prev => {
      const ms = generateMonths(prev);
      if (ms.length <= 1) return prev;
      const last = ms[ms.length - 1];
      const hasBlock = blocks.some(b => b.startDay + b.durationDays > last.startDay);
      if (hasBlock) return prev;
      return prev - last.days;
    });
  }

  const dragRef = useRef<{
    type: 'move' | 'resize-left' | 'resize-right';
    blockId: string; startX: number; origStart: number; origDur: number;
  } | null>(null);

  const didDragRef = useRef(false);

  const onMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!dragRef.current) return;
    const { type, blockId, startX, origStart, origDur } = dragRef.current;
    const delta = Math.round((e.clientX - startX) / DAY_WIDTH);
    const maxDay = totalDaysRef.current;
    setBlocks(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      if (type === 'move') {
        const start = Math.max(0, Math.min(origStart + delta, maxDay - b.durationDays));
        return { ...b, startDay: start };
      }
      if (type === 'resize-right') {
        const dur = Math.max(MIN_DURATION, Math.min(origDur + delta, maxDay - b.startDay));
        return { ...b, durationDays: dur };
      }
      const newStart = Math.max(0, origStart + delta);
      const dur = Math.max(MIN_DURATION, Math.min(origDur - (newStart - origStart), maxDay - newStart));
      return { ...b, startDay: newStart, durationDays: dur };
    }));
  }, []);

  const onMouseUp = useCallback(() => {
    if (dragRef.current) {
      didDragRef.current = true;
      setTimeout(() => { didDragRef.current = false; }, 0);
    }
    dragRef.current = null;
  }, []);

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
    if (editingBlock) return;
    if (didDragRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const day = Math.max(0, Math.floor(x / DAY_WIDTH));
    const id = `b${Date.now()}`;
    const duration = 14;
    setBlocks(prev => [...prev, { id, personId, label: 'New task', startDay: day, durationDays: duration, color: COLORS[prev.length % COLORS.length] }]);
    setEditingBlock(id);
    setTotalDays(prev => {
      const endDay = day + duration;
      if (endDay >= prev - 7) return prev + daysInMonth(generateMonths(prev).length);
      return prev;
    });
  }

  function deleteBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (colorPicker === id) setColorPicker(null);
    if (editingBlock === id) setEditingBlock(null);
  }

  function addPerson() {
    const id = `p${Date.now()}`;
    setPeople(prev => [...prev, { id, name: 'New person' }]);
    setEditingPerson(id);
  }

  const totalWidth = totalDays * DAY_WIDTH;
  const headerH = 40 + 28;

  return (
    <div className="gantt-root" onClick={() => setColorPicker(null)}>
      <div className="gantt-topbar">
        <h1>Roadmap</h1>
        <span className="gantt-topbar-hint">Click a row to add · Double-click label to edit</span>
        <div className="gantt-topbar-spacer" />
        <div className="gantt-month-controls">
          <button className="btn-month" onClick={removeMonth} title="Remove last month">−</button>
          <span className="gantt-month-count">{months.length} months</span>
          <button className="btn-month" onClick={addMonth} title="Add month">+</button>
        </div>
        <div className="gantt-topbar-divider" />
        <button className="btn-add-person" onClick={addPerson}>+ Add person</button>
      </div>

      <div className="gantt-body">
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
                  onBlur={e => { setPeople(prev => prev.map(p => p.id === person.id ? { ...p, name: e.target.value || p.name } : p)); setEditingPerson(null); }}
                  onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                />
              ) : (
                <span className="gantt-person-name" onDoubleClick={() => setEditingPerson(person.id)} title="Double-click to rename">
                  {person.name}
                </span>
              )}
              <button className="btn-delete-person" onClick={() => { setPeople(prev => prev.filter(p => p.id !== person.id)); setBlocks(prev => prev.filter(b => b.personId !== person.id)); }}>✕</button>
            </div>
          ))}
        </div>

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
              {Array.from({ length: totalDays }).map((_, i) => {
                const d = dayToDate(i);
                return (
                  <div
                    key={i}
                    className={['gantt-day-cell show', i === TODAY_DAY ? 'today' : ''].join(' ')}
                    style={{ width: DAY_WIDTH }}
                  >
                    {d.getDate()}
                  </div>
                );
              })}
            </div>

            {people.map(person => (
              <div
                key={person.id}
                className="gantt-row"
                style={{ height: ROW_HEIGHT }}
                onClick={e => handleRowClick(e, person.id)}
              >
                {months.map(m => (
                  <div key={m.startDay} className="gantt-grid-line" style={{ left: m.startDay * DAY_WIDTH }} />
                ))}
                {TODAY_DAY >= 0 && TODAY_DAY < totalDays && (
                  <div className="gantt-today-line" style={{ left: TODAY_DAY * DAY_WIDTH }} />
                )}
                {blocks.filter(b => b.personId === person.id).map(block => (
                  <GanttBlock
                    key={block.id}
                    block={block}
                    isEditing={editingBlock === block.id}
                    showColorPicker={colorPicker === block.id}
                    onStartDrag={startDrag}
                    onEdit={() => setEditingBlock(block.id)}
                    onEditDone={label => { setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, label: label || b.label } : b)); setEditingBlock(null); }}
                    onDelete={() => deleteBlock(block.id)}
                    onColorChange={c => { setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, color: c } : b)); setColorPicker(null); }}
                    onToggleColorPicker={e => { e.stopPropagation(); setColorPicker(colorPicker === block.id ? null : block.id); }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GanttBlockProps {
  block: Block; isEditing: boolean; showColorPicker: boolean;
  onStartDrag: (e: MouseEvent, id: string, type: 'move' | 'resize-left' | 'resize-right') => void;
  onEdit: () => void; onEditDone: (label: string) => void; onDelete: () => void;
  onColorChange: (c: string) => void; onToggleColorPicker: (e: MouseEvent) => void;
}

function GanttBlock({ block, isEditing, showColorPicker, onStartDrag, onEdit, onEditDone, onDelete, onColorChange, onToggleColorPicker }: GanttBlockProps) {
  const [hovered, setHovered] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onEnter() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHovered(true);
  }
  function onLeave() {
    hideTimer.current = setTimeout(() => setHovered(false), 120);
  }

  const toolbarVisible = hovered || showColorPicker;
  const TOOLBAR_H = 28;
  const BLOCK_H = ROW_HEIGHT - 20;

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
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={`gantt-block-toolbar${toolbarVisible ? '' : ' hidden'}`} style={{ height: TOOLBAR_H }}>
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
            {COLORS.map(c => (
              <button key={c} className={`gantt-color-swatch${block.color === c ? ' active' : ''}`} style={{ backgroundColor: c }} onClick={e => { e.stopPropagation(); onColorChange(c); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
