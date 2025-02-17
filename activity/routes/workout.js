    const express = require("express");
    const workoutController = require("../controllers/workout");

    const {verify} = require("../auth");

    const router = express.Router();

    router.post("/", workoutController.addWorkout);
    router.get("/", workoutController.getMyWorkouts);
    router.put("/:id", workoutController.updateWorkout);
    router.delete("/:id", workoutController.deleteWorkout);
    router.post("/:id", workoutController.completeWorkoutStatus);

    module.exports = router;