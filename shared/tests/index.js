let i = 0;

while (i < 50) {
	console.log(`pm2 log out test: this is on line [${i}]`);
	console.error(`pm2 log error test: this is on line [${i}]`);
	i++;
}
