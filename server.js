const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const logger = (req, res, next) => {
	console.log(req.url)
	console.dir(req.ip)
	let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
	console.log(ip)
	next()
}

app.use(logger)
app.use(express.static('images'))

app.get('/', (req, res) => {
	// console.log(req)
	res.send('hello world')
})

app.get(/h/, (req, res) => {
	console.log(req)
})

app.listen(port, () => console.log(`listening on port ${port}`))
