import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import {supabase, type IdProject, createGanttPerson, updateGanttPerson, deleteGanttPerson, createGanttBlock, updateGanttBlock, deleteGanttBlock, deleteGanttBlocksByPerson, updateGanttTotalDays, type GanttPersonRow, type GanttBlockRow,
} from '../../lib/supabase/queriesClient';
import { useGantt, dbPersonToGantt, dbBlockToGantt, ganttBlockToDb, type GanttPerson, type GanttBlock } from '../../hooks/useGantt';
import { useRealtimePresenceRoom } from '../../hooks/useOnlineTracking';
import { useHorizontalScroll } from '../../hooks/useHorizontalBar';
import { Spinner } from '../shared/Spinner/spinner';
import { GanttTopbar } from './GanttTopbar';
import { GanttLabels } from './GanttLabels';
import { GanttTimeline } from './GanttTimeline';
import { DAY_WIDTH, MIN_DURATION, COLORS, LABEL_WIDTH } from './constants';
import { generateMonths, daysInMonth } from './utils';
import './GanttChart.css';

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
    totalDays: number;
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
    const [totalDays, setTotalDays] = useState(initialData.totalDays);

    const totalDaysRef = useRef(totalDays);
    const blocksRef = useRef(blocks);
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
    const scrollRef = useHorizontalScroll({ speed: 2, debounce: false });
    const addInputRef = useRef<HTMLInputElement>(null);
    const todayRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{
        type: 'move' | 'resize-left' | 'resize-right';
        blockId: string; startX: number; origStart: number; origDur: number;
    } | null>(null);
    const didDragRef = useRef(false);

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
            .on('broadcast', { event: 'total_days' }, ({ payload }) => {
                setTotalDays(payload.totalDays as number);
            })
            .subscribe(status => setIsOnline(status));

        channelRef.current = channel;
        return () => { channel.unsubscribe(); channelRef.current = null; };
    }, [currentProjectID]);

    const months = useMemo(() => generateMonths(totalDays), [totalDays]);

    function broadcastTotalDays(days: number) {
        channelRef.current?.send({ type: 'broadcast', event: 'total_days', payload: { totalDays: days } });
    }

    function addMonth() {
        const newDays = totalDays + daysInMonth(generateMonths(totalDays).length);
        setTotalDays(newDays);
        broadcastTotalDays(newDays);
        updateGanttTotalDays(currentProjectID, newDays).catch(console.error);
    }

    function removeMonth() {
        const ms = generateMonths(totalDays);
        if (ms.length <= 1) return;
        const last = ms[ms.length - 1];
        if (blocks.some(b => b.startDay + b.durationDays > last.startDay)) return;
        const newDays = totalDays - last.days;
        setTotalDays(newDays);
        broadcastTotalDays(newDays);
        updateGanttTotalDays(currentProjectID, newDays).catch(console.error);
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

    const connectionLabel =
        isOnline === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED ? 'Connected' :
        isOnline === '' ? 'Connecting...' :
        'Disconnected';
    const connectionColor =
        isOnline === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED ? 'text-green-400' :
        isOnline === '' ? 'text-zinc-400' :
        'text-red-500';

    const headerH = 40 + 28;

    return (
        <div className="gantt-root" onClick={() => setColorPicker(null)}>
            <GanttTopbar
                connectionLabel={connectionLabel}
                connectionColor={connectionColor}
                presentNames={presentNames}
                monthCount={months.length}
                onAddMonth={addMonth}
                onRemoveMonth={removeMonth}
                onAddPerson={() => { setAddingPerson(true); setTimeout(() => addInputRef.current?.focus(), 0); }}
                todayRef={todayRef}
            />

            <div className="gantt-body">
                <GanttLabels
                    people={people}
                    headerH={headerH}
                    editingPerson={editingPerson}
                    setEditingPerson={setEditingPerson}
                    renamePerson={renamePerson}
                    removePerson={removePerson}
                    addingPerson={addingPerson}
                    newPersonName={newPersonName}
                    setNewPersonName={setNewPersonName}
                    commitAddPerson={commitAddPerson}
                    cancelAddPerson={() => { setAddingPerson(false); setNewPersonName(''); }}
                    addInputRef={addInputRef}
                />

                <GanttTimeline
                    months={months}
                    totalDays={totalDays}
                    people={people}
                    blocks={blocks}
                    editingBlock={editingBlock}
                    colorPicker={colorPicker}
                    addingPerson={addingPerson}
                    scrollRef={scrollRef}
                    todayRef={todayRef}
                    setEditingBlock={setEditingBlock}
                    setColorPicker={setColorPicker}
                    onRowClick={handleRowClick}
                    onStartDrag={startDrag}
                    onChangeBlockLabel={changeBlockLabel}
                    onDeleteBlock={deleteBlock}
                    onChangeBlockColor={changeBlockColor}
                />
            </div>
        </div>
    );
}

// re-export LABEL_WIDTH so DashboardPage doesn't need to touch internals
export { LABEL_WIDTH };
