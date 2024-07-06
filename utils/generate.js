import ora from 'ora';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { exec as execCb } from 'child_process';
import chalk from 'chalk';
// import { green as g, yellow as y, dim as d } from 'chalk';
import questions from './questions.js';

const exec = util.promisify(execCb);
const spinner = ora({ text: '' });

export default async () => {
	const vars = await questions();
	const outDir = vars.name;
	const ver = vars.version;
	const license = vars.license;
	const authorName = vars.authorName;
	const authorEmail = vars.authorEmail;
	const authorUrl = vars.authorUrl;
	const repo = vars.githubRepo;
	const outDirPath = path.join(process.cwd(), outDir);
	const buildPackageJson = (packageJson, outDir) => {
		const newPackage = {
			...packageJson,
			name: outDir,
			version: ver,
			license: license,
			author: { name: authorName, email: authorEmail, url: authorUrl }
		};
		fs.writeFileSync(
			`${process.cwd()}/package.json`,
			JSON.stringify(newPackage, null, 2),
			'utf8'
		);
	};
	try {
		console.log(`${chalk.yellow(`Downloading the project structure...`)}`);
		await exec(`git clone ${repo} ${outDir}`);
		process.chdir(outDirPath);
		spinner.start(
			`${chalk.yellow(`Dependencies`)} installing…\n\n${chalk.dim(
				`It may take a moment…`
			)}`
		);
		process.chdir(outDirPath);
		await exec(`yarn`);
		spinner.succeed(`${chalk.green(`Dependencies`)} installed!`);
		console.log();
		await exec(`npx rimraf ./.git`);
		const packageJson = require(`${outDirPath}/package.json`);
		fs.rmdirSync(path.join(outDirPath, 'bin'), { recursive: true });
		fs.unlinkSync(path.join(outDirPath, 'package.json'));
		buildPackageJson(packageJson, outDir);
		spinner.succeed(
			`${chalk.green(`The installation is done, this is ready to use!`)}`
		);
		console.log();
		console.log('\x1b[34m', 'You can start by typing:');
		console.log(`    ${chalk.green(`cd ${outDir}`)}`);
		console.log(`    ${chalk.green(`yarn dev`)}`);
		console.log();
		console.log('Check Readme.md for more information');
		console.log();
	} catch (error) {
		console.log(error);
	}
};
