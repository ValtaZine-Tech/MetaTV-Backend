/**
 * Basic validation functions.
 * In a production app, you might want to integrate a full-featured library like Joi or Yup.
 */

/**
 * Checks if the provided email is in a valid format.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
exports.isValidEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };
  
  /**
   * Checks if the provided string meets password complexity requirements.
   * Example: at least 6 characters long.
   * @param {string} password - The password to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  exports.isValidPassword = (password) => {
    return typeof password === 'string' && password.length >= 6;
  };
  