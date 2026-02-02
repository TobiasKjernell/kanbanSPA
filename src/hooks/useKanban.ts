import { useQuery } from "@tanstack/react-query"
import { fetchKanbanData, type IdProject, type SingleKanbanPost } from "../lib/supabase/queriesClient"
import type { Dispatch, SetStateAction } from "react"

export const useKanban = (projectID:IdProject, callback: Dispatch<SetStateAction<SingleKanbanPost[]>>) => {

      const { data, error, isPending } = useQuery({
        queryFn: () => fetchKanbanData(projectID, callback),
        queryKey: ["kanban", projectID],
        staleTime:0
    })

    return { data, isPending, error}
}