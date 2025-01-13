const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlantSchema = new Schema({
    Family: {
        type: String,
    },
    Vernacular_names: {
        type: String,
    },
    Distribution: {
        type: String,
    },
    Description: {
        type: String,
    },
    Habit: {
        type: String,
    },
    Habitat: {
        type: String,
    },
    Flowering_Fruiting: {
        type: String,
    },
    
    Parts_used: {
        type: String,
    },
    Properties_Uses: {
        type: String,
    },
    Systems_of_Medicines: {
        type: String,
    },
    Scientific_Name: {
        type: String,
    }
});

const Plant = mongoose.model('plants', PlantSchema);
module.exports = Plant;