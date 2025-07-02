// middleware/validation.js
const { validationResult } = require('express-validator')

const validation = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }))

    return res.status(400).json({
      error: 'Validation failed',
      details: errorMessages
    })
  }

  next()
}

module.exports = validation