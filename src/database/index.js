'use strict'; // eslint-disable-line strict, lines-around-directive

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const config = {
	username: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	timezone: '+09:00',
	dialect: 'mysql',
};

export const sequelize = new Sequelize(config.database, config.username, config.password, config);

export const transaction = sequelize.transaction.bind(sequelize);

export const { Op } = Sequelize;

const models = {};

const importDirectory = (directory) => {
	fs.readdirSync(directory)
		.filter((file) => file.endsWith('.js'))
		.forEach((file) => {
			const name = file.replace(/\.js$/, '');
			const model = sequelize.import(path.join(directory, file));
			models[name] = model;
		});
};

const importFile = (filepath) => {
	const name = path.basename(filepath).replace(/\.js$/, '');
	const model = sequelize.import(filepath);
	models[name] = model;
};

const associate = () => {
	// eslint-disable-next-line consistent-return
	fs.readdirSync(path.join(__dirname, 'models'), { withFileTypes: true }).forEach((file) => {
		if (file.isDirectory()) return importDirectory(path.join(__dirname, 'models', file.name));
		if (file.name.endsWith('.js')) importFile(path.join(__dirname, 'models', file.name));
	});

	Object.keys(models)
		.filter((name) => 'associate' in models[name])
		.forEach((name) => models[name].associate(models));

	console.log('- associated database models...');
};

export const getModel = (name) => {
	if (name in models) return models[name];
	return sequelize.import(path.join(__dirname, 'models', `${name}.js`));
};

export const field = (type, comment, allowNull = true, options = {}) => {
	if (typeof comment !== 'string') console.error('코멘트는 문자열이어야 합니다');
	if (typeof allowNull !== 'boolean') console.error('널여부는 불린값이어야 합니다.');
	return { type, comment, allowNull, ...options };
};

associate();
