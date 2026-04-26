import { useMutation, useQuery } from "@tanstack/react-query";
import { StickyNoteIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { kanbanPostSchema } from "../../../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateKanbanPost, getUsers } from "../../../lib/supabase/queriesClient";


const DashboardKanbanCreate = ({ project }: { project: number }) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    return (
        <>
            {isCreating && <CreateForm creating={setIsCreating} project={project} />}
            <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 cursor-pointer w-fit border border-[#cea86f]/40 px-3 py-2 rounded-sm text-sm text-white hover:border-[#cea86f] hover:text-[#cea86f] transition-colors font-[Jura]"
            >
                <StickyNoteIcon size={15} className="text-[#cea86f]" />
                Create ticket
            </button>
        </>
    )
}

const CreateForm = ({ creating, project }: { creating: Dispatch<SetStateAction<boolean>>, project: number }) => {
    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(kanbanPostSchema),
        defaultValues: { status: 'planned', project, assigned: 'Tobias' }
    })

    const { data, error: errorUsers } = useQuery({
        queryFn: getUsers,
        queryKey: ['users']
    })

    const { mutate, error, isPending } = useMutation({
        mutationFn: CreateKanbanPost,
        onSuccess: () => { reset(); creating(false) },
    })

    const handleCancel = () => { reset(); creating(false); }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
        >
            <form
                className="relative w-full max-w-lg mx-4 bg-zinc-900 border border-[#cea86f]/30 rounded-sm shadow-2xl text-white font-[Jura]"
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit(values => {
                    mutate({
                        content: values.content,
                        assigned: values.assigned,
                        status: values.status,
                        project: values.project
                    })
                })}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#cea86f]/30">
                    <h2 className="text-[#cea86f] text-sm font-semibold tracking-widest uppercase">New Ticket</h2>
                    {error && (
                        <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">Server error — could not create</span>
                    )}
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-zinc-500 hover:text-[#cea86f] transition-colors text-lg leading-none cursor-pointer"
                    >✕</button>
                </div>

                {/* Assign */}
                <div className="px-6 py-4 border-b border-[#cea86f]/30 flex flex-col gap-1">
                    <label className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">Assigned to</label>
                    {errorUsers
                        ? <span className="text-xs text-red-400">Could not load users</span>
                        : <select
                            {...register('assigned')}
                            className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-2 rounded-sm focus:outline-none focus:border-[#cea86f]/60 transition-colors"
                        >
                            {data?.data?.map((user, i) => <option key={i} value={user.name!}>{user.name}</option>)}
                        </select>
                    }
                    {errors.assigned && <span className="text-xs text-red-400">{errors.assigned.message}</span>}
                </div>

                {/* Content */}
                <div className="px-6 py-4 flex flex-col gap-2">
                    <label className="text-[10px] tracking-widest uppercase text-[#cea86f]/70">Content</label>
                    <textarea
                        disabled={isPending}
                        {...register('content')}
                        className="bg-zinc-800 border border-zinc-700 text-sm text-white p-3 min-h-48 resize-none rounded-sm focus:outline-none focus:border-[#cea86f]/60 transition-colors disabled:opacity-50"
                    />
                    {errors.content && <span className="text-xs text-red-400">{errors.content.message}</span>}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#cea86f]/30">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleCancel}
                        className="text-xs cursor-pointer tracking-widest uppercase text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="text-xs tracking-widest uppercase px-5 py-2 bg-[#cea86f] text-zinc-900 font-semibold rounded-sm hover:bg-[#ddbf88] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isPending ? 'Creating…' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default DashboardKanbanCreate;
