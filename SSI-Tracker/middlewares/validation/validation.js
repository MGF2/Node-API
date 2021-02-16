const { validationResult } = require('express-validator');

const validate = validations => {
    return async (req, res, next) => {

      try {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
          return next();
        }
        // console.log(errors)
        res.sendStatus(406)
      } catch (e) {
        res.sendStatus(406)
      }

    };
  };

  module.exports = validate;