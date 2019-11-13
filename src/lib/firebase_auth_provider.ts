import {inject, injectable} from 'inversify';
import * as admin from 'firebase-admin';
import DecodedIdToken = admin.auth.DecodedIdToken;
import {FirebaseAuth, IAuthProvider} from './auth_provider';

@injectable()
export class FirebaseAuthProviderImpl implements IAuthProvider {

	constructor(@inject(FirebaseAuth) protected auth: admin.auth.Auth){
	}

	createUser(name: string, email: string, password: string) {
		return this.auth.createUser({
			displayName: name,
			email: email,
			password: password
		});
	}

	updateUser(userId: string, name: string, email: string, password: string) {
		return this.auth.updateUser(userId, {
			displayName: name,
			email: email,
			password: password
		});
	}

	setEmail(userId: string, email: string) {
		return this.auth.updateUser(userId, {
			email: email,
		});
	}

	setPassword(userId: string, password: string) {
		return this.auth.updateUser(userId, {
			password
		});
	}

	async listUsers() {
		const users = await this.auth.listUsers();
		return users.users.map((user) => {
			return {
				email: user.email,
				name: user.displayName
			}
		})
	}

	async deleteUser(userId: string) {
		return this.auth.deleteUser(userId);
	}

	verifyToken(token: string): Promise<DecodedIdToken> {
		return this.auth.verifyIdToken(token);
	}

	async getUserEmail(userId: string) {
		const user = await this.auth.getUser(userId);
		return user ? user.email : null;
	}

}
