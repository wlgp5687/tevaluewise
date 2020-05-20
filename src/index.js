import '@babel/polyfill';
import http from 'http';
import Debug from 'debug';
import app from './app';
import { runTaskQueue } from './bull';

runTaskQueue();

const debug = Debug('freecell:server');
const server = http.createServer(app);

server.on('error', (err) => {
	if (err.syscall !== 'listen') throw err;
	console.error(err.message);
	process.exit(1);
});

server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
	debug(`listening on ${bind}`);
});

server.listen(process.env.SERVER_PORT);

console.log('- http server started...');
