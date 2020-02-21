import React from "react";
import axios from "axios";

// Material UI
import MaterialTable from "material-table";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Material UI Icons
import AddCircleIcon from '@material-ui/icons/AddCircle';
export default function PopupModal({ handleClose, open, data, title, id}) {
    const columns = [
        
        { title: 'Avatar', field: 'firstname',
        render: (rowData) => (
          <div style={{display: `flex`}}>
            <img src={rowData.avatar} alt='pic' width="50" height="50" style={{ borderRadius: `50%`, margin: `0 30px 0 0` }} />
            <p>{rowData.firstname} {rowData.lastname}</p>
          </div>
        )
        },
        { title: "Email", field: "email" },
      ]
    const assign = (data, id) => {
        let date = new Date();
        let newDate = date.toLocaleString();
        data.map(x => {
            return axios({
                method: "post",
                url: `/api/enroll/`,
                headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
            },
                data: {
                    class_id: id,
                    user_id: x.user_id,
                    date_joined: newDate
                }
            })
            .then(() => {
                handleClose(id)
            })
            .catch(err => console.log("err"))
        })
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={() =>handleClose(id)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">
         <div style={{display:`flex`, alignItems: `center`, flexDirection:`column`, fontWeight: `normal`}}>
            <h4 style={{margin: `0`}}>{title}</h4>
            <h6 style={{margin: `0`}}>Assign Mentor</h6>
          </div>
        </DialogTitle>
        <DialogContent>
        <MaterialTable
            title="Mentors"
            columns={columns}
            data={data}
            options={{
          selection: true,
          pageSize: 10,
          headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
        }}
        actions={[
          {
            tooltip: 'Assign as a Mentor',
            icon: () => <AddCircleIcon/>,
            onClick: (e, data) => assign(data, id)
          }
        ]}
          />
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </>
  );
}