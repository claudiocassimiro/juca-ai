import app from "./app";
import connectToWhatsApp from "./utils/connectToWhatsApp";

const PORT = process.env.PORT || 3000;

connectToWhatsApp();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
