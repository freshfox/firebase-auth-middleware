import 'reflect-metadata';
import * as env from 'node-env-file';
import * as fs from 'fs';
import {FirebaseAuthModule, FirebaseAuthProvider, IAuthProvider} from "../lib";
import {Container} from "inversify";

const path = __dirname + '/../../.env';
if(fs.existsSync(path)){
	env(path);
}

export class TestCase {

	private container = new Container();

	constructor(context) {
		this.container.load(
			FirebaseAuthModule.createWithFakeAuthProvider()
		);

		context.beforeEach(() => {
			const auth = this.getAuthProvider();
			// TODO clear
		});
	}

	getAuthProvider(): IAuthProvider {
		return this.container.get(FirebaseAuthProvider);
	}

}
