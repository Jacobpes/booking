# Project requirements:

The current project is a simple booking web app for massage companies. It is done in django and angular and mysql.
Admin can log in and set the available hours to book, manually and automatically according to opening hours.
Only admin can log in, there are so few fields to fill in when booking so a user account would just make it more complicated for the customers. 
For non admins, show calendar with the available hours in green. When clicking on an available hour, user is asked for name, email, time length of massage, and phone number and to submit the booking. Then the booking confirmation is sent to the db and sent as an email to admin as well as to the booker himself, and displayed as a printable page. 
- Database structure: Bookings: ID, CompanyName, CustomerName, email, phoneNumber, startsAt, endsAt, bookedAt.
  Users: ID, CompanyName, email, phonenumber, password, available times.
- Just like in Grit:lab projects we should do bare minimum as the minimum requirements to be able to do the other projects asap as well. Maybe we can aim a bit higher with the code quality.
- Performance and scalability is not very important on this one and the machine market app because they will have very few users at a time. 
- We should probably have the booking services for all different companies hosted on the same server.
