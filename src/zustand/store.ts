import { create } from "zustand";
import { IdProject } from "../lib/supabase/queriesClient";

export type DashboardView = "kanban" | "gameSettings";

interface IStore {
    currentProjectID: IdProject;
    setProject: (projectId: IdProject) => void;
    currentView: DashboardView;
    setView: (view: DashboardView) => void;
}

export const useProjectStore = create<IStore>()((set) => ({
    currentProjectID: IdProject.website,
    setProject: (project: IdProject) => set({ currentProjectID: project }),
    currentView: "kanban",
    setView: (view: DashboardView) => set({ currentView: view }),
}))     