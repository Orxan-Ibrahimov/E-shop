function errorHandler(error,req,res,next) {
    
    if(error.name === "UnauthorizedError"){
        return res.status(401).json({message:"User is not Authorizated"})
    }

    if(error.name === "ValidationError"){
        return res.status(401).json({message:error})
    }

    return res.status(500).json({message:error})
}
module.exports = errorHandler;