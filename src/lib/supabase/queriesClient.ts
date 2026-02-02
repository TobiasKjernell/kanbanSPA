import { createClient, type QueryData, type User } from "@supabase/supabase-js";
import type z from "zod";
import type { UpdateTypeEnum } from "../../components/DashboardKanbanPSP";
import { kanbanPostSchema, loginSchema } from "../../schemas/schemas";
import type { Database } from "./database.types";
import type { Dispatch, SetStateAction } from "react";

export enum IdProject {
    slotcarracing = 1,
    numberops = 2,
    website = 3
}

export const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export const singleKanbaPost = (project_id: IdProject) => {
    return supabase.from(`kanbanPosts_${project_id}`).select('*').single();
}

export const getUsers = async () => {
    return supabase.from('crew').select('name');
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


export type KanbanColumns = QueryData<ReturnType<typeof getAllColumns>>
export type SingleKanbanPost = QueryData<ReturnType<typeof singleKanbaPost>>
export type KanbanPosts = QueryData<ReturnType<typeof allKanbanPosts>>