import { createContext, useContext, useState } from "react";
import type { SingleKanbanPost } from "../../../lib/supabase/queriesClient";

interface IEditContext {
    toggleEditing: (state:boolean) => void,
    isEditing: boolean;
    currentTicket: SingleKanbanPost | null,
    handleSetTicket: (item: SingleKanbanPost | null) => void
}

const EditTicketContext = createContext<IEditContext | null>(null);

const EditTicketProvider = ({ children }: { children: React.ReactNode }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false); 
    const [currentTicket, setCurrentTicker] = useState<SingleKanbanPost | null>(null);
    const toggleEditing = (state:boolean) => setIsEditing(state);
    const handleSetTicket = (item:SingleKanbanPost | null) => {setCurrentTicker(item); if(item) toggleEditing(true); else toggleEditing(false);  }

    return <EditTicketContext.Provider value={{ isEditing, toggleEditing, currentTicket, handleSetTicket }}>
        {children}
    </EditTicketContext.Provider>
}

const useTicketEdit = () => {
    const context:IEditContext | null = useContext(EditTicketContext);
    if (context === undefined) throw new Error('edit ticket context was used outside provider')
    return context as IEditContext;
}

// eslint-disable-next-line react-refresh/only-export-components
export { EditTicketProvider, useTicketEdit };
