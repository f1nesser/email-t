import express from 'express'
import fs from 'fs'
import prismaPkg from '@prisma/client'
const { PrismaClient } = prismaPkg
const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 3000

const getCurDate = () => new Date(Date.now()).toISOString()
const emailExists = async (id) => {
    return prisma.email.findUnique({
        where: {
            id: id,
        },
    })
}

const logger = async (req, res, next) => {
    const isGet = req.method === 'GET'
    const correctFormat = req.originalUrl.match(/\/[0-9]{1,}.png/)

    if (!(isGet && correctFormat)) {
        console.log('logger not applicable')
        next()
        return
    }

    let emailFile = req.url.split('/')[1]

    let data = {
        /*
        shouldve done prisma migration to create the db
        this would've avoided this non-camelCase naming
        heroku did not allow this however 
        */
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        emailid: parseInt(emailFile.split('.png')[0]),
        viewdate: getCurDate(),
    }

    let fileExists = fs.existsSync(`./images/${emailFile}`)
    let emailInDb = await emailExists(data.emailid)

    if (fileExists && emailInDb) {
        let viewAdded = await prisma.view.create({ data })
        console.log({ message: viewAdded })
    } else {
        res.json({ message: `not tracking ${emailFile}` })
    }
    next()
}

app.use(logger)
app.use(express.static('images'))

app.get('/status/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    let views = await prisma.view.findMany({
        where: {
            emailid: id,
        },
    })
    res.json({ message: views })
})

app.get('/create', async (req, res) => {
    const MAX = 10000
    const MIN = 1
    const { subject } = req.query
    const rightNow = getCurDate()
    let id,
        repeat = 1
    if (!subject) {
        res.json({ message: 'no subject' })
        return
    }
    while (repeat) {
        id = Math.floor(Math.random() * MAX) + MIN
        repeat = await prisma.email.findUnique({
            where: {
                id: id,
            },
        })
    }

    fs.copyFileSync('./baseImage/invisible.png', `./images/${id}.png`)

    const email = await prisma.email.create({
        data: {
            id: id,
            createdat: rightNow,
            subject: subject,
        },
    })
    if (email) {
        res.json({ id: id, subject: subject })
    } else {
        res.json({ message: 'failed to add email' })
    }
})

app.listen(port, () => console.log(`listening on port ${port}`))
