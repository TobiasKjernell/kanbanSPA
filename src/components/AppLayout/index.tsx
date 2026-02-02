import { Outlet } from "react-router-dom";
import NavigationHeader from "../NavigationHeader";
import { useUser } from "../../hooks/useUser";

const AppLayout = () => {
    const { isAuth } = useUser();
    return (
        <div className="flex flex-col min-h-screen max-w-screen bg-[#111] ">
            {isAuth && <NavigationHeader />}
            <div className="px-5 flex-1">
                <Outlet />
            </div>
        </div>
    )
}

export default AppLayout;           