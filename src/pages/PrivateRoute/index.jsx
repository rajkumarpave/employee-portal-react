import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

import Login from "../Login";

function PrivateRoute({ element = null }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      let isLoggedInLocal = localStorage.getItem("logged");
      let isLoggedInParsed = JSON.parse(isLoggedInLocal);
      console.log({ isLoggedInLocal, isLoggedInParsed });
      setIsLoggedIn(isLoggedInParsed ? true : false);
    } catch (e) {
      console.error(e);
    }
  }, []);

  console.log({ isLoggedIn, location });

  if (isLoggedIn) {
    return element;
  }
  return <Login />;

  // return isLoggedIn ? { element } : <Navigate to={"/"} replace />;
  return null;
}

export default PrivateRoute;
