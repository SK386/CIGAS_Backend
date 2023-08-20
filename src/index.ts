import app from "./server";

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${String(port)}`);
});
