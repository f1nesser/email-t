const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const logger = (req, res, next) => {
	if (req.method === 'GET') {
		let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
		console.log(`${ip} requested ${req.url}`)
	}
	next()
}

app.use(logger)
app.use(express.static('images'))

app.get('/', (req, res) => {
	// console.log(req)
	res.send('hello world')
})

app.get('/create', (req, res) => {
	let { name } = req.query

	res.send(name)
})

app.listen(port, () => console.log(`listening on port ${port}`))
