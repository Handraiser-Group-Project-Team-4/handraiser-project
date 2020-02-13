import React from "react";
import axios from "axios";
import MaterialTable from "material-table";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";


export default function PopupModal({ handleClose, open, data, title, id, compare }) {
    const columns = [
        
        { title: "First Name", field: "firstname" },
        { title: "Last Name", field: "lastname" },
        { title: "Email", field: "email" },
        
      ]
  
    const assign = (data, id) => {
        let date = new Date();
        let newDate = date.toLocaleString();
  
        data.map(x => {
            axios({
                method: "post",
                url: `/api/assignMentor/`,
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
        fullWidth={false}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>

        <DialogContent>

        <MaterialTable
            title="Editable Example"
            columns={columns}
            data={data}
            options={{
          selection: true
        }}
        actions={[
          {
            tooltip: 'Assign as a Mentor',
            icon: 'delete',
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
