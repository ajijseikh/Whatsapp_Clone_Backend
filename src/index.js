import app from "./app.js"


// env varialble
const PORT =process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`server is Listening at ${PORT}...`);
})