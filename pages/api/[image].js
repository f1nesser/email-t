const fs = require('fs')
export default function handle(req, res) {
	if (req.method != 'GET') {
		res.status(500).json({ message: 'not get' })
	}
	const { image } = req.query
	const path = `./public/${image}.png`
	// fs.readdirSync(path).forEach(file => {
	// 	console.log(file)
	// })
	const stat = fs.statSync(path)
	res.writeHead(200, {
		'Content-Type': 'image/png',
		'Content-Length': stat.size,
	})
	const readStream = fs.createReadStream(path)
	readStream.pipe(res)
}
