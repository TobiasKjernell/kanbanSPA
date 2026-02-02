import { useEffect, type ReactNode } from "react";
import { Spinner } from "../shared/Spinner/spinner";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isLoading, isAuth } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth && !isLoading) navigate('/login')
    }, [isAuth, isLoading, navigate])

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center">
            <Spinner />
        </div>)

    return children;
}

export default ProtectedRoute;