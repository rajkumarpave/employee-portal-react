import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  isSameWeek,
} from "date-fns";
import Button from "@mui/material/Button";
import { Box, TextField, Typography } from "@mui/material";

import { toast } from "react-toastify";
import { Power } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TimeSheet = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeSheet, setTimeSheet] = useState({});

  let emailID = JSON.parse(localStorage.getItem("emailID"));

  const navigate = useNavigate();

  // Get the start and end of the week
  const getWeekDays = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    const days = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  // Handlers for prev/next buttons
  const handlePrevWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const weekDays = getWeekDays(currentDate);

  const handleTimeSheetChange = (e) => {
    const {
      target: { name, value },
    } = e;

    // Allow only values between 0 and 24 (inclusive) or an empty string (for clearing input)
    const numericValue = parseInt(value, 10);

    if ((numericValue >= 0 && numericValue <= 24) || value === "") {
      setTimeSheet((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          time: value,
        },
      }));
    }
  };

  const handleRemarkChange = (e) => {
    const {
      target: { name, value },
    } = e;

    if (value.length <= 250) {
      setTimeSheet((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          remark: value,
        },
      }));
    }
  };

  const handleSubmit = () => {
    try {
      let emailID = JSON.parse(localStorage.getItem("emailID"));
      localStorage.setItem(`timesheet-${emailID}`, JSON.stringify(timeSheet));

      toast.success("Timesheet submitted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    } catch (error) {
      toast.error("unable to submit timesheet", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    }
  };

  // Initialize timeSheet with current week's dates set to default values
  useEffect(() => {
    let emailID = JSON.parse(localStorage.getItem("emailID"));
    const localTS = localStorage.getItem(`timesheet-${emailID}`);

    if (localTS) {
      let parsedLocalTS = JSON.parse(localTS);
      setTimeSheet(parsedLocalTS);
    } else {
      const initialTimeSheet = {};
      weekDays.forEach((day) => {
        const inputName = format(day, "yyy-MM-dd");
        initialTimeSheet[inputName] = {
          time: "0", // Default time value
          remark: "", // Default remark value
        };
      });
      setTimeSheet(initialTimeSheet);
    }
  }, []); // Runs whenever the week changes

  const handleLogout = () => {
    localStorage.setItem("emailID", "");
    localStorage.setItem("logged", false);
    navigate("/", {
      replace: true,
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
          p: 3,
          background: "white",
        }}
      >
        <Typography
          variant="body"
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <span>Hi!</span>
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {emailID}
          </span>
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          startIcon={<Power />}
        >
          Logout
        </Button>
      </Box>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: "white",
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button variant="outlined" onClick={handlePrevWeek}>
              Prev
            </Button>
            <Button variant="outlined" onClick={handleNextWeek}>
              Next
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              my: 4,
            }}
          >
            {weekDays.map((day, index) => {
              const inputName = format(day, "yyy-MM-dd");
              const isDisabled = !isSameWeek(day, new Date(), {
                weekStartsOn: 1,
              }); // Disable if not current week

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span>{format(day, "EEE")}</span>
                    <span>{format(day, "dd/MM/yy")}</span>
                  </Box>

                  <TextField
                    id={`time-${inputName}`}
                    variant="outlined"
                    type="text"
                    name={inputName}
                    label="Hours"
                    value={timeSheet[inputName]?.time || ""}
                    onChange={handleTimeSheetChange}
                    disabled={isDisabled} // Disable if not in current week
                  />
                  <TextField
                    id={`remark-${inputName}`}
                    variant="outlined"
                    type="text"
                    name={inputName}
                    label="Remark"
                    value={timeSheet[inputName]?.remark || ""}
                    onChange={handleRemarkChange}
                    disabled={isDisabled} // Disable if not in current week
                    helperText={
                      !isNaN(timeSheet[inputName]?.remark.length) &&
                      `${250 - timeSheet[inputName]?.remark.length} char left`
                    }
                  />
                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TimeSheet;
