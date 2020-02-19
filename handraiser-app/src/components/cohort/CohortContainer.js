import React, { useContext } from "react";
import Unnamed from "../../images/unnamed.jpg";
import NoResult from "../../images/no-search-result.png";
import NoResultDark from "../../images/no-search-result-dark.png";

// MATERIAL-UI
import {
  Container,
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CardMedia
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { DarkModeContext } from "../../App";

export default function CohortContainer({ classes, handleCohort, cohorts }) {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <Container className={classes.paperr} maxWidth="xl">
      <Grid container spacing={0} className={classes.gridContainerrr}>
        {cohorts.length ? (
          <>
            <Grid item xs={12} sm={12} md={12} lg={11}>
              <form
                noValidate
                autoComplete="off"
                className={classes.searchform}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  paddingBottom: 10
                }}
              >
                <TextField
                  id="outlined-search"
                  label="Search field"
                  type="search"
                  name="search"
                  variant="outlined"
                  //   onChange={changeHandler}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </form>
            </Grid>
            {cohorts.map((x, i) => (
              <Grid
                key={i}
                item
                xl={6}
                lg={6}
                md={12}
                sm={12}
                xs={12}
                className={classes.rootq}
              >
                <Card className={classes.cardRoot} elevation={3}>
                  <CardContent>
                    <Grid
                      container
                      spacing={0}
                      className={classes.gridCardContainer}
                    >
                      <Grid item xs={4} className={classes.profile__image}>
                        <img src={Unnamed} alt="Pic" />
                      </Grid>
                      <Grid item xs={8} className={classes.cardDesc}>
                        <div>
                          <h3>{x.class_title}</h3>
                          <p>{x.class_description}</p>
                        </div>
                        <div>
                          <span>
                            <p>Head Mentor</p>
                            <h5>*Aodhan Hayter</h5>
                          </span>
                          <span>
                            <p>Students</p>
                            <h5>*5</h5>
                          </span>
                          <span>
                            <p>Cohort Status</p>
                            <h5>
                              {x.class_status === "true" ? (
                                <Chip
                                  label="Open"
                                  style={{
                                    backgroundColor: "green",
                                    color: `white`,
                                    marginTop: -5
                                  }}
                                />
                              ) : (
                                <Chip
                                  label="Close"
                                  style={{
                                    backgroundColor: "red",
                                    color: `white`,
                                    marginTop: -5
                                  }}
                                />
                              )}
                            </h5>
                          </span>
                        </div>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions className={classes.cohortCardActions}>
                    <Button
                      size="small"
                      onClick={() =>
                        x.class_status === "true"
                          ? handleCohort(x)
                          : alert("Sorry This class is closed")
                      }
                    >
                      Join Cohort
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </>
        ) : (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CardMedia style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={darkMode ? NoResultDark : NoResult}
                alt="No Fucking Result"
              />
            </CardMedia>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
