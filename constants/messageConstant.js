const successMessage = {
    USER_CREATED: 'User created successfully',
    USER_FETCHED: 'User fetched successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    USER_UNLOCKED: "User Unlocked successfully",
    USER_ALREADY_ACTIVE: "User Already active",
    USER_ACTIVATED: "User activated successfully",
    // role

    // settings
    SETTING_SAVED: "Setting saved successfully",

};

const errorMessage = {
    USER_NOT_FOUND: 'User not found',
    UNABLE_TO_CREATE_USER: 'Unable to create user',
    UNABLE_TO_FETCH_USER: 'Unable to fetch user',
    UNABLE_TO_UPDATE_USER: 'Unable to update user',
    UNABLE_TO_DELETE_USER: 'Unable to delete user',
    USER_LOCKED: 'User is locked',
    UNABLE_TO_ACTIVATE: "Unable to activate user",

    //common
    PROVIDE_REQUIRED_FIELDS: 'Please provide required fields',
    INTERNAL_SERVER_ERROR: 'Internal server error',

    LOGIN_FAILED: 'Login failed',
    INVALID_CREDENTIALS: 'Invalid credentials',
    SESSION_TIME_OUT: "Session time out. Please login and try again.",

    // SETTINGS
    UNABLE_TO_SAVE_SETTING: "Unable to save settings",
    PASSWORD_SPECIAL_CC: "Password must contain one special charachter",
    PASSWORD_CL: "Password must contain at list one capital letter",
    PASSWORD_OL: "Password must contain at list one number",
    PASSWORD_NOT_SETTED: "Password or setting is not setted",
    UNABLE_TO_CHECK: "Unable to check password policies",
    PASSWORD_CONTAIN: "Password length must be greater than"
};

module.exports = {
    successMessage,
    errorMessage
}