import bcrypt from 'bcryptjs';

export const verifyPassword = function(password, hash) {
	return new Promise((resolve, reject) =>
		bcrypt.compare(password, hash, (err, valid) => (err ? reject(err) : resolve(valid)))
	);
};
