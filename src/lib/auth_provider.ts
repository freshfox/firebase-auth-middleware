import * as admin from 'firebase-admin';
import DecodedIdToken = admin.auth.DecodedIdToken;
import UserRecord = admin.auth.UserRecord;
import {injectable} from "inversify";
import * as uuid from 'uuid/v4';

export const FirebaseAuthProvider = Symbol('FirebaseAuthProvider');
export const FirebaseAuth = Symbol('FirebaseAuth');

export interface IFirebaseStorageConfig {
	bucket: string;
}

export interface IAuthProvider {

	createUser(name: string, email: string, password: string): Promise<UserRecord>;

	updateUser(userId: string, name: string, email: string, password: string): Promise<UserRecord>;

	deleteUser(userId: string): Promise<void>;

	verifyToken(token: string): Promise<DecodedIdToken>;

}

@injectable()
export class FakeAuthProvider implements IAuthProvider {

	private users = {};

	createUser(name: string, email: string, password: string): Promise<UserRecord> {
		const token = `${email}`;

		if (password.length < 6) {
			return Promise.reject(new Error('The password must be a string with at least 6 characters.'))
		}

		this.users[token] = {
			uid: uuid(),
			displayName: name,
			email: email
		};
		return Promise.resolve(this.users[token]);
	}

	async verifyToken(token: string): Promise<any> {
		const user = this.users[token];
		if (user) {
			return user;
		}
		return Promise.reject('User not found');
	}

	updateUser(userId: string, name: string, email: string, password: string): Promise<UserRecord> {
		return undefined;
	}

	deleteUser(userId: string): Promise<void> {
		return undefined;
	}

}
