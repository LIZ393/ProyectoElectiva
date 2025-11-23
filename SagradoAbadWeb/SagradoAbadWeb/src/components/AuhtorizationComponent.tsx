import { Navigate, Outlet, useLocation } from "react-router";

const AuthorizationComponent = () => {
  const data = localStorage.getItem("data");
  const token = data ? JSON.parse(data)?.token : null;
  const rol = data ? JSON.parse(data)?.rol : null;

  const location = useLocation();
  return token && rol === "Administrador" ? (
    <Outlet />
  ) : (
    <Navigate to={"/no-autorizado"} state={{ from: location }} replace />
  );
};

export default AuthorizationComponent;
