#!/usr/bin/env node

import init from './utils/init.js'; // Remove the extra dot (.) after 'init'
import cli from './utils/cli.js';
import log from './utils/log.js';
import generate from './utils/generate.js';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes('help') && cli.showHelp(0);
	debug && log(flags);

	await generate();
})();
