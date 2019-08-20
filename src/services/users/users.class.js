// This is the database adapter service class
const { Service } = require('feathers-nedb');
// We need this to create the MD5 hash
const crypto = require('crypto');

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
// The size query. Our chat needs 60px images
const query = 's=60';

exports.Users = class Users extends Service {
  create (data, params) {
    // This is the information we want from the user signup data
    const { email, password, githubId } = data;
    // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    // The full avatar URL
    const avatar = `${gravatarUrl}/${hash}?${query}`;
    // The complete user
    const userData = {
      email,
      password,
      githubId,
      avatar
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(userData, params);
  }  
};
