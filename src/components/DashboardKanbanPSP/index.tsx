import { useMemo } from 'react'
import { useEffect, useState } from "react";
import { useKanban } from "../../hooks/useKanban";
import { IdProject, supabase, type SingleKanbanPost } from "../../lib/supabase/queriesClient";
import { useTicketEdit } from "./context/useTicketContext";
import DashboardKanbanColumns from "./DashboardKanbanColumn";
import DashboardKanbanCreate from "./DashboardKanbanCreate";
import DashboardKanbanEdit from "./DashboardKanbanEdit";
import { Spinner } from "../shared/Spinner/spinner";
import { useRealtimePresenceRoom } from '../../hooks/useOnlineTracking';

export interface IKanbanColumn {
    name: string,
    color: string,
}

// eslint-disable-next-line react-refresh/only-export-components
export enum UpdateTypeEnum {
    movement = "movement",
    info = "info"
}

const animateGreenBorder = (kan: SingleKanbanPost) => {
    document.querySelector(`.${kan.assigned + "-" + kan.id}`)?.animate([
        { borderColor: '#01c70b' },
        { rangeStart: "cover 100%" },
        { rangeEnd: "cover 0%" },

    ], {
        duration: 1500,
    })
}

const DashboardKanbanPSP = ({ currentProjectID }: { currentProjectID: IdProject }) => {

    const [currentPosts, setCurrentPosts] = useState<SingleKanbanPost[]>([])
    const { data, isPending } = useKanban(currentProjectID, setCurrentPosts);
    const sortColumns = data?.columns.sort((a, b) => a.position_id - b.position_id);
    const [isOnline, setIsOnline] = useState<string>('');
    const { isEditing } = useTicketEdit();

    const { users: usersMap } = useRealtimePresenceRoom('kanban_room_' + currentProjectID)
    const avatars = useMemo(() => {
        return Array.from(new Set(Object.values(usersMap).map((user) => user.name)))
    }, [usersMap])

    useEffect(() => {

        const channel = supabase
            .channel(`game_project_${currentProjectID}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: `kanbanPosts_${currentProjectID}`,
                },
                (payload) => {
                    let kan = payload.new as SingleKanbanPost;

                    switch (payload.eventType) {
                        case "INSERT":
                            setCurrentPosts((e) => [...e, kan])
                            animateGreenBorder(kan);
                            break;
                        case "UPDATE":
                            switch (kan.updateType) {
                                case UpdateTypeEnum.info:
                                    setCurrentPosts((e) => [...e.map(item => item.id === kan.id ? kan : item)])
                                    animateGreenBorder(kan);
                                    break;
                                case UpdateTypeEnum.movement:
                                    setCurrentPosts((e) => [...e.filter(item => item.id !== kan.id), kan])
                                    break;
                                default:
                                    setCurrentPosts((e) => [...e.map(item => item.id === kan.id ? kan : item)])
                                    animateGreenBorder(kan);
                                    break;
                            }
                            break;
                        case "DELETE":
                            kan = payload.old as SingleKanbanPost;
                            setCurrentPosts((e) => [...e.filter(item => item.id !== kan.id)])
                            break;
                    }
                }
            )
            .subscribe((status) => { setIsOnline(status); })

        return () => { supabase.removeChannel(channel) }
    }, [currentProjectID])


    if (isPending) return <Spinner />
    return (
        <>
            {isPending && <Spinner />}
            {data?.columns && !isPending &&
                <div className="flex flex-col w-full  psp-text-jura gap-1">
                    {isEditing && <DashboardKanbanEdit />}
                    <h2 className="flex gap-2 text-xl text-white">Kanban status:
                        <p className={isOnline === 'SUBSCRIBED' ? 'text-green-400' : 'text-red-500'}>{isOnline === 'SUBSCRIBED' ? 'Connected' : 'Disconnected'} </p>
                    </h2>
                    <h3 className='flex text-white gap-1'>
                        Active in kanban: {avatars ? avatars.map((item, index) => <p key={index} className='psp-text-gold'>{item}</p>) : ''}
                    </h3>
                    <DashboardKanbanCreate project={data!.columns[0].project_id!} />
                    <div className="grid grid-cols-1 grid-rows-none xl:grid-cols-7 xl:grid-rows-1 w-full gap-5 text-white">
                        {data!.columns.map(item => <DashboardKanbanColumns key={item.name} posts={currentPosts.filter(card => card.status === item.name && item.name)} column={item} options={sortColumns!} />)}
                    </div>
                </div>
            }
        </>
    )
}

export default DashboardKanbanPSP;      