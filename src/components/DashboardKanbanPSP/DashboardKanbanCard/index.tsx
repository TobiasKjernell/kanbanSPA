import { useMutation } from "@tanstack/react-query"
import { Mail, Settings } from "lucide-react"
import { useTicketEdit } from "../context/useTicketContext"
import { useEffect } from "react"
import { UpdateTypeEnum } from ".."
import { UpdateKanbanPost, type KanbanColumns, type SingleKanbanPost } from "../../../lib/supabase/queriesClient"

interface IKanbanCard {
    status: string,
    options: KanbanColumns
    post: SingleKanbanPost
}   

const DashboardKanbanCard = ({ status, options, post }: IKanbanCard) => {
    const { handleSetTicket } = useTicketEdit()
    const { mutate, isPending } = useMutation({
        mutationFn: UpdateKanbanPost,
        onSuccess() {
       
        },
    })  

    useEffect(() => {
     document.querySelector(`.${post.assigned + "-" + post.id}`)?.animate([
                { borderColor: '#cea86f' },
                { rangeStart: "cover 100%" },
                { rangeEnd: "cover 0%" },

            ], {
                duration: 1500,
            })
    },[post.assigned, post.id])

    return (
        <div className={`${post.assigned + "-" + post.id.toString()} p-2 border-zinc-700 border m-2 flex flex-col gap-2 bg-zinc-900 rounded-sm font-jura`}>
            <div className="flex gap-2">
                <select defaultValue={status} onChange={(e) => mutate({
                    id: post.id,
                    updateKanbanPost:   
                    {
                        status: e.currentTarget.value,
                        assigned: post.assigned!,
                        content: post.content!,
                        project: post.project_id,
                    },
                    updateType: UpdateTypeEnum.movement
                })} className="bg-zinc-900 border-zinc-700 border w-full capitalize">
                    {options && options.map(optionValue => <option key={optionValue.name} value={optionValue.name}>{optionValue.name}</option>)}
                </select>
                <button onClick={() => { handleSetTicket(post);}} className="cursor-pointer">
                    <Settings className="hover:text-zinc-400" />
                </button>
            </div>
            <h3 className="text-[14px]">{isPending ? 'Syncing..' : post.content}</h3>   
            <div className="flex text-sm psp-text-gold items-center justify-between">
                {post.tester && post.tester !== 'none' ? <h4 className="text-sm psp-text-gold">Tester: {post.tester}</h4> : ''}
                {post.tester_feedback && <Mail />}
            </div>
            <div className="flex text-sm psp-text-gold items-center justify-between">
                <h4 className="text-sm psp-text-gold">Assigned to: {post.assigned}</h4>
                <span className="flex text-white">#<div className="psp-text-gold">{post.id}</div></span>
            </div>
        </div>
    )
}

export default DashboardKanbanCard