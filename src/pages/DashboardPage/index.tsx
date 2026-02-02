import { Suspense } from "react";
import DashboardKanbanPSP from "../../components/DashboardKanbanPSP";
import { EditTicketProvider } from "../../components/DashboardKanbanPSP/context/useTicketContext";
import { Spinner } from "../../components/shared/Spinner/spinner";
import { useProjectStore } from "../../zustand/store";

const DashboardPage = () => {

    const currentProjectID = useProjectStore((state) => state.currentProjectID)

    return (
        <EditTicketProvider>
            <div className="bg-[#111] flex-1 ">
                <Suspense fallback={<Spinner />}>
                  <DashboardKanbanPSP currentProjectID={currentProjectID} />;
                </Suspense>
            </div>
        </EditTicketProvider>
    )
}

export default DashboardPage;