import ask from './ask.js';

export default async () => {
	const name = await ask({
		name: `package_name`,
		message: `Project name:`,
		hint: `(starter)`,
		initial: `starter`
	});
	const version = await ask({
		name: `version`,
		message: `version:`,
		initial: `1.0.0`
	});
	const license = await ask({
		name: `license`,
		message: `License:`,
		initial: `UNLICENSED`
	});
	const authorName = await ask({
		name: `authorName`,
		message: `Author Name:`
	});
	const authorEmail = await ask({
		name: `authorEmail`,
		message: `Author Email:`
	});
	const authorUrl = await ask({
		name: `authorUrl`,
		message: `Author URL:`
	});
	const githubRepo = await ask({
		name: `githubRepo`,
		message: `Repository Url:`
	});

	const vars = {
		name,
		version,
		license,
		authorName,
		authorEmail,
		authorUrl,
		githubRepo
	};

	return vars;
};
