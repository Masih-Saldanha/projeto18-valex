function type(error) {
    if (error.type === "Unauthorized") {
        return { status: 401, message: error.message };
    };
    if (error.type === "Not Found") {
        return { status: 404, message: error.message };
    };
    if (error.type === "Not Acceptable") {
        return { status: 406, message: error.message };
    };
    if (error.type === "Conflict") {
        return { status: 409, message: error.message };
    };
    return { status: 500, message: "Internal Server Error" };
};

const errorType = {
    type
};

export default errorType;