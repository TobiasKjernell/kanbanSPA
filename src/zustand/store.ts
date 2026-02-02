import { create } from "zustand";
import { IdProject } from "../lib/supabase/queriesClient";

/**
 * Store interface for managing the active project state.
 */
interface IStore {
    /** The currently selected project identifier. */
    currentProjectID: IdProject;
    /**
     * Updates the current project.
     * @param projectId - The project identifier to set as active.
     */
    setProject: (projectId: IdProject) => void;
}

/**
 * Zustand store hook for project state management.
 *
 * @example
 * ```tsx
 * // Reading the current project
 * const currentProjectID = useProjectStore((state) => state.currentProjectID);
 *
 * // Setting a new project
 * const setProject = useProjectStore((state) => state.setProject);
 * setProject(IdProject.mobile);
 * ```
 */
export const useProjectStore = create<IStore>()((set) => ({
    currentProjectID: IdProject.website,
    setProject: (project: IdProject) => set(
        {
            currentProjectID: project
        })
    }))     