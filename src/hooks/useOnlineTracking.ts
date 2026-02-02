import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useUser } from './useUser'
import { supabase } from '../lib/supabase/queriesClient'

export type RealtimeUser = {
    id: string
    name: string
}

export const useRealtimePresenceRoom = (roomName: string) => {
    const { user } = useUser();
    const [users, setUsers] = useState<Record<string, RealtimeUser>>({})

    useEffect(() => {
        const room = supabase.channel(roomName)

        room
            .on('presence', { event: 'sync' }, () => {
                const newState = room.presenceState<{ name: string }>()

                const newUsers = Object.fromEntries(
                    Object.entries(newState).map(([key, values]) => [
                        key,
                        { name: values[0].name },
                    ])
                ) as Record<string, RealtimeUser>
                setUsers(newUsers)
            })
            .subscribe(async (status: REALTIME_SUBSCRIBE_STATES) => {
                if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
                    await room.track({
                        name: user?.user_metadata.display_name,
                    })
                } else {
                    setUsers({})
                }
            })

        return () => {
            room.unsubscribe()
        }
    }, [roomName, user])

    return { users }
}
