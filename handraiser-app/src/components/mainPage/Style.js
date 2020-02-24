import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  parentDiv: {
    [theme.breakpoints.up("md")]: {
      minHeight: "100vh"
    },
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#F5F5F5",
    display: "flex",
    width: "100%!important"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  paperr: {
    display: "flex"
  },
  "@global": {
    body: {
      fontFamily: "'Rubik', sans-serif"
    }
  },
  rootq: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 10px"
  },
  cardRoot: {
    width: 600,
    borderRadius: 10,
    "& > div:first-of-type": {
      paddingBottom: 10,
      minHeight: 275
    }
  },
  cohortCardActions: {
    padding: 0,
    "& > button": {
      width: "100%",
      backgroundColor: "#673ab7",
      font: '500 16px/1 "Poppins", sans-serif',
      padding: 20,
      color: "white"
    },
    "& > button:hover": {
      opacity: "0.8",
      backgroundColor: "#6e3dc2"
    }
  },
  cardDesc: {
    "& > h3": {
      font: "700 24px/1.2 'Poppins', sans-serif",
      marginBottom: 5,
      marginTop: 10
    },
    "& > p": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      "-webkit-line-clamp": "4",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      marginTop: 0,
      marginBottom: 0
    },
    "& > div:last-of-type > span": {
      display: "flex",
      paddingTop: 5
    },
    "& > div:last-of-type > span > p": {
      color: "#999",
      textTransform: "uppercase",
      fontSize: 18,
      width: "40%",
      margin: 0
    },
    "& > div:last-of-type > span > h5": {
      font: "500 18px/1.2 'Poppins', sans-serif",
      width: "60%",
      margin: 0,
      paddingTop: 3
    }
  },
  profile__image: {
    padding: "15px 15px 15px"
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    border: "3px solid #fff",
    boxShadow: "0 0 0 4px #673ab7"
  },
  num_of_mentor: {
    backgroundColor: `whitesmoke`,
    borderRadius: `50%`,
    color: `black`,
    padding: `8px`,
    border: `1px solid #212121`
  },
  num_text_mentor: {
    backgroundColor: `#949090`,
    borderRadius: `50%`,
    color: `white`,
    fontSize: `11px`,
    padding: `3px 5px`
  },
  tabRoot: {
    width: "100%",
    flexGrow: 1
  }
}));

export default useStyles;
