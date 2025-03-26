/**
 * A collection of helper functions.
 */

/**
 * Formats a JavaScript Date object into a readable string.
 * @param {Date} date - The date to format.
 * @returns {string} A formatted date string.
 */
exports.formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Generates a random alphanumeric string of the specified length.
   * @param {number} length - The length of the random string.
   * @returns {string} A random alphanumeric string.
   */
  exports.generateRandomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  