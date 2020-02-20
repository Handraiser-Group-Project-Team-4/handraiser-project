import React, { useContext, useState, useEffect } from "react";
import Students from "./Students";
import { UserContext } from "./CohortPage";
import { List, Typography, Card, CardContent, Chip } from "@material-ui/core";
import { DarkModeContext } from "../../../App";

export default function Search({ classes }) {
  const {
    id,
    user,
    search,
    data,
    filter,
    setFilter,
    handleConcernCount
  } = useContext(UserContext);
  const { darkMode } = useContext(DarkModeContext);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    let filter = [];
    if (search) {
      data.filter(concern => {
        const regex = new RegExp(search, "gi");
        return concern.concern_title.match(regex) &&
          (concern.mentor_id === user.user_id ||
            concern.student_id === user.user_id)
          ? filter.push(concern)
          : null;
      });
      setSearchResult(filter);
    } else {
      setSearchResult([]);
    }
  }, [search, data, user.user_id]);

  return (
    <Card className={classes.cardRootContent + " " + classes.searchRootContent}>
      <CardContent className={classes.cardRootContentContent}>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          className={classes.cardRootContentTitle}
          style={{
            backgroundColor: darkMode ? "#424242" : null,
            color: darkMode ? "#fff" : null
          }}
        >
          {search ? "Search Result" : filter ? "Closed Concerns" : ""}
          <Chip
            label={
              search
                ? searchResult.length
                : filter
                ? handleConcernCount("done")
                : ""
            }
          />
        </Typography>
        {searchResult.length ? (
          <List className={classes.roots}>
            {searchResult.map((concern, index) => (
              <Students
                key={index}
                room_id={id}
                id={concern.concern_id}
                student_id={concern.student_id}
                status={concern.concern_status}
                text={concern.concern_title}
                index={index}
                classes={classes}
                darkMode={darkMode}
              />
            ))}
          </List>
        ) : filter ? (
          <List className={classes.roots}>
            {data.map((concern, index) =>
              concern.concern_status === "done" ? (
                <Students
                  key={index}
                  room_id={id}
                  id={concern.concern_id}
                  student_id={concern.student_id}
                  status={concern.concern_status}
                  text={concern.concern_title}
                  index={index}
                  classes={classes}
                  darkMode={darkMode}
                />
              ) : null
            )}
          </List>
        ) : (
          <List
            style={{
              padding: "40px"
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="h6"
              style={{
                textAlign: "center",
                fontWeight: "300"
              }}
              // className={classes.cardRootContentTitle}
            >
              No Concerns Found
            </Typography>
          </List>
        )}
      </CardContent>
    </Card>
  );
}
