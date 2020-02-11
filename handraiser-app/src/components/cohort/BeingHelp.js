import React, { useContext } from "react";
import Studentss from "./Students";
import { UserContext } from "./CohortPage";
import { List, Typography, Card, CardContent, Chip } from "@material-ui/core";

export default function BeingHelp({ classes }) {
  const { id, data } = useContext(UserContext);
  console.log(data);
  return (
    <Card className={classes.cardRootContent}>
      <CardContent className={classes.cardRootContentContent}>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          className={classes.cardRootContentTitle}
        >
          Being Helped
          <Chip label="*5" />
        </Typography>
        {data &&
        data.some(concern => concern.concern_status === "onprocess") ? (
          <List className={classes.roots}>
            {data.map(
              (concern, index) =>
                concern.concern_status === "onprocess" && (
                  <Studentss
                    key={index}
                    room_id={id}
                    id={concern.concern_id}
                    student_id={concern.student_id}
                    status={concern.concern_status}
                    text={concern.concern_title}
                    index={index}
                    classes={classes}
                  />
                )
            )}
          </List>
        ) : (
          <Typography
            gutterBottom
            variant="h6"
            component="h6"
            // className={classes.cardRootContentTitle}
          >
            Walang Nakita
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
