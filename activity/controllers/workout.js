const WorkoutData = require("../models/WorkoutData");

module.exports.addWorkout = (req, res) => {
    // Ensure req.body contains the required fields
    const { name, duration, status } = req.body;

    if (!name || !duration || !status) {
        return res.status(400).send({ error: 'Name, duration, and status are required.' });
    }

    // Create a new workout entry
    let newWorkoutData = new WorkoutData({
        name: name,
        duration: duration,
        status: status
    });

    // Save the new workout data to the database
    newWorkoutData.save()
        .then(savedItem => {
            // Return the saved item with the ID included in the response
            return res.status(201).send({
                message: 'Workout added successfully',
                workout: {
                    id: savedItem._id,  // Return the workout ID explicitly
                    name: savedItem.name,
                    duration: savedItem.duration,
                    status: savedItem.status,
                    dateAdded: savedItem.dateAdded
                }
            });
        })
        .catch(saveErr => {
            console.error("Error in saving the item: ", saveErr); // Log the error
            return res.status(500).send({ error: 'Failed to save the item' });
        });
};


module.exports.getMyWorkouts = (req, res) => {

	WorkoutData.find({})
	.then(items => {

	    if (items.length > 0){
	        return res.status(200).send({ items });
	    }
	    else {

	        return res.status(200).send({ message: 'No workouts found.' })
	    }

	}).catch(err => res.status(500).send({ error: 'Error finding workouts.' }));

};


module.exports.updateWorkout = (req, res) => {

	let itemUpdates = {
        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status
    }

    return WorkoutData.findByIdAndUpdate(req.params.id, itemUpdates)
    .then(updatedItem => {

        if (!updatedItem) {

            return res.status(404).send({ error: 'No workouts found' });

        }

        return res.status(200).send({ 
        	message: 'Workout updated successfully', 
        	updatedItem: updatedItem 
        });

    })
    .catch(err => {
		console.error("Error in updating the workouts : ", err)
		return res.status(500).send({ error: 'Error in updating the workouts.' });
	});
};

module.exports.deleteWorkout = (req, res) => {
    // First, check if the workout exists before attempting deletion
    WorkoutData.findById(req.params.id)
        .then(workout => {
            if (!workout) {
                return res.status(404).send({ error: 'No workouts found' });
            }
            // If the workout exists, proceed with deletion
            return WorkoutData.deleteOne({ _id: req.params.id });
        })
        .then(deletedResult => {
            if (deletedResult.deletedCount < 1) {
                return res.status(400).send({ error: 'No workout deleted' });
            }
            return res.status(200).send({ message: 'Workouts deleted successfully' });
        })
        .catch(err => {
            console.error("Error in updating the workouts : ", err);
            return res.status(500).send({ error: 'Error in updating the workouts.' });
        });
};



module.exports.completeWorkoutStatus = (req, res) => {
    const { id } = req.params; // Workout ID from URL params

    // Find the workout by ID and check if it's currently active
    WorkoutData.findOne({ _id: id, status: 'active' })
        .then(workout => {
            // If no active workout is found, return an error message
            if (!workout) {
                return res.status(400).json({ message: 'Workout not found or already completed' });
            }

            // Update the status to 'completed'
            workout.status = 'completed';
            
            // Save the updated workout
            return workout.save();
        })
        .then(updatedWorkout => {
            // Explicitly return the workout id and other fields in the response
            return res.json({
                message: 'Workout completed',
                workout: {
                    id: updatedWorkout._id,  // Return the workout ID explicitly
                    name: updatedWorkout.name,  // You can include other properties as needed
                    status: updatedWorkout.status,
                    duration: updatedWorkout.duration,
                    dateAdded: updatedWorkout.dateAdded
                }
            });
        })
        .catch(err => {
            // Log and return error response if an error occurs
            console.error("Error completing the workout: ", err);
            return res.status(500).json({ message: 'Error completing the workout', error: err });
        });
};



