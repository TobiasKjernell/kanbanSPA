import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { getProjectByID } from "../../../lib/supabase/helpers/helpers";
import { IdProject } from "../../../lib/supabase/queriesClient";
import { useProjectStore } from "../../../zustand/store";

const ProjectDropdown = () => {
    const { currentProjectID, setProject } = useProjectStore()
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef(null);

    const handleOutsideClick = () => setIsOpen(false);
    const handleIsOpen = () => setIsOpen(open => !open)
  
    useOutsideClick(dropdownRef, handleOutsideClick);

    return (
        <div ref={dropdownRef} className="relative w-40">
            <div className="flex">
                <div onClick={handleIsOpen} className="w-full px-2 border psp-border-color flex justify-between ">{getProjectByID(currentProjectID)}
                    <ArrowLeft className={`${isOpen ? '-rotate-90' : 'rotate-0'} transition-transform duration-100`}/>
                </div>
            </div>
            <div className={`absolute bg-zinc-900 w-full psp-border-color ${isOpen ? 'border border-t-0' : 'border-none'}  top-[100%-2px] left-0 divide-y divide-zinc-700`}>
                {isOpen &&
                    <div>
                        <div onClick={() => { setProject(IdProject.numberops); handleIsOpen(); }} className={`${currentProjectID === IdProject.numberops ? 'bg-zinc-800' : 'bg-zinc-900'} hover:bg-zinc-800 px-2`}>{getProjectByID(IdProject.numberops)}</div>
                        <div onClick={() => { setProject(IdProject.slotcarracing); handleIsOpen(); }} className={`${currentProjectID === IdProject.slotcarracing ? 'bg-zinc-800' : 'bg-zinc-900'} hover:bg-zinc-800 px-2`}>{getProjectByID(IdProject.slotcarracing)}</div>
                        <div onClick={() => { setProject(IdProject.website); handleIsOpen(); }} className={`${currentProjectID === IdProject.website ? 'bg-zinc-800' : 'bg-zinc-900'} hover:bg-zinc-800 px-2`}>{getProjectByID(IdProject.website)}</div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ProjectDropdown;