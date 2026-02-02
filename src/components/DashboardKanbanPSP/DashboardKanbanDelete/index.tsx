import { useMutation } from "@tanstack/react-query";
import { useTicketEdit } from "../context/useTicketContext";
import { DeleteTicket, IdProject } from "../../../lib/supabase/queriesClient";
import { Spinner } from "../../shared/Spinner/spinner";



const DashboardKanbanDelete = () => {
    const { currentTicket,  handleSetTicket } = useTicketEdit();
    const { mutate, isPending, error } = useMutation(
        {
            mutationFn: DeleteTicket,
            onSuccess: () => { handleSetTicket(null);  }
        },
    );

    return (
        <>
            {error ? <span className="text-red-500 text-xl font-semibold">Cannot delete, server issues</span>
                : <button disabled={isPending} onClick={(e) => {
                    e.preventDefault(); mutate(
                        {
                            ticketId: currentTicket!.id,
                            projectId: currentTicket?.project_id as IdProject
                        })
                }}
                    className="cursor-pointer text-red-500 font-semibold text-xl">
                    {isPending ? <Spinner /> : 'Delete'}
                </button>
            }
        </>
    )
}
export default DashboardKanbanDelete;