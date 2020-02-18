// import React, { useState } from "react";
// import axios from "axios";
// import jwtToken from "../tools/assets/jwtToken";

// export default function CreateCohort() {
//   const userObj = jwtToken();
//   const [key, setKey] = useState();
//   const [modal, setModal] = useState({
//     open: false,
//     class_title: "",
//     class_description: ""
//   });

//   const handleSubmit = () => {
//     let date = new Date();
//     let newDate = date.toLocaleString();

//     axios({
//       method: `post`,
//       url: `/api/cohorts`,
//       data: {
//         class_title: modal.class_title,
//         class_description: modal.class_description,
//         class_created: newDate,
//         class_status: "active",
//         user_id: userObj.user_id
//       },
//       headers: {
//         Authorization: "Bearer " + sessionStorage.getItem("accessToken")
//       }
//     })
//       .then(res => {
//         // console.log(res.data)
//         setKey(res.data.key);
//         alert(`This is your key: ${res.data.key}`);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };
//   return (
//     <>
//       <button onClick={() => setModal({ ...modal, open: true })}>
//         Create Cohort
//       </button>

//       {modal.open && (
//         <div
//           style={{
//             background: `white`,
//             padding: `10px`,
//             borderRadius: `5px`,
//             display: `flex`,
//             flexDirection: `column`
//           }}
//         >
//           <input
//             type="text"
//             placeholder="Class Title"
//             onChange={e => setModal({ ...modal, class_title: e.target.value })}
//           />
//           <textarea
//             placeholder="Class Description"
//             onChange={e =>
//               setModal({ ...modal, class_description: e.target.value })
//             }
//           ></textarea>

//           <button onClick={handleSubmit}>Submit</button>
//           <button onClick={() => setModal({ ...modal, open: false })}>
//             Cancel
//           </button>
//         </div>
//       )}
//     </>
//   );
// }
