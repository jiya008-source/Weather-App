import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port=3000;
const app=express();
app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async(req ,res)=>{
    res.render("index.ejs",{weather: null});
});
app.post("/weather", async (req,res)=>{
    const city=req.body.city;
    const apiKey="02dd6710a279c0c3206451e335b3035b";
    
    const url=`http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
    try{
        const response=await axios.get(url);
        const data=response.data;
        
        const location = data.location;
        const current = data.current;
        const weatherData = {
            city: location.name,
            country: location.country,
            region: location.region,
            localtime: location.localtime,
            temperature: current.temperature,
            description: current.weather_descriptions[0],
            wind_speed: current.wind_speed,
            wind_dir: current.wind_dir,
            humidity: current.humidity,
            cloudcover: current.cloudcover,
            icon: current.weather_icons[0],
            feelslike: current.feelslike,
            visibility: current.visibility,
            is_day: current.is_day === "yes",
        };
        res.render("index.ejs", { weather: weatherData });
    } catch (error){
        console.error(error.message);
        res.status(404).send('City not found. Please try again.');
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

