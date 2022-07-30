import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContextState } from "../contexts/user-context";

export function PrivateRoute(props) {
  const { children } = props;
  const { user, loading } = useUserContextState();

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <>{!user ? <Navigate to="/login" replace /> : <>{children}</>}</>
      )}
    </>
  );
}
