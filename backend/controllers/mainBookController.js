const AppRes = require('../utils/AppRes');
const {getPlant}  = require('../services/mainBookService');

exports.getPlantController = async (req, res, next) => {
    try {
        const result = await getPlant(req.params.id);
        AppRes.send(res, result.message, result.statusCode, result.payload);
    } catch(err) {
        next(err);
    }
};