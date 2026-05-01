import { createClient, type QueryData, type User } from "@supabase/supabase-js";
import type z from "zod";
import type { UpdateTypeEnum } from "../../components/DashboardKanbanPSP";
import { kanbanPostSchema, loginSchema, signUpSchema } from "../../schemas/schemas";
import type { Database } from "./database.types";
import type { Dispatch, SetStateAction } from "react";

export enum IdProject {
    slotcarracing = 1,
    numberops = 2,
    website = 3
}

export const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export const singleKanbaPost = (project_id: IdProject) => {
    return supabase.from(`kanbanPosts_${project_id}`).select('*').single();
}

export const getUsers = async () => {
    return supabase.from('crew').select('name');
}

export const getCrew = async () => {
    const { data, error } = await supabase.from('crew').select('id, name, email').order('id');
    if (error) throw new Error(error.message);
    return data;
}

export const allKanbanPosts = async (project_id: IdProject) => {
    return supabase.from(`kanbanPosts_${project_id}`).select('*');
}

export const getAllColumns = async (project_id: IdProject) => {
    return supabase.from(`kanbanColumns_${project_id}`).select('*');
}

export const UpdateKanbanPost = async ({ updateKanbanPost, id, updateType }: { updateKanbanPost: z.infer<typeof kanbanPostSchema>, id: number, updateType: UpdateTypeEnum }) => {
    const parsedData = kanbanPostSchema.parse(updateKanbanPost);
    const isValid = kanbanPostSchema.safeParse(parsedData);

    if (isValid) {
        await supabase.from(`kanbanPosts_${parsedData.project as IdProject}`).update({ status: parsedData.status, updateType: updateType }).eq('id', id).select('*').single();
    }

}

export const CreateKanbanPost = async (createInfo: z.infer<typeof kanbanPostSchema>) => {
    const parsedData = kanbanPostSchema.parse(createInfo);
    const isValid = kanbanPostSchema.safeParse(parsedData);
    if (isValid) {
        const { error } = await supabase.from(`kanbanPosts_${createInfo.project as IdProject}`).insert([{ status: parsedData.status, assigned: parsedData.assigned, content: parsedData.content, project_id: parsedData.project }])
        if (error) throw new Error(error.message)
    }
}

export const DeleteTicket = async ({ ticketId, projectId }: { ticketId: number, projectId: IdProject }) => {
    await supabase.from(`kanbanPosts_${projectId}`).delete().eq('id', ticketId);
}

export const EditKanbanPost = async ({ ticketId, createInfo, updateType }: { createInfo: z.infer<typeof kanbanPostSchema>, ticketId: number, updateType: UpdateTypeEnum }) => {
    const parsedData = kanbanPostSchema.parse(createInfo);
    const isValid = kanbanPostSchema.safeParse(parsedData);

    if (isValid) {
        const { error } = await supabase.from(`kanbanPosts_${parsedData.project as IdProject}`)
            .update({ status: parsedData.status, assigned: parsedData.assigned, content: parsedData.content, tester: parsedData.tester, tester_feedback: parsedData.testerFeedback, updateType: updateType })
            .eq('id', ticketId).select('*').single();
        if (error) throw new Error(error.message)
    }
}

export const getUser = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;

    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message)

    return data?.user;
}

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}

