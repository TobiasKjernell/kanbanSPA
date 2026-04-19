import { Suspense } from "react";
import DashboardKanbanPSP from "../../components/DashboardKanbanPSP";
import { EditTicketProvider } from "../../components/DashboardKanbanPSP/context/useTicketContext";
import GameSettings from "../../components/GameSettings";
import GanttChart from "../../components/Gant/GanttChart";
import { Spinner } from "../../components/shared/Spinner/spinner";
import { useProjectStore } from "../../zustand/store";

const DashboardPage = () => {

    const currentProjectID = useProjectStore((state) => state.currentProjectID)
    const currentView = useProjectStore((state) => state.currentView)

    return (
        <EditTicketProvider>
            <div className="bg-[#111] flex-1 overflow-hidden flex flex-col">
                {currentView === "kanban" ? (
                    <Suspense fallback={<Spinner />}>
                        <DashboardKanbanPSP currentProjectID={currentProjectID} />
                    </Suspense>
                ) : currentView === "gantt" ? (
                    <GanttChart />
                ) : (
                    <GameSettings currentProjectID={currentProjectID} />
                )}
            </div>
        </EditTicketProvider>
    )
}

export default DashboardPage;