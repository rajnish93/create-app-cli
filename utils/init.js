import welcome from 'cli-welcome';
// import pkg from './../package.json';
import unhandled from 'cli-handle-unhandled';

export default ({ clear = true }) => {
	unhandled();
	welcome({
		title: `create-starter-cli`,
		tagLine: `by Rajnish Singh`,
		description: '',
		version: '',
		bgColor: '#6cc24a',
		color: '#000000',
		bold: true,
		clear
	});
};
