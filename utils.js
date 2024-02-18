const jwt = require('jsonwebtoken');

function generateJwtToken(user) {
  const tokenPayload = {
    userId: user.user_id,
    // Add other relevant user information if needed
  };

  const secretKey = process.env.JWT_SECRET_KEY; // Retrieve from environment variable for security

  const token = jwt.sign(tokenPayload, secretKey, {
    expiresIn: '1h', // Adjust expiration time as needed
  });

  return token;
}

// Export the function for use in other parts of your application:
module.exports = { generateJwtToken };