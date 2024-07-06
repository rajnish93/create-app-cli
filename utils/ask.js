import os from 'os';
import fs from 'fs';
import path from 'path';
const { Input } = require('enquirer');
import to from 'await-to-js';
import handleError from 'cli-handle-error';
import shouldCancel from 'cli-should-cancel';
import { Store } from 'data-store';

export default async ({ name, message, hint, initial }) => {
	let history = false;
	if (
		!initial &&
		name !== `name` &&
		name !== `command` &&
		name !== `description`
	) {
		history = {
			autosave: true,
			store: new Store({
				path: path.join(
					os.homedir(),
					`.history/create-starter-cli/${name}.json`
				)
			})
		};
	}
	const [err, response] = await to(
		new Input({
			name,
			message,
			hint,
			initial,
			history,
			validate(value, state) {
				if (state && state.name === `command`) return true;
				if (state && state.name === `name`) {
					if (fs.existsSync(value)) {
						return `Directory already exists: ./${value}`;
					} else {
						return true;
					}
				}
				return !value ? `Please add a value.` : true;
			}
		})
			.on(`cancel`, () => shouldCancel())
			.run()
	);
	handleError(`INPUT`, err);

	return response;
};
