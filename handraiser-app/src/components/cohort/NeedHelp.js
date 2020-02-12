import React, { useContext } from "react";
import Studentss from "./Students";
import { UserContext } from "./CohortPage";
import { List, Typography, Card, CardContent, Chip } from "@material-ui/core";
export default function NeedHelps({ classes }) {
  const { id, data } = useContext(UserContext);
  // return (
  //   <Paper className={classes.paper}>
  //     <Typography variant="h5" style={{ padding: 10 }}>
  //       Need Help
  //     </Typography>
  //     <Divider />
  //     <List className={classes.list}>
  //       {data
  //         ? data.map((concern, index) => {
  //             if (concern.concern_status === "pending") {
  //               return (
  //                 <Students
  //                   key={index}
  //                   room_id={id}
  //                   id={concern.concern_id}
  //                   student_id={concern.student_id}
  //                   status={concern.concern_status}
  //                   text={concern.concern_title}
  //                   index={index}
  //                 />
  //               );
  //             } else return null;
  //           })
  //         : ""}
  //     </List>
  //   </Paper>
  // );
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
          Need Help
          <Chip label="*5" />
        </Typography>
        {data && data.some(concern => concern.concern_status === "pending") ? (
          <List className={classes.roots}>
            {data.map(
              (concern, index) =>
                concern.concern_status === "pending" && (
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
              No one is requesting Help at the moment.
            </Typography>
          </List>
        )}
      </CardContent>
    </Card>
  );
}

// const useStyles = makeStyles(theme => ({
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: "left"
//   },
//   list: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: theme.palette.background.paper
//   },
//   inline: {
//     display: "inline",
//     color: "#000"
//   }
// }));
