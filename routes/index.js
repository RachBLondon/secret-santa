const express = require('express')
const fs = require('fs').promises
const router = express.Router()
const env = require('env2')(__dirname + './../.env')
const path = require('path')
const players = require(__dirname + './../players')

const getPlayers = async () => {
  const players = await fs.readFile(__dirname + '/../data.json')
  console.log('players', JSON.parse(players))
  return JSON.parse(players)
}

router.get('/', function (req, res, next) {
  res.render('index')
})

router.post('/check-secret', (req, res) => {
  console.log(process.env.SECRET)
  if (req.body.secret !== process.env.SECRET) {
    res.render('index', { secretError: true })
  }
  res.render('signup', { players })
})

// return  res.sendFile(path.join(__dirname + '/views/index-fail.html'));
router.post('/sign-up', async (req, res) => {
  const players = await getPlayers()
  console.log('2', players)
  players.push({ [req.body.name]: req.body })
  await fs.writeFile('data.json', JSON.stringify(players))
  res.render('index')
})
// fs.writeFileSync('student-2.json', JSON.stringify(req.body));

module.exports = router
