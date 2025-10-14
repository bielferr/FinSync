import app from "./app";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});




// npm intall -D typescript ts-node-dev @types/node
// npm start