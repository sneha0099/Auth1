class ApiError extends Error{
    constructor(
        statusCode,
        message = 'something went wrong',
        data = null,
        errors = [],
        stack = ''
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        if (stack) this.stack = stack;
        this.data = data;
        this.success = false;
    }
}

export {ApiError}