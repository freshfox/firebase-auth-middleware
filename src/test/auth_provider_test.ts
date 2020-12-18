import {TestCase} from "./index";
import * as should from 'should';

describe('FirebaseAuthProvider', function () {

	const tc = new TestCase(this);
	const auth = tc.getAuthProvider();

	it('should create and list users', async () => {
		const user = await auth.createUser('Test User', 'test@example.com', 'password');
		const users = await auth.listUsers();
		should(users).length(1);
		should(users[0].uid).eql(user.uid);
	});

	it('should create and list a user by email', async () => {
		const user = await auth.createUser('Test User', 'email@example.com', 'password');
		const foundUser = await auth.findUserByEmail('email@example.com');
		should(foundUser.email).eql('email@example.com');
	});

	it('should fail to create a user', async () => {
		await should(auth.createUser('Test User', 'test@example.com', '123')).rejected();
	});
});
