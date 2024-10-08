const { responseFormatter } = require('../utils/helper');
const { STATUS_CODE, ERRORS } = require('../utils/texts');

const globalErrorHandler = (err, req, res, next) => {
    console.error(err?.stack);

    const statusCode = err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
    const message = err.message || ERRORS.internalServerError;

    return responseFormatter(res, statusCode, {}, message);
};

module.exports = globalErrorHandler;
