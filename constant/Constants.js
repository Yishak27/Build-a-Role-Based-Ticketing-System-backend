
const RequestLimitMessage =
    "<h2>🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫</h2><h2>you are catched!,Too many request created; you are blocked. Try agin after 10 min.</h2><h2>🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫</h2>";

const StatusCode = {
    SUCCESS: 200,
    FAILED_OR_ERROR: 201,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 400,
    INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
    RequestLimitMessage,
    StatusCode
}