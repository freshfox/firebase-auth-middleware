import {Container} from "inversify";
import {FirebaseAuthModule, FirebaseAuthProvider, FirebaseAuthProviderImpl, IAuthProvider} from "../lib";
import * as should from 'should';

describe('Module', function () {

	it('should load provider via module', async () => {

		const container = new Container();
		container.load(
			FirebaseAuthModule.createWithFirebaseAuthProvider({} as any)
		);
		const auth = container.get<IAuthProvider>(FirebaseAuthProvider);
		should(auth).instanceOf(FirebaseAuthProviderImpl);

	});

});
