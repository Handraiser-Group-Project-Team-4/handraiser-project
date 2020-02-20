import React from 'react'
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';


const StyledBadge = withStyles(theme => ({
    
    badge: {
      backgroundColor: 'red',
      color: 'red',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);

  const StyledBadge2 = withStyles(theme => ({
    
    badge: {
      backgroundColor: 'green',
      color: 'green',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);
  
  
  // const useStyles = makeStyles(theme => ({
  //   root: {
  //     display: 'flex',
  //     '& > *': {
  //       margin: theme.spacing(1),
  //     },
  //   },
  // }));

function Badger({obj}) {
    // const classes = useStyles();
    return (
      <>
      {(obj.user_status )
           ? <StyledBadge2
              style={{marginRight: 10}}
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <Avatar alt="Remy Sharp" src={obj.avatar} />
            </StyledBadge2>
           
        :  <StyledBadge
              style={{marginRight: 10}}
              overlap="circle"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <Avatar alt="Remy Sharp" src={obj.avatar} />
            </StyledBadge>

           
      }
      </>
    )
}

export default Badger
