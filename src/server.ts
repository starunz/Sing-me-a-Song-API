import app from "./app.js";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if(process.env.NODE_ENV === "test"){
    console.log(`Testing server is listening on port ${PORT}.`)
  }
  
  console.log(`Server is listening on port ${PORT}.`);
});
