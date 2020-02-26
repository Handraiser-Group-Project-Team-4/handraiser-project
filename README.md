# Handraiser (Team 4)

An application that allows Boom.Camp students to "digitally" raise their hand to request assistance from a mentor. This makes it easier for Mentors to efficiently provide assistance and reduces the burden on students to keep requesting assistance if Mentors forget who is next in the queue.

# Getting Started

1. Download the zip file at Github
2. Extract and save the local file copy.
3. Meet the requirement before getting started.
4. Run `npm run db:start` and `nodemon server/index.js`in the root folder.
5. Run `npm run start` in the `/handraiser-app` directory.

## Project Functionalities

**Login/Registration Page**

- Students and mentors able to login to the Handraiser application
- Verified using Google as the 0Auth provider
- Generates an alert, notifying the user if failure happens or it succeeded
- On the first login, there is an alert asking if the user wants to request to be a mentor

**Cohort Selection PAGE**

- User can select a cohort
- Must enter cohort key to join the cohort

**Mentor Page**

- Can view cohort list
- Can help the student's concern
- Can remove the student's concern
- Can chat the student
- Can close or mark as done the student's concern

**Admin Page**

- Creating/Editing a Cohort
- Changing key to a Cohort incase of leakage
- Sending cohort key to mentor via gmail
- Assigning/Kicking a mentor and a student to a cohort
- Activate/Deactivate a cohort
- Reassign student to be a mentor
- Reassing mentor to be a student
- Remove/add/retain a cohort to a user before reassigning
- Approve/Disapprove a request to be a Mentor

## Prerequisites

- Web Browser
- Terminal
- Internet

## Built w/

- [React JS](https://reactjs.org/)
- [ExpressJs](<[https://expressjs.com/](https://expressjs.com/)>)
- [Docker](<[https://www.docker.com/](https://www.docker.com/)>)
- [Visual Studio Code](<([https://code.visualstudio.com/](https://code.visualstudio.com/))>)
- [Postgres](<([[https://www.postgresql.org/docs/](https://www.postgresql.org/docs/))>)
- Node JS
- Socket.IO
- React
- Material UI

## Creator

- Clark B. Amor
- Joven B. Bandagosa
- Zion J. Camba
- Jake M. Balbedina
- Vince Gerard F. Ludovice (Team Leader)
- Noe Philip Gabriel M. Restum

## Acknowledgements

- [Stack Overflow](<[[https://stackoverflow.com/](https://stackoverflow.com/)](https://stackoverflow.com/](https://stackoverflow.com/))>)
- [Windows Visual Studio](<[https://code.visualstudio.com](https://code.visualstudio.com/)>)
- [Material UI](<[[https://material-ui.com/](https://material-ui.com/)](https://material-ui.com/](https://material-ui.com/))>)
- [MassiveJS](<[[https://massivejs.org/](https://massivejs.org/)](https://massivejs.org/](https://massivejs.org/))>)
