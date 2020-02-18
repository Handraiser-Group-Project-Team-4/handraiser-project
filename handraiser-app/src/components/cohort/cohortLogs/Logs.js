import React, { useState, useEffect, useContext } from "react";
import { Paper, Grid, TextField, InputAdornment } from "@material-ui/core";

//ICONS
import SearchIcon from "@material-ui/icons/Search";

import { DarkModeContext } from "../../../App";

const Logs = ({ classes, Timeline, changeHandler, logs, search }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    let filter = [];
    if (search) {
      logs.filter(log => {
        const regex = new RegExp(search, "gi");
        return log.action_made.match(regex) || log.date_time.match(regex)
          ? filter.push(log)
          : null;
      });
      setSearchResult(filter);
    } else {
      setSearchResult([]);
    }
  }, [search]);

  return (
    <Paper className={classes.paperr} elevation={2}>
      <Grid
        container
        spacing={0}
        className={classes.gridContainerr + " " + classes.banner}
        style={{
          backgroundColor: darkMode ? "#333" : null
        }}
      >
        <Grid
          container
          item
          xs={12}
          sm={8}
          md={8}
          lg={8}
          className={classes.logs}
        >
          <Timeline>
            <ul className={classes.timeline}>
              <div
                className="timeline-content"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignContent: "center"
                }}
              >
                <h2 className="timeline-title">
                  {" "}
                  {searchResult.length ? "Search Result/s" : "Cohort Logs"}
                </h2>
                <TextField
                  id="outlined-search"
                  label="Search field"
                  type="search"
                  size={"small"}
                  name="search"
                  variant="outlined"
                  onChange={changeHandler}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              {searchResult.length
                ? searchResult.map((log, i) => (
                    <li className="timeline-item" key={i}>
                      <div className="timeline-info">
                        <span>{log.date_time}</span>
                      </div>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        {/* <Avatar alt="Remy Sharp" /> */}
                        <h3 className="timeline-title">{log.action_made}</h3>
                      </div>
                    </li>
                  ))
                : logs.map((log, i) => (
                    <li className="timeline-item" key={i}>
                      <div className="timeline-info">
                        <span>{log.date_time}</span>
                      </div>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        {/* <Avatar alt="Remy Sharp" /> */}
                        <h3 className="timeline-title">{log.action_made}</h3>
                      </div>
                    </li>
                  ))}
            </ul>
          </Timeline>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default Logs;
