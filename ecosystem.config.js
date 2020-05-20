const dotenv = require('dotenv');
const ssm = require('aws-param-env');

const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
	ssm.load('ssm_key', { region: 'ap-northeast-2' });
} else dotenv.config();

module.exports = {
	apps: [
		{
			name: 'starteacher',
			script: process.env.NODE_ENV === 'production' ? './dist/index.js' : './src/index.js',
			watch: env === 'development' ? './src' : false,
			watch_options: { followSymlinks: false, usePolling: true },
			max_memory_restart: '300M',
			log_date_format: 'YYYY-MM-DD HH:mm Z',
			error_file: 'err.log',
			out_file: env === 'development' ? 'out.log' : '/dev/null',
			source_map_support: env === 'development',
			interpreter_args: env === 'development' ? '-r @babel/polyfill -r @babel/register --trace-warnings' : '',
		},
	],
};
