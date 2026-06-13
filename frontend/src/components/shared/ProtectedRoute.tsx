import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";


export function ProtectedRoute({children,allowedRoles}:{children:React.ReactNode,allowedRoles?:string[]}){
    const {isAuthenticated,isLoading,user} = useAuth();
    if(isLoading){
        return <div>...Loading</div>
    }

    if(isAuthenticated){
        if(allowedRoles && !allowedRoles.includes(user?.role)){
            return <div>Not authorized</div>;
        }
        return children;
    }

    return <Navigate to="/login" />;

}