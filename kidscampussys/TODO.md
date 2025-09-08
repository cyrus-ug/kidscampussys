# Update Login and Signup to Username and Password Only

## Tasks
- [x] Update kidsdb/schema.sql: Replace email with username in users table
- [x] Update signup.html: Replace email field with username field
- [x] Update login.html: Change label to "Username" and input name to "username"
- [x] Update auth.js: Change identifier to username
- [x] Create models/user.js: Implement getUserByUsername and createUser functions
- [x] Update app.js: Change login to use getUserByUsername, add signup endpoint
- [x] Create db.js: Database connection file
- [x] Test the changes: Run the server with `node app.js`, open login.html and signup.html in browser, test signup with username, then login with username/password.