export const signUp = async (userDataValues: z.infer<typeof signUpSchema>): Promise<User> => {
    const parsedData = signUpSchema.parse(userDataValues);

    const { data, error } = await supabase.auth.signUp({
        email: parsedData.email,
        password: parsedData.password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Signup failed');

    const { error: crewError } = await supabase.from('crew').insert({
        email: parsedData.email,
        name: parsedData.username,
    });

    if (crewError) throw new Error(crewError.message);

    return data.user;
};

export const login = async (userDataValues: z.infer<typeof loginSchema>):Promise<User | {
    error: string;
}> => {
    const parsedData = loginSchema.parse(userDataValues);
    const {data, error } = await supabase.auth.signInWithPassword(parsedData);

    if (error) return { error: error.message }

    return data.user;
}

export const fetchKanbanData = async (projectId: IdProject, setPosts: Dispatch<SetStateAction<SingleKanbanPost[]>>) => {

  const [columns, posts] = await Promise.all([
    getAllColumns(projectId),
    allKanbanPosts(projectId),
  ]);

  if (columns.error || posts.error) {
    throw new Error("Couldn't fetch from database");
  }
  setPosts(posts.data);
  return {
    columns: columns.data,
    posts: posts.data,
  };
};


// ─── Gantt ───

export interface GanttPersonRow {
    id: string;
    name: string;
    position: number;
}

export interface GanttBlockRow {
    id: string;
    person_id: string;
    label: string;
    start_day: number;
    duration_days: number;
    color: string;
}

export const getAllGanttPeople = async (projectId: IdProject) => {
    return db.from(`ganttPeople_${projectId}`).select('*').order('position');
};

export const getAllGanttBlocks = async (projectId: IdProject) => {
    return db.from(`ganttBlocks_${projectId}`).select('*');
};

export const fetchGanttTotalDays = async (projectId: IdProject): Promise<number> => {
    const { data, error } = await db.from(`ganttSettings_${projectId}`).select('total_days').eq('id', 1).single();
    if (error) return 183;
    return (data?.total_days as number) ?? 183;
};

export const updateGanttTotalDays = async (projectId: IdProject, totalDays: number) => {
    const { error } = await db
        .from(`ganttSettings_${projectId}`)
        .upsert({ id: 1, total_days: totalDays }, { onConflict: 'id' });
    if (error) {
        console.error(`updateGanttTotalDays failed for project ${projectId}:`, error);
        throw new Error(error.message);
    }
};

export const fetchGanttData = async (projectId: IdProject) => {
    const [peopleRes, blocksRes, totalDays] = await Promise.all([
        getAllGanttPeople(projectId),
        getAllGanttBlocks(projectId),
        fetchGanttTotalDays(projectId),
    ]);
    if (peopleRes.error) throw new Error(peopleRes.error.message);
    if (blocksRes.error) throw new Error(blocksRes.error.message);
    return { people: peopleRes.data as GanttPersonRow[], blocks: blocksRes.data as GanttBlockRow[], totalDays };
};

export const createGanttPerson = async (projectId: IdProject, id: string, name: string, position: number) => {
    const { error } = await db.from(`ganttPeople_${projectId}`).insert({ id, name, position });
    if (error) throw new Error(error.message);
};

export const updateGanttPerson = async (projectId: IdProject, id: string, name: string) => {
    const { error } = await db.from(`ganttPeople_${projectId}`).update({ name }).eq('id', id);
    if (error) throw new Error(error.message);
};

export const deleteGanttPerson = async (projectId: IdProject, id: string) => {
    const { error } = await db.from(`ganttPeople_${projectId}`).delete().eq('id', id);
    if (error) throw new Error(error.message);
};

export const createGanttBlock = async (projectId: IdProject, block: GanttBlockRow) => {
    const { error } = await db.from(`ganttBlocks_${projectId}`).insert(block);
    if (error) throw new Error(error.message);
};

export const updateGanttBlock = async (projectId: IdProject, id: string, updates: Partial<Omit<GanttBlockRow, 'id'>>) => {
    const { error } = await db.from(`ganttBlocks_${projectId}`).update(updates).eq('id', id);
    if (error) throw new Error(error.message);
};

export const deleteGanttBlock = async (projectId: IdProject, id: string) => {
    const { error } = await db.from(`ganttBlocks_${projectId}`).delete().eq('id', id);
    if (error) throw new Error(error.message);
};

export const deleteGanttBlocksByPerson = async (projectId: IdProject, personId: string) => {
    const { error } = await db.from(`ganttBlocks_${projectId}`).delete().eq('person_id', personId);
    if (error) throw new Error(error.message);
};

// ─── Game Settings ───

export const getGameSettings = async (projectId: IdProject) => {
    return supabase.from(`gameSettings_${projectId}`).select('*');
};

export const getGameSettingsBySection = async (projectId: IdProject, section: string) => {
    return supabase.from(`gameSettings_${projectId}`).select('*').eq('section', section);
};

export const updateGameSetting = async (projectId: IdProject, section: string, key: string, value: string) => {
    const { error } = await supabase
        .from(`gameSettings_${projectId}`)
        .update({ value })
        .eq('section', section)
        .eq('key', key);
    if (error) throw new Error(error.message);
};

export const updateGameSettingsSection = async (
    projectId: IdProject,
    section: string,
    settings: Record<string, string | number | boolean>
) => {
    const updates = Object.entries(settings).map(([key, value]) =>
        supabase
            .from(`gameSettings_${projectId}`)
            .update({ value: String(value) })
            .eq('section', section)
            .eq('key', key)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);
};

// ─── Types ───

export type GameSettingRow = {
    id: number;
    section: string;
    key: string;
    value: string;
    value_type: string;
    updated_at: string;
    updated_by: string | null;
};

export type KanbanColumns = QueryData<ReturnType<typeof getAllColumns>>
export type SingleKanbanPost = QueryData<ReturnType<typeof singleKanbaPost>>
export type KanbanPosts = QueryData<ReturnType<typeof allKanbanPosts>>