import { useLogout } from "../../hooks/useLogout";
import { useUser } from "../../hooks/useUser";
import ProjectDropdown from "../shared/ProjectDropdown";
import ViewDropdown from "../shared/ViewDropdown";
import { Spinner } from "../shared/Spinner/spinner";

const NavigationHeader = () => {
    const { user, isAuth } = useUser();
    const { isLoggingOut, logoutHandler } = useLogout();

    if (isLoggingOut) return <Spinner />
    return (
        <div className="text-white psp-border-color border-b flex flex-wrap justify-between items-center px-2 gap-2 py-2 md:py-2">
            <div className="flex flex-col items-start sm:flex-row flex-wrap gap-3 md:gap-5 cursor-pointer sm:items-center">
                <h1 className="text-lg md:text-2xl">PSP Dashboard</h1>
                <div>
                    <p className="border border-b-0 w-fit px-1 psp-border-color bg-zinc-800">Project</p>
                    <ProjectDropdown />
                </div>
                <div className="flex flex-col">
                    <p className="border-l psp-border-color border border-b-0 w-fit px-1 bg-zinc-800">Area</p>
                    <ViewDropdown />
                </div>
            </div>
            {isAuth &&
                <div className="flex gap-3 md:gap-5 items-center">
                    <h2 className="hidden sm:block">{user?.user_metadata.display_name && user.user_metadata.display_name}</h2>
                    <div onClick={() => logoutHandler()} className="border psp-border-color py-2 px-3 md:py-3 md:px-4 rounded-xl cursor-pointer hover:bg-zinc-900 text-sm md:text-base">Sign out</div>
                </div>
            }
        </div>
    )
}

export default NavigationHeader;    