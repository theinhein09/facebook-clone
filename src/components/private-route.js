import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContextState } from "../contexts/user-context";

const PrivateRoute = (props) => {
  const { children } = props;
  const { user, loading } = useUserContextState();

  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <>{!user ? <Navigate to="login" replace /> : <>{children}</>}</>
      )}
    </>
  );
};

export default PrivateRoute;
