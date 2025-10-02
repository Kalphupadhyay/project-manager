import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./db/dbConnection.js";

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Connect to the database
// connectDb()
//   .then(() => {
//     // Start the server
//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to the database", error);
//   });
