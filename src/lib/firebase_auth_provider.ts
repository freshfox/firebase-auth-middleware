import * as admin from 'firebase-admin';
import {inject, injectable} from 'inversify';
import {FirebaseAuth, IAuthProvider} from './auth_provider';
import DecodedIdToken = admin.auth.DecodedIdToken;
import UserRecord = admin.auth.UserRecord;

@injectable()
export class FirebaseAuthProviderImpl implements IAuthProvider {

	constructor(@inject(FirebaseAuth) protected auth: admin.auth.Auth){
	}

	getUser(uid: string): Promise<UserRecord> {
		return this.auth.getUser(uid);
	}

	createUser(name: string, email: string, password: string) {
		return this.auth.createUser({
			displayName: name,
			email: email,
			password: password
		});
	}

	updateUser(userId: string, name?: string, email?: string, password?: string) {
		const updates: admin.auth.UpdateRequest = {};
		if (name) updates.displayName = name;
		if (email) updates.email = email;
		if (password) updates.password = password;
		return this.auth.updateUser(userId, updates);
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
		return users.users;
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
