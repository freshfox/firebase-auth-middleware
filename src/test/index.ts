import 'reflect-metadata';
import {Container, interfaces} from 'inversify';
import * as admin from 'firebase-admin';
import * as env from 'node-env-file';
import * as fs from 'fs';

const path = __dirname + '/../../.env';
if(fs.existsSync(path)){
	env(path);
}
