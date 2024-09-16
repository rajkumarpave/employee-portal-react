import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Icon,
  InputAdornment,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material"; // Importing MUI icons
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

const LoginForm = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loggingIn, setLoggingIn] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error state when the user modifies input
    setIsError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const { email, password } = userData;

    if (email && password) {
      const foundUser = usersList.find((user) => user.email === email);
      setLoggingIn(true); // Show loading spinner

      setTimeout(() => {
        if (foundUser) {
          if (foundUser.password === password) {
            localStorage.setItem("emailID", JSON.stringify(email));
            localStorage.setItem("logged", JSON.stringify(true));
            toast.success("Logged In Successfully");
            navigate("/dashboard", { replace: true });
          } else {
            toast.error("Incorrect Password");
            setIsError(true);
          }
        } else {
          toast.error("No User Exist");
          setIsError(true);
        }
        setLoggingIn(false); // Stop loading spinner
      }, 1000); // Simulate a delay for the login
    } else {
      toast.error("Please fill in all fields");
      setIsError(true);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      sx={{
        background:
          "linear-gradient(135deg, rgba(0,212,255,1) 0%, rgba(9,121,143,1) 100%)",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        gap={2}
        bgcolor="background.paper"
        p={4}
        m={2}
        borderRadius={2}
        width="17rem"
        height="40vh"
        boxShadow={3}
      >
        <Box display="flex" justifyContent="center" alignItems="center" gap={5}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <span>Employee Portal</span>
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            name="email"
            variant="filled"
            value={userData.email}
            onChange={handleInput}
            error={isError}
            helperText={isError ? "Invalid email or password" : ""}
            disabled={loggingIn}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            name="password"
            variant="filled"
            type="password"
            value={userData.password}
            onChange={handleInput}
            error={isError}
            helperText={isError ? "Invalid email or password" : ""}
            disabled={loggingIn}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loggingIn}
          fullWidth
        >
          {loggingIn ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <CircularProgress size={20} color="inherit" />
              <span>Loading</span>
            </Box>
          ) : (
            "Login"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
