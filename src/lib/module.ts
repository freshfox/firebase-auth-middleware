import {ContainerModule} from "inversify";
import {FirebaseAuthProviderImpl} from "./firebase_auth_provider";
import {FirebaseAuthProvider, FakeAuthProvider, IAuthProvider, FirebaseAuth} from "./auth_provider";
import * as admin from "firebase-admin";
import {FirebaseAuthMiddleware} from "./middleware";

export class FirebaseAuthModule {

	module: ContainerModule;

	constructor(authProvider: new () => IAuthProvider, auth: admin.auth.Auth) {
		this.module = new ContainerModule((bind) => {
			bind(FirebaseAuthProviderImpl).toSelf().inSingletonScope();
			bind(FakeAuthProvider).toSelf().inSingletonScope();
			bind(FirebaseAuthMiddleware).toSelf().inSingletonScope();
			bind<IAuthProvider>(FirebaseAuthProvider).to(authProvider).inSingletonScope();
			if (auth) {
				bind(FirebaseAuth).toConstantValue(auth);
			}
		});
	}

	static createWithFakeAuthProvider() {
		const md = new FirebaseAuthModule(FakeAuthProvider, null);
		return md.module;
	}

	static createWithFirebaseAuthProvider(auth: admin.auth.Auth) {
		const md = new FirebaseAuthModule(FakeAuthProvider, auth);
		return md.module;
	}
}
