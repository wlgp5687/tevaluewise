import { sequelize, getModel } from '../src/database';

const sync = async () => {
	try {
		await sequelize.query('SET FOREIGN_KEY_CHECKS=0', null, { raw: true });
		const M = getModel('Calendar');
		await M.sync({ force: false, alter: true });
		// await sequelize.sync({ force: false, alter: true });
		await sequelize.query('SET FOREIGN_KEY_CHECKS=1', null, { raw: true });
		console.log('finished');
	} catch (err) {
		console.error(err);
	}
	process.exit(0);
};

sync();
