import { makeStyles, fade } from "@material-ui/core";
import styled from "styled-components";

const useStyles = makeStyles(theme => ({
  parentDiv: {
    [theme.breakpoints.up("md")]: {
      minHeight: "100vh"
    }
  },
  cardHeaderRoot: {
    width: "100%",
    borderRadius: 10,
    display: "flex",
    alignItems: "flex-start",
    "& > div > span:first-of-type": {
      fontSize: 25,
      wordBreak: "break-all"
    },
    "& > div > span:last-of-type": {
      fontSize: 15
    },
    "& > div:last-of-type": {
      alignSelf: "center"
    }
  },
  paperr: {
    height: "100%"
  },
  gridContainerr: {
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
    // height: "100%",
    [theme.breakpoints.up("md")]: {
      height: "100vh"
    },
    [theme.breakpoints.down("md")]: {
      height: "calc(110vh - 64px)",
      width: "100vw"
    },
    height: "calc(100vh - 64px)"
  },
  typoTitle: {
    fontFamily: "'Rubik', sans-serif",
    marginBottom: "1rem",
    fontSize: 26,
    [theme.breakpoints.down("md")]: {
      order: 3
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "10vw",
      order: 3
    }
  },
  formControl: {
    marginRight: 10,
    minWidth: "20%",
    [theme.breakpoints.down("md")]: {
      marginBottom: 10
    }
  },
  searchform: {
    [theme.breakpoints.down("md")]: {
      marginBottom: 10,
      marginRight: 10
    }
  },
  gridItemm: {
    height: "100%",
    "&:first-of-type": {
      padding: "3rem 3rem 0"
    },
    [theme.breakpoints.down("md")]: {
      "&:first-of-type": {
        padding: "1rem 1rem 0"
      }
    }
  },
  "@global": {
    body: {
      fontFamily: "'Rubik', sans-serif"
    }
  },
  chatTitle: {
    margin: "0 auto"
  },
  rootq: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh"
  },
  roots: {
    height: "85%"
  },
  avatar: {
    borderRadius: 5,
    width: 70,
    height: 70
  },
  cardRootContent: {
    borderRadius: 10,
    boxShadow: "4px 4px 12px 1px rgba(0, 0, 0, 0.2)",
    lineHeight: 1.5,
    "&:last-of-type": {
      marginTop: 20
    },
    maxHeight: 360,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
      backgroundColor: "#FFF",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#673ab7" //'#23232F' //'#0595DD',
      // borderTopRightRadius: 10
    }
  },
  cardRootContentTitle: {
    color: "#673ab7",
    fontFamily: '"Fira Mono", monospace',
    position: "sticky",
    top: 0,
    left: 20,
    width: "-webkit-fill-available",
    height: "auto",
    backgroundColor: "white",
    lineHeight: "50px",
    zIndex: 1,
    marginBottom: 0,
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
      backgroundColor: "#FFF"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#673ab7" //'#025279' //'#0595DD'
    }
  },
  beingHelped: {
    background: "#fefefe",
    position: "relative",
    borderRadius: 3,
    padding: "0!important",
    marginBottom: 10
  },
  topNavi: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 10,
    alignItems: "center"
  },
  search: {
    height: 32,
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  largeChip: {
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#673ab7"
  },
  cardRootContentContent: {
    position: "relative"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(7),
    right: theme.spacing(5),
    zIndex: 10,
    boxShadow: "none",
    backgroundColor: "transparent"
  },
  TabPanelpaperr: {
    height: "calc(100vh - 48px)",
    "& > div": {
      padding: 0,
      paddingTop: 1
    }
  },
  loginBoxGridOne: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: "#f0f3eb",
    display: "flex",
    justifyContent: "space-between",
    "&>div:first-of-type": {
      width: "52%",
      [theme.breakpoints.down("md")]: {
        height: 300
      }
    },
    [theme.breakpoints.up("md")]: {
      height: "auto"
    }
  },
  loginBoxGridTwo: {
    display: "flex"
  },
  loginBoxGridOneCardMedia: {
    height: "100%",
    borderRadius: 16,
    width: "110%"
  },
  banner: {
    paddingTop: 10,
    display: "flex",
    justifyContent: "center",
    "&>div:first-of-type": {
      borderRadius: 16
    }
  },
  gridDetails: {
    fontFamily: "'Rubik', sans-serif",
    textAlign: "center",
    paddingLeft: "3rem",
    "&>h1": {
      fontSize: "2.5rem",
      color: "#673ab7",
      wordBreak: "break-word",
      marginTop: 0,
      paddingTop: 5,
      [theme.breakpoints.down("md")]: {
        marginBottom: 0
      }
    },
    "&>h6": {
      fontSize: "1rem",
      padding: 0,
      margin: 0
    },
    [theme.breakpoints.down("md")]: {
      height: 125
    }
  },
  lest: {
    display: "flex",
    flexDirection: "column"
  },
  lestUl: {
    padding: 0
  },
  listChip: {
    fontSize: "1rem!important"
  },
  timeline: {
    lineHeight: "1.4em",
    listStyle: "none",
    margin: 0,
    padding: 0,
    width: "100%",
    "& h3": {
      lineHeight: "inherit"
    }
  },
  cardLogs: {
    width: "100%",
    maxHeight: "75vh",
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
      // backgroundColor: "#FFF",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#673ab7" //'#23232F' //'#0595DD',
      // borderTopRightRadius: 10
    }
  }
}));

