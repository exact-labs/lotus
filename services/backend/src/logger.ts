import Logger from 'log4you';

/* check config.toml for logger format, or override with --log-format=json startup argument, also only show debug/trace on -v or --verbose */
export default new Logger({
	enabled: true,
	level: 80,
	name: 'pm2/backend',
	group: { seperator: ':' },
	format: '{brightCyan}%time{reset} {white}(app:%name pid:%pid) %color[%level%group]{reset}',
});
