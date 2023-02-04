const ora = require('ora');
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { green: g, yellow: y, dim: d } = require('chalk');
const spinner = ora({ text: '' });
const questions = require('./questions');
module.exports = async () => {
	const vars = await questions();
	const outDir = vars.name;
	const ver = vars.version;
	const license = vars.license;
	const authorName = vars.authorName;
	const authorEmail = vars.authorEmail;
	const authorUrl = vars.authorUrl;
	const repo = vars.githubRepo;
	const outDirPath = path.join(process.cwd(), outDir);
	buildPackageJson = (packageJson, outDir) => {
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
		console.log(`${y(`Downloading the project structure...`)}`);
		await exec(`git clone ${repo} ${outDir}`);
		process.chdir(outDirPath);
		spinner.start(
			`${y(`Dependencies`)} installing…\n\n${d(`It may take moment…`)}`
		);
		process.chdir(outDirPath);
		await exec(`yarn`);
		spinner.succeed(`${g(`Dependencies`)} installed!`);
		console.log();
		await exec(`npx rimraf ./.git`);
		const packageJson = require(`${outDirPath}/package.json`);
		fs.rmdirSync(path.join(outDirPath, 'bin'), { recursive: true });
		fs.unlinkSync(path.join(outDirPath, 'package.json'));
		buildPackageJson(packageJson, outDir);
		spinner.succeed(
			`${g(`The installation is done, this is ready to use !`)}`
		);
		console.log();
		console.log('\x1b[34m', 'You can start by typing:');
		console.log(`    ${g(`cd ${outDir}`)}`);
		console.log(`    ${g(`yarn dev`)}`);
		console.log();
		console.log('Check Readme.md for more informations');
		console.log();
	} catch (error) {
		console.log(error);
	}
};
