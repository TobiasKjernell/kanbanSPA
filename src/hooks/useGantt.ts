import { useQuery } from "@tanstack/react-query";
import { fetchGanttData, type GanttBlockRow, type GanttPersonRow, type IdProject } from "../lib/supabase/queriesClient";

export interface GanttPerson {
    id: string;
    name: string;
    position: number;
}

export interface GanttBlock {
    id: string;
    personId: string;
    label: string;
    startDay: number;
    durationDays: number;
    color: string;
}

export function dbPersonToGantt(row: GanttPersonRow): GanttPerson {
    return { id: row.id, name: row.name, position: row.position };
}

export function dbBlockToGantt(row: GanttBlockRow): GanttBlock {
    return {
        id: row.id,
        personId: row.person_id,
        label: row.label,
        startDay: row.start_day,
        durationDays: row.duration_days,
        color: row.color,
    };
}

export function ganttBlockToDb(block: GanttBlock): GanttBlockRow {
    return {
        id: block.id,
        person_id: block.personId,
        label: block.label,
        start_day: block.startDay,
        duration_days: block.durationDays,
        color: block.color,
    };
}

export const useGantt = (projectId: IdProject) => {
    const { data, error, isPending } = useQuery({
        queryFn: () => fetchGanttData(projectId),
        queryKey: ["gantt", projectId],
        staleTime: 0,
    });
    console.log(data);
    return { data, isPending, error };
};
