import { create } from "zustand";
import { IdProject } from "../lib/supabase/queriesClient";

interface IStore {
    currentProjectID: IdProject,
    setProject: (projectId: IdProject) => void
}

export const useProjectStore = create<IStore>()((set) => ({
    currentProjectID: IdProject.website,
    setProject: (project: IdProject) => set(
        {
            currentProjectID: project
        })
    }))     