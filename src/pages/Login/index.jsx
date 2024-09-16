import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const usersList = [
  {
    email: "user1@gmail.com",
    password: "user1",
  },
  {
    email: "user2@gmail.com",
    password: "user2",
  },
];

function Login() {
  const [userData, setUserdata] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const { email, password } = userData;
    if (email && password) {
      let foundUser = usersList.find((item) => item.email === email);

      if (foundUser && foundUser.password === password) {
        localStorage.setItem("emailID", JSON.stringify(email));
        localStorage.setItem("logged", JSON.stringify(true));
        toast.success("Logged In Successfully");
        navigate("/dashboard", {
          replace: true,
        });
      } else if (foundUser && foundUser.password !== password) {
        toast.error("Incorrect Password");
      } else if (!foundUser) {
        toast.error("No User Exist");
      }
    }
  };

  const handleInput = (e) => {
    const {
      target: { name, value },
    } = e;

    setUserdata((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          p: 5,
          m: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          width: "400px",
          height: "250px",
          maxWidth: "40vw",
          borderRadius: "10px",
          background: "white",
          boxShadow: "#c3c3c352 -1px 1px 5px 4px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          Login
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type="email"
          name={"email"}
          label="Email"
          value={userData.email}
          onChange={handleInput}
        />

        <TextField
          fullWidth
          variant="outlined"
          type="password"
          name={"password"}
          label="Password"
          value={userData.password}
          onChange={handleInput}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          startIcon={<Lock />}
          disabled={!(userData.email && userData.password)}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
