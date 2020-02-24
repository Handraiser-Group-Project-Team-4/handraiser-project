import { makeStyles } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: chatResponsive => ({
    borderRadius: 10,
    boxShadow: "4px 4px 12px 1px rgba(0, 0, 0, 0.2)",
    lineHeight: 1.5,
    overflowY: "auto",
    // minHeight: "80vh",
    width: chatResponsive ? "100%" : "80%",
    height: "100%"
  }),
  media: chatResponsive => ({
    height: chatResponsive ? "75%" : "100%",
    minHeight: "500px",
    padding: "0px!important",
    "& > div > div::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
      backgroundColor: "#FFF",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10
    },
    "& > div > div::-webkit-scrollbar-thumb": {
      backgroundColor: "#673ab7" //'#23232F' //'#0595DD',
      // borderTopRightRadius: 10
    }
  }),
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(360deg)"
  },
  avatar: {
    backgroundColor: purple[300]
  },
  chatAvatar: {
    marginRight: "10px"
  },
  chatLeftAvatar: {
    marginLeft: "10px"
  },
  chat: {
    padding: "10px",
    margin: "0",
    width: "auto",
    backgroundColor: "#F5F5F5",
    borderRadius: "15px",
    maxWidth: "50%"
  }
}));

export default useStyles;
