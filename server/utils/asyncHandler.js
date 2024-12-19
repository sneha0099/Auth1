const asyncHandler = (fn) => {
    return async(req,res,next) => {
        try {
            await fn(req,res,next)
        } catch (error) {
            console.log(error);
            const statusCode = error.code || 500;
            const message = error.message || 'Internal server error';
            const data = error.data || null;
            res.status(statusCode).json({
                success: false,
                message: message,
                data: error.data
            })
        }
    }
}

export {asyncHandler}