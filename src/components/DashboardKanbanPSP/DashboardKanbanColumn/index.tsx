import type { IKanbanColumn } from "..";
import type { KanbanColumns, SingleKanbanPost } from "../../../lib/supabase/queriesClient";
import DashboardKanbanCard from "../DashboardKanbanCard";

const DashboardKanbanColumns = ({ column, posts, options }: { column: IKanbanColumn, posts: SingleKanbanPost[], options: KanbanColumns }) => {
    
    return (
        <div className="flex-col bg-zinc-800 border border-zinc-700 min-h-30 rounded-xl">
            {/* Header Top Content  */}
            <div className="flex gap-2 items-center p-2 border-b border-zinc-700">
                <div className='h-2 w-2 rounded-[50%]' style={{ backgroundColor: column.color }} />
                <h2 className="text-lg psp-text-jura capitalize">{column.name}</h2>
            </div>
            {/* cards */}
            {posts.map(item => <DashboardKanbanCard key={item.created_at} status={column.name} options={options} post={item} />)}
        
        </div>
    )
}

export default DashboardKanbanColumns;