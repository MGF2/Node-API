const postTrackingSchema = {
  amount: {
    isCurrency: true,
    notEmpty: true,
  },
  description: {
    isString: true,
  },
  issuer: {
    isUUID: true,
    notEmpty: true,

  },
  beneficiary: {
    isUUID: true,
    notEmpty: true,

  },
  ethereum_id: {
    isUUID: true,
    notEmpty: true,

  },
}

  module.exports = postTrackingSchema;