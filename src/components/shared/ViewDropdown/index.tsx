import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { type DashboardView, useProjectStore } from "../../../zustand/store";
import { IdProject } from "../../../lib/supabase/queriesClient";

const viewLabels: Record<DashboardView, string> = {
    kanban: "Kanban",
    gameSettings: "Game Settings",
    gantt: "Gantt"
};

const views: DashboardView[] = ["kanban", "gameSettings", "gantt"];

const ViewDropdown = () => {
    const { currentView, setView, currentProjectID } = useProjectStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleOutsideClick = () => setIsOpen(false);
    const handleIsOpen = () => setIsOpen((open) => !open);

    useOutsideClick(dropdownRef, handleOutsideClick);

    return (
        <div ref={dropdownRef} className="relative w-44">
            <div className="flex">
                <div
                    onClick={handleIsOpen}
                    className="w-full px-2 border psp-border-color flex justify-between items-center cursor-pointer"
                >
                     {currentProjectID === IdProject.website && currentView === views[1] ? 'Web Settings' : <p>{viewLabels[currentView]}</p>}
                    <ArrowLeft
                        className={`${isOpen ? "-rotate-90" : "rotate-0"} transition-transform duration-100`}
                    />
                </div>
            </div>
            <div
                className={`absolute z-50 bg-zinc-900 w-full psp-border-color ${isOpen ? "border border-t-0" : "border-none"} top-full left-0 divide-y divide-zinc-700`}
            >
                {isOpen &&
                    <div>
                        {views.map((view) => ( 
                            <div
                                key={view}
                                onClick={() => { setView(view); handleIsOpen(); }}
                                className={`${currentView === view ? "bg-zinc-800" : "bg-zinc-900"} hover:bg-zinc-800 px-2 cursor-pointer`}
                            >
                                {currentProjectID === IdProject.website && view === views[1] ? 'Web Settings' : viewLabels[view]}
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
};

export default ViewDropdown;