const Timeline = styled.div`
  h2,
  h3 {
    color: #3d4351;
    margin-top: 0;
  }
  .timeline-item {
    padding-left: 40px;
    position: relative;
  }
  .timeline-item:last-child {
    padding-bottom: 0;
  }
  .timeline-info {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0 0 0.5em 0;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .timeline-marker {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 5px;
    width: 15px;
  }
  .timeline-marker:before {
    background: #ff6b6b;
    border: 3px solid transparent;
    border-radius: 100%;
    content: "";
    display: block;
    height: 15px;
    position: absolute;
    top: 4px;
    left: 0;
    width: 15px;
    transition: background 0.3s ease-in-out, border 0.3s ease-in-out;
  }
  .timeline-marker:after {
    content: "";
    width: 3px;
    background: #ccd5db;
    display: block;
    position: absolute;
    top: 24px;
    bottom: 0;
    left: 6px;
  }
  .timeline-item:last-child .timeline-marker:after {
    content: none;
  }
  .timeline-item:not(.period):hover .timeline-marker:before {
    background: transparent;
    border: 3px solid #ff6b6b;
  }
  .timeline-content {
    padding-bottom: 5px;
    display: flex;
    align-items: baseline;
  }
  .timeline-content p:last-child {
    margin-bottom: 0;
  }
  .period {
    padding: 0;
  }
  .period .timeline-info {
    display: none;
  }
  .period .timeline-marker:before {
    background: transparent;
    content: "";
    width: 15px;
    height: auto;
    border: none;
    border-radius: 0;
    top: 0;
    bottom: 30px;
    position: absolute;
    border-top: 3px solid #ccd5db;
    border-bottom: 3px solid #ccd5db;
  }
  .period .timeline-marker:after {
    content: "";
    height: 32px;
    top: auto;
  }
  .period .timeline-content {
    padding: 40px 0 70px;
  }
  .period .timeline-title {
    margin: 0;
  }
  .timeline-title {
    font-weight: 300;
    padding-left: 10px;
  }
`;
const Lest = styled.div`
  img {
    width: 75px;
    margin: 7px 5px 5px 5px;
    border-radius: 5px;
  }
  .list {
    display: -webkit-box;
    display: flex;
    background-color: white;
    margin: 10px;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.2);
    -webkit-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .list:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25), 0 5px 8px rgba(0, 0, 0, 0.22);
    cursor: pointer;
  }
  .list__profile {
    display: -webkit-box;
    display: flex;
    -webkit-box-flex: 1;
    flex-grow: 1;
    text-align: left;
    -webkit-box-pack: start;
    justify-content: flex-start;
  }
  .list__photos {
    display: -webkit-box;
    display: flex;
    width: 30%;
  }
  .list__photos img {
    width: 100px;
  }
  @media screen and (max-width: 400px) {
    .list__photos img {
      width: 75px;
    }
  }
  .list__label {
    width: 100%;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    justify-content: center;
  }
  .list__label--header {
    color: #9a9a9a;
  }
  @media screen and (max-width: 650px) {
    .list {
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: column;
    }
    .list__profile {
      -webkit-box-pack: center;
      justify-content: center;
      margin: 10px;
    }
    .list__label {
      width: 170px;
    }
    .list__photos {
      -webkit-box-pack: center;
      justify-content: center;
    }
  }
`;

export { useStyles, Timeline, Lest };
