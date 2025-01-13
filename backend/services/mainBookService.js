const AppError = require('../utils/AppError');
const AppRes = require('../utils/AppRes');
const Plant = require('../models/Plant');

exports.getPlant = async (fam) => {
    const plant = await Plant.findOne({Scientific_Name:fam}).select('-__v');
    if (!plant) throw new AppError(`plant not found`, 404);
    return new AppRes(`plant fetched`, 200, plant);
};