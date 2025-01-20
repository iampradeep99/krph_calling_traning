class ResponseHandler {
    constructor(res) {
      this.res = res;
    }
  

    Success(message, data = null) {
      const response = {
        responseObject: null,
        responseDynamic: data || null,
        responseCode: '1',
        responseMessage: message || 'Success!',
        jsonString: null,
        recordCount: data ? (Array.isArray(data) ? data.length : 0) : 0
      };
      this.res.status(200).json(response);
    }
  
    Error(message, errorDetails = null, statusCode = 200) {
      const response = {
        responseObject: null,
        responseDynamic: null,
        responseCode: '0',
        responseMessage: message || 'An error occurred!',
        jsonString: errorDetails || null,
        recordCount: 0
      };
      this.res.status(statusCode).json(response);
    }
  }
  
  module.exports = ResponseHandler;
  