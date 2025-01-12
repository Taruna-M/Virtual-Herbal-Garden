class AppRes {
    constructor(message, statusCode = 200, payload = null) {
        this.success = true;
        this.message = message;
        this.statusCode = statusCode;
        this.payload = payload;
    }
    
    static send(res, message, statusCode = 200, payload = null) { //use this in controllers
        const response = new AppRes(message, statusCode, payload);
        if (!payload){
            return res.status(statusCode).json({
                success: response.success,
                message: response.message,
            });
        }
        return res.status(statusCode).json({
            success: response.success,
            message: response.message,
            payload: response.payload
        });
        
    }
}
  
module.exports = AppRes;
  