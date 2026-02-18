import { Navigate, Outlet } from "react-router-dom";
import { IsAdmin } from "../components/utils/IsAdmin.js";
import { useState, useEffect } from "react";

export const Admin = ({ token }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    IsAdmin(token).then(setIsAdmin);
  }, [token]);

  // Still loading
  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  // Admin check complete
  if (isAdmin) {
    return <Outlet />;
  }
  console.log("Not an admin!")

  return <Navigate to="/" replace />;
};
