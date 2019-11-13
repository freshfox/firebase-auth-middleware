import {inject, injectable} from 'inversify';
import {FirebaseAuthProvider, IAuthProvider} from './auth_provider';

@injectable()
export abstract class FirebaseAuthMiddleware {

	protected excludedPaths: string[] = [];

	protected  constructor(@inject(FirebaseAuthProvider) private auth: IAuthProvider) {}

	getMiddleware(): (req, res, next) => void {
		return this.handle.bind(this);
	}

	async handle(req, res, next) {
		let needsAuth = !this.excludedPaths || !(this.excludedPaths.find((path) => {
			return req.path.startsWith(path);
		}));

		if (!needsAuth) {
			next();
			return;
		}

		const token = this.readTokenFromRequest(req);
		if (!token) {
			const err = this.createError('Unauthorized, no token specified');
			return next(err);
		}

		try {
			const decodedToken = await this.auth.verifyToken(token);
			const user = await this.findUser(decodedToken.uid);

			if (!user) {
				let error = this.createError('Unauthorized, no user found');
				return next(error);
			}
			Object.assign(req, {
				user: user
			});
		} catch (err) {
			console.log(err);
			let error = this.createError('Unauthorized');
			return next(error);
		}
		next();
	}

	// noinspection JSMethodCanBeStatic
	protected readTokenFromRequest(req): string {
		const header = req.headers.authorization as string;
		if (header && header.startsWith('Bearer')) {
			return header.split('Bearer ')[1];
		}
		if (req.query.token) {
			return req.query.token;
		}
		return null;
	}

	abstract findUser(uid: string);

	abstract createError(msg: string): Error;

}
