# Handraiser

An application that allows Boom.Camp students to "digitally" raise their hand to
request assistance from a mentor. This makes it easier for Mentors to
efficiently provide assistance and reduces the burden on students to keep
requesting assistance if Mentors forget who is next in the queue.

## Application Goals

1. A Student should be able to sign into the application, select the class they
   are currently attending and then be able to join and leave an assistance
   queue.

2. A Mentor should be able to sign into the application, select the class they
   are mentoring and be shown a queue of students that require assistance. The
   mentor should also be able to move a student into and out of the assistance
   queue.

## Requirements

1. Login Page: **! Omit this requirement for now !**

   - Students and mentors should be able to login to the Handraiser application.
     Ideally authorization would be verified using Google as the 0Auth provider.

2. Class Selection Page:

   - Once signed in, users should be shown a place to select the class they are
     currently attending. Once selected the user will be redirected into the
     Queue view where they are able to request assistance and see the status of
     the queue.

3. Queue View:

   - Student - Should see two sections of the queue

     - UI:
       - Waiting - A list of students currently waiting in the queue. The
         students position should be reflected in the queue.
       - Being Helped - a list of students currently being helped by a mentor.
     - Actions:
       - Request assistance, this would place student into the waiting queue.
       - Remove self from queue, this would remove the student from the queue

   - Mentor - Should see two sections of the queue.
     - UI:
       - Waiting - A list of students currently waiting in the queue
       - Being Helped - A list of students currently being helped by a mentor.
     - Actions:
       - Move students into any possible status in the queue i.e. Waiting, Being Helped, Removed

## Technologies

Web UI: [React.js](https://reactjs.org)

Backend Server: [Node.js](https://nodejs.org) / [Express.js](https://expressjs.com)

To synchronize users clients and make the application real-time Websockets should be utilized.

## Wireframes

### **Sign in Page**

![Sign In](design-assets/sign_in.png)

### **Select Cohort**

![Select Cohort](design-assets/select_cohort.png)

### **Queue Page - Student**

![Queue View Student](design-assets/queue_view_student.png)

### **Queue Page - Mentor**

![Queue View Mentor](design-assets/queue_view_mentor.png)