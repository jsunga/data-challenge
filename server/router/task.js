const express = require('express')
const router = express.Router()
const db = require('../config/database')

// Generate Random Data
const generate = require('./utils/generate')

// Task Model
const Task = require('../models/Task')

router.get('/', async (req, res) => {
  try {
    let response = await db.query(`
    select * from tasks
    `)
    res.send(response[0])
  } catch(err) {
    res.send('err')
  }
})

router.get('/post', async (req, res) => {
  try {
    let response = await db.query('SELECT COUNT(task_id) FROM tasks')
    if (response[0][0].count > 0) {
      res.send('full')
      return
    }

    for (let i = 0; i < 10000; i++) {
      const newTask = {
        rater_id: generate.rater(),
        date: generate.date(),
        correct_answer_3: generate.three(),
        correct_answer_5: generate.five(),
        rater_answer_3: generate.three(),
        rater_answer_5: generate.five()
      }

      if (newTask.correct_answer_3 === newTask.rater_answer_3) {
        newTask.agree_answers_3 = true
      } else {
        newTask.agree_answers_3 = false
      }

      if (newTask.correct_answer_5 === newTask.rater_answer_5) {
        newTask.agree_answers_5 = true
      } else {
        newTask.agree_answers_5 = false
      }

      await Task.create(newTask)
    }

    res.send('success')
  } catch (err) {
    console.log(err)
    res.send('error')
  }

})

router.get('/rate/:day', async (req, res) => {
  const {
    day
  } = req.params

  let newDay = '10/' + day + '/05'

  try {
    let response = await db.query(`
    select
    ((select count(agree_answers_3)::float from tasks where agree_answers_3 = true and date in (select date from tasks where date = :newDay))
      +											
    (select count(agree_answers_5)::float from tasks where agree_answers_5 = true and date in (select date from tasks where date = :newDay)))
      /																				   
    ((select count(agree_answers_3)::float from tasks where agree_answers_3 = false and date in (select date from tasks where date = :newDay))
      +											
    (select count(agree_answers_5)::float from tasks where agree_answers_5 = false and date in (select date from tasks where date = :newDay))
      +																					
    (select count(agree_answers_3)::float from tasks where agree_answers_3 = true and date in (select date from tasks where date = :newDay))
      +											
    (select count(agree_answers_5)::float from tasks where agree_answers_5 = true and date in (select date from tasks where date = :newDay)))
    * 100
    as agreement_rate_day
    `, {
      replacements: {
        newDay
      }
    })
    console.log(response)
    res.send(response[0][0])
  } catch (err) {
    console.log(err)
    res.send('err')
  }
})

router.get('/rater/:id', async (req, res) => {
  const {
    id
  } = req.params

  try {
    let response = await db.query(`
    select
    ((select count(agree_answers_3)::float from tasks where agree_answers_3 = true and rater_id in (select rater_id from tasks where rater_id=:id))
      +											
    (select count(agree_answers_5)::float from tasks where agree_answers_5 = true and rater_id in (select rater_id from tasks where rater_id=:id)))
      /																				   
    ((select count(agree_answers_3)::float from tasks where agree_answers_3 = false and rater_id in (select rater_id from tasks where rater_id=:id))
      +											
    (select count(agree_answers_5)::float from tasks where agree_answers_5 = false and rater_id in (select rater_id from tasks where rater_id=:id))
      +																					
    (select count(agree_answers_3)::float from tasks where agree_answers_3 = true and rater_id in (select rater_id from tasks where rater_id=:id))
      +											
    (select count(agree_answers_5)::float from tasks where agree_answers_5 = true and rater_id in (select rater_id from tasks where rater_id=:id)))
    * 100
    as raters_agreement_rates
    `, {
      replacements: {
        id
      }
    })

    res.send(response[0][0])
  } catch (err) {
    res.send('err')
  }
})

router.get('/completed/:id', async (req, res) => {
  const {
    id
  } = req.params

  try {
    let response = await db.query(`
    select
    count(rater_id)
    from tasks
    where rater_id = :id
    `, {
      replacements: {
        id
      }
    })
    res.send(response[0][0])
  } catch (err) {
    res.send('err')
  }
})

router.get('/overall', async (req, res) => {
  try {
    let response = await db.query(`
    select
    (select count(*)::float
    from tasks
    where agree_answers_3 = true
    and agree_answers_5 = true)
    /
    (select count(*)::float
    from tasks) * 100
    as overall_agreement_rate
    `)
    res.send(response[0][0])
  } catch (err) {
    res.send('err')
  }
})

module.exports = router