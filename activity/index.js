 const express = require("express");
 const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes Middleware
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

//MongoDB database
mongoose.connect("mongodb+srv://elaineibanez:admin123@cluster0.db341.mongodb.net/workout-API?retryWrites=true&w=majority&appName=Cluster0");

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};