import Logger from 'log4you';

export default new Logger({
	enabled: true,
	level: 80,
	name: 'pm2/daemon',
	group: { seperator: ':' },
	format: '{brightCyan}%time{reset} {white}(app:%name pid:%pid) %color[%level%group]{reset}',
});
