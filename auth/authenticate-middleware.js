/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require("jsonwebtoken")

function restrict(role = "admin") {
  return async (req, res, next) => {
    const authError = {
      message: "Invalid credentials",
    }

    try {
      // this utilizes the `cookie-parser` middleware to pull the the JWT out 
      // of the cookies that were automatically sent by the client 
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json(authError)
      } 

      // this checks to make sure the token's sig is valid. 
      // if it is, we can trust the data in the payload and consider the user logged in
      // if it isn't, we know the payload may have been tampered with, 
      // and we make the user login again
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
        if (err || decodedPayload.userRole !==role) {
          return res.status(401).json(authError)
        }

        // we attach the decoded payload values to the request, 
        // just in case we need to access them in later mw functions or route handlers
        // (to look up the user by ID, for example)
        req.token = decodedPayload

        next()
      })
    } catch(err) {
       next(err)
    }
  }
}

module.exports = restrict
