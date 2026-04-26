
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { EditKanbanPost, getUsers } from "../../../lib/supabase/queriesClient.ts";
import { kanbanPostSchema } from "../../../schemas/schemas.ts";
import { useTicketEdit } from "../context/useTicketContext";
import { UpdateTypeEnum } from "../index.tsx";
import DashboardKanbanDelete from "../DashboardKanbanDelete/index.tsx";


const DashboardKanbanEdit = () => {

    const { handleSetTicket, currentTicket } = useTicketEdit();
    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(kanbanPostSchema), defaultValues:
        {
            status: currentTicket!.status!,
            content: currentTicket!.content!,
            assigned: currentTicket!.assigned!,
            tester: currentTicket!.tester! === 'none' || currentTicket!.tester! === '' ? 'none' : currentTicket!.tester!,
            testerFeedback: currentTicket!.tester_feedback ? currentTicket!.tester_feedback : '',
            project: currentTicket?.project_id
        }
    })

    const { data, error: errorUsers } = useQuery({
        queryFn: getUsers,
        queryKey: ['users']
    })

    const { mutate, isPending, error: errorEdit } = useMutation({
        mutationFn: EditKanbanPost,
        onSuccess: () => { handleCancel(); },
    })

    const handleCancel = () => {
        handleSetTicket(null); reset();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
        >
            <form
                className="relative w-full max-w-2xl mx-4 bg-zinc-900 border border-[#cea86f]/30 rounded-sm shadow-2xl text-white font-[Jura]"
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit(values => {
                    mutate({
                        ticketId: currentTicket!.id,
                        createInfo: {
                            content: values.content,
                            assigned: values.assigned,
                            status: values.status,
                            tester: values.tester === 'none' || values.tester === '' ? 'none' : values.tester,
                            testerFeedback: values.testerFeedback ? values.testerFeedback : '',
                            project: currentTicket!.project_id!
                        },
                        updateType: UpdateTypeEnum.info
                    })
                })}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#cea86f]/30">
                    <h2 className="text-[#cea86f] text-sm font-semibold tracking-widest uppercase">Edit Ticket</h2>
                    {errorEdit && (
                        <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">Server error — could not save</span>
                    )}
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-zinc-500 hover:text-[#cea86f] transition-colors text-lg leading-none cursor-pointer"
                    >✕</button>
                </div>

                {/* Assign & Tester row */}
                <div className="grid grid-cols-2 gap-px bg-[#cea86f]/10 border-b border-[#cea86f]/30">
                    <div className="bg-zinc-900 px-6 py-4 flex flex-col gap-1">
                        <label className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">Assigned to</label>
                        {errorUsers
                            ? <span className="text-xs text-red-400">Could not load users</span>
                            : <select {...register('assigned')} className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-sm focus:outline-none focus:border-[#cea86f]/60 transition-colors">
                                {data?.data?.map((user, i) => <option key={i} value={user.name!}>{user.name}</option>)}
                            </select>
                        }
                        {errors.assigned && <span className="text-xs text-red-400">{errors.assigned.message}</span>}
                    </div>
                    <div className="bg-zinc-900 px-6 py-4 flex flex-col gap-1">
                        <label className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">Tester</label>
                        {errorUsers
                            ? <span className="text-xs text-red-400">Could not load users</span>
                            : <select {...register('tester')} className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-sm focus:outline-none focus:border-[#cea86f]/60 transition-colors">
                                <option value="none">None</option>
                                {data?.data?.map((user, i) => <option key={i} value={user.name!}>{user.name}</option>)}
                            </select>
                        }
                        {errors.tester && <span className="text-xs text-red-400">{errors.tester.message}</span>}
                    </div>
                </div>

                {/* Content & Test notes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#cea86f]/10">
                    <div className="bg-zinc-900 px-6 py-4 flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">Content</label>
                        <textarea
                            disabled={isPending}
                            {...register('content')}
                            className="bg-zinc-800 border border-zinc-700 text-sm text-white p-3 min-h-48 resize-none rounded-sm focus:outline-none focus:border-[#cea86f]/60 transition-colors disabled:opacity-50"
                        />
                        {errors.content && <span className="text-xs text-red-400">{errors.content.message}</span>}
                    </div>
                    <div className="bg-zinc-900 px-6 py-4 flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">Test notes</label>
                        <textarea
                            disabled={isPending}
                            {...register('testerFeedback')}
                            className="bg-zinc-800 border border-zinc-700 text-sm text-white p-3 min-h-48 resize-none rounded-sm focus:outline-none focus:border-[#cea86f]/60 transition-colors disabled:opacity-50"
                        />
                        {errors.testerFeedback && <span className="text-xs text-red-400">{errors.testerFeedback.message}</span>}
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#cea86f]/30">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleCancel}
                        className="text-xs cursor-pointer tracking-widest uppercase text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <DashboardKanbanDelete />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="text-xs tracking-widest cursor-pointer uppercase px-5 py-2 bg-[#cea86f] text-zinc-900 font-semibold rounded-sm hover:bg-[#ddbf88] transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Saving…' : 'Save'}
                    </button>
                </div>

                {errors.root && <div className="px-6 pb-4 text-xs text-red-400">{errors.root.message}</div>}
            </form>
        </div>
    )
}

export default DashboardKanbanEdit;
