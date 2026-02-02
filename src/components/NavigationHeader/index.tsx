import { useLogout } from "../../hooks/useLogout";
import { useUser } from "../../hooks/useUser";
import ProjectDropdown from "../shared/ProjectDropdown";
import { Spinner } from "../shared/Spinner/spinner";

const NavigationHeader = () => {
    const { user, isAuth } = useUser();
    const { isLoggingOut, logoutHandler } = useLogout();

    if (isLoggingOut) return <Spinner />
    return (
        <div className="text-white psp-border-color border-b flex justify-between items-center px-2">
            <div className="flex gap-5 cursor-pointer items-center ">
                <h1 className="text-2xl">PSP Project Kanbans</h1>
                <ProjectDropdown /> 
            </div>
            {isAuth &&
                <div className="flex gap-5 items-center">
                    <h2>{user?.user_metadata.display_name && user.user_metadata.display_name}</h2>
                    <div onClick={() => logoutHandler()} className="border psp-border-color py-3 px-4 my-2 rounded-xl cursor-pointer hover:bg-zinc-900">Sign out</div>
                </div>
            }
        </div>
    )
}

export default NavigationHeader;    