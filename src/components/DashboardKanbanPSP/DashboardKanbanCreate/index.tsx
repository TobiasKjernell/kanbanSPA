import { useMutation, useQuery } from "@tanstack/react-query";
import { StickyNoteIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { kanbanPostSchema } from "../../../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateKanbanPost, getUsers } from "../../../lib/supabase/queriesClient";
import { Spinner } from "../../shared/Spinner/spinner";


const DashboardKanbanCreate = ({project}:{project:number}) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    return (
        <>
            {isCreating && <CreateForm creating={setIsCreating} project={project} />}
            <div>
                <button onClick={() => setIsCreating(true)} className="flex cursor-pointer border p-2 rounded-sm psp-border-color gap-2 text-white   hover:text-zinc-300 ">
                    <StickyNoteIcon className="psp-text-gold" />
                    Create ticket
                </button>
            </div>
        </>
    )
}

const CreateForm = ({ creating, project }: { creating: Dispatch<SetStateAction<boolean>>, project:number }) => {
    const { register, reset, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(kanbanPostSchema), defaultValues: { status: 'planned', project: project, assigned: 'Tobias' } })
    const { data, error: errorUsers } = useQuery({
        queryFn: getUsers,
        queryKey: ['users']
    })

    const { mutate, error, isPending } = useMutation({
        mutationFn: CreateKanbanPost,
        onSuccess: () => { reset(); creating(false) },
    })

    return <div className="fixed h-full w-full bg-black/30 top-0 right-0 flex flex-col justify-center items-center backdrop-blur-md psp-text-jura text-white">
        <form className="bg-zinc-900  text-lg border border-zinc-700 rounded-sm" onSubmit={handleSubmit(values => {
            mutate({
                content: values.content,
                assigned: values.assigned,
                status: values.status,
                project: values.project
            })
        })}>
            <fieldset className="flex flex-col border-b px-2 border-zinc-700">
                <div className="flex">
                    <label className="">Assign:</label>
                    {errorUsers ?
                        <div className="bg-red-500 text-xs">Cannot get users </div>
                        :
                        <select {...register('assigned')} defaultValue={'Tobias'} className="w-full bg-zinc-900 text-center">
                            {data && data.data?.map((user, index) => <option key={index} value={user.name!} >{user.name}</option>)}
                        </select>
                    }
                </div>
                {errors.assigned && <div className="bg-red-500 text-xs">{errors.assigned.message}</div>}
            </fieldset>
            <fieldset className="flex flex-col px-2">
                <label className="border-b border-zinc-700">Content</label>
                <textarea className="p-2 min-h-60 bg-zinc-800 w-auto" id="content" {...register('content')}></textarea>
                {errors.content && <div className="bg-red-500 text-xs">{errors.content.message}</div>}
            </fieldset>
            <fieldset className="flex justify-between px-2">
                <button className="cursor-pointer hover:text-zinc-300" onClick={(e) => { e.preventDefault(); reset(); creating(false) }}>Cancel</button>
                <button className="cursor-pointer hover:text-zinc-300">{isPending ? <Spinner /> : 'Create'}</button>
            </fieldset>
        </form>
        {error && <div>{error.message}</div>}
    </div>
}
export default DashboardKanbanCreate;