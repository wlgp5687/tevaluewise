import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// import session from 'express-session';
// import createSessionStore from 'connect-redis';
// import Redis from 'redis';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import permission from 'permission';
import csrf from 'csurf';
// import { logger, errorLogger } from './services/logger';
import morgan from 'morgan';

// router
import router from './routes/router';
import { sequelize } from './database';
import { handleNotFound, handleRender, handleUncaught } from './routes/error';

const app = express();
const env = process.env.NODE_ENV || 'development';

// security measures
app.use(helmet({ frameguard: false }));
app.set('permission', {
	after: (req, res, next, status) => {
		if (status === permission.NOT_AUTHENTICATED) return res.status(403).send('not authenticated');
		if (status === permission.NOT_AUTHORIZED) return res.status(403).send('not authorized');
		return next();
	},
});

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(
	cors({
		origin: [
			// production
			'https://starteacher.co.kr',
			'https://www.starteacher.co.kr',
			// local
			'http://localhost:3000',
			'http://localhost:4000',
		],
		credentials: true,
	}),
);

app.set('trust proxy', 1);

app.use(
	csrf({
		cookie: true,
		ignoreMethods: env !== 'test' ? ['GET', 'HEAD', 'OPTIONS'] : ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH'],
	}),
);

// router
app.use(morgan(env !== 'production' ? 'dev' : 'tiny'));
app.use('/', router);
// error router
app.use(handleNotFound);
// if (env === 'production') app.use(errorLogger({ reportToSlack: true }));
// app.use(errorLogger({ saveAsFile: true, saveAsJson: true }));
app.use(handleRender);
process.on('uncaughtException', handleUncaught(1));
process.on('SIGINT', handleUncaught(2));

export default app;
