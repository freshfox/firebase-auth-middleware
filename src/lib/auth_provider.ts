import 'reflect-metadata';
import {injectable} from "inversify";
import * as admin from 'firebase-admin';
import DecodedIdToken = admin.auth.DecodedIdToken;
import UserRecord = admin.auth.UserRecord;
import * as uuid from 'uuid/v4';

export const FirebaseAuthProvider = Symbol('FirebaseAuthProvider');
export const FirebaseAuth = Symbol('FirebaseAuth');

export interface IAuthProvider {

	getUser(uid: string): Promise<UserRecord>;

	createUser(name: string, email: string, password: string): Promise<UserRecord>;

	updateUser(userId: string, name: string, email: string, password: string): Promise<UserRecord>;

	setEmail(userId: string, email: string): Promise<UserRecord>

	setPassword(userId: string, password: string): Promise<UserRecord>

	deleteUser(userId: string): Promise<void>;

	verifyToken(token: string): Promise<DecodedIdToken>;

	listUsers(): Promise<UserRecord[]>;

}

@injectable()
export class FakeAuthProvider implements IAuthProvider {

	private users: UserRecord[] = [];

	async getUser(uid: string) {
		return this.users.find(u => u.uid === uid);
	}

	async createUser(name: string, email: string, password: string): Promise<UserRecord> {
		if (password.length < 6) {
			return Promise.reject(new Error('The password must be a string with at least 6 characters.'))
		}
		const user: UserRecord = {
			uid: uuid(),
			displayName: name,
			email: email,
			passwordHash: password
		} as any;
		this.users.push(user);
		return user;
	}

	async verifyToken(token: string): Promise<any> {
		const user = await this.getUser(token);
		if (user) {
			return user;
		}
		return Promise.reject('User not found');
	}

	async updateUser(userId: string, name: string, email: string, password: string): Promise<UserRecord> {
		const user = await this.getUser(userId);
		if (!user) {
			return null;
		}
		user.displayName = name;
		user.email = email;
		user.passwordHash = password;
		return user;
	}

	async setEmail(userId: string, email: string) {
		const user = await this.getUser(userId);
		if (!user) {
			return null;
		}
		user.email = email;
		return user;
	}

	async setPassword(userId: string, password: string) {
		const user = await this.getUser(userId);
		if (!user) {
			return null;
		}
		user.passwordHash = password;
		return user;
	}


	deleteUser(userId: string): Promise<void> {
		const index = this.users.findIndex(u => u.uid === userId);
		if (index >= 0) {
			this.users.splice(index, 1);
		}
		return Promise.resolve();
	}

	listUsers(): Promise<UserRecord[]> {
		return Promise.resolve(this.users);
	}

	clear() {
		this.users = [];
	}

}
