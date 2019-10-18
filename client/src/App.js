import React, { Component } from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'
import axios from 'axios'

export default class App extends Component {

  state = {
    data: [],
    days: [],
    weekly: [],
    raters: [],
    completed: [],
    overall: [],
    loading: true,
  }

  componentDidMount = async _ => {
    let tasks = await axios.get('/api/task')
    this.setState({
      data: tasks.data
    })

    let days = []
    for(let i = 1; i <= 30; i++) {
      let rate = await axios.get(`/api/task/rate/${i}`)
      days.push({
        day: `October ${i}`,
        data: rate.data.agreement_rate_day,
      })
    }
    this.setState({ days, weekly: this.getWeekly(days) })
    
    let raters = ['A', 'B', 'C', 'D', 'E']
    let arr = []
    for(let i = 0; i < raters.length; i++) {
      let rates = await axios.get(`/api/task/rater/${raters[i]}`)
      arr.push({
        rater: raters[i],
        data: rates.data.raters_agreement_rates
      })
    }
    arr.sort((a,b) => b.data - a.data)
    this.setState({ raters: arr })

    let arr2 = []
    for(let i = 0; i < raters.length; i++) {
      let completed = await axios.get(`/api/task/completed/${raters[i]}`)
      arr2.push({
        rater: raters[i],
        data: completed.data.count
      })
    }
    arr2.sort((a,b) => b.data - a.data)
    this.setState({ completed: arr2 })

    let overall = await axios.get('/api/task/overall')
    this.setState({ overall: overall.data.overall_agreement_rate, loading: false })
  }

  getWeekly = days => {
    let res = []
    let sum = 0
    for(let day of days) {
      sum += day.data
      if(day.day === 'October 7') {
        res.push(sum / 7.0)
        sum = 0
      } else if(day.day === 'October 14') {
        res.push(sum / 7.0)
        sum = 0
      } else if(day.day === 'October 21') {
        res.push(sum / 7.0)
        sum = 0
      } else if(day.day === 'October 30') {
        res.push(sum / 7.0)
        sum = 0
      }
    }
    return res
  }

  render() {
    return (
      <main>
        <h1>Lodestone Data Challenge</h1>
        {this.state.loading ? (
          <Loader type="Oval" height={80} width={80} style={{textAlign: 'center'}}/>
        ) : (
          <>
          <div className='table-container'>
          <table>
            <tbody>
              <tr>
                <th>Task ID</th>
                <th>Rater ID</th>
                <th>Date</th>
                <th>Correct_3</th>
                <th>Correct_5</th>
                <th>Rater_3</th>
                <th>Rater_5</th>
                <th>Agree_3</th>
                <th>Agree_5</th>
              </tr>
            </tbody>
            {this.state.data.map(item => (
              <tbody key={item.task_id}>
                <tr>
                  <td>{item.task_id}</td>
                  <td>{item.rater_id}</td>
                  <td>{item.date}</td>
                  <td>{item.correct_answer_3}</td>
                  <td>{item.correct_answer_5}</td>
                  <td>{item.rater_answer_3}</td>
                  <td>{item.rater_answer_5}</td>
                  <td>{`${item.agree_answers_3}`}</td>
                  <td>{`${item.agree_answers_5}`}</td>
                </tr>
              </tbody>
            ))}
          </table>
          </div>
          <h3>What is the agreement rate between the engineer and all the raters for each day?</h3>
          <ul>
            {this.state.days.map((item, index) => (
              <li key={index}>{item.day}: {item.data}%</li>
            ))}
          </ul>
          <h3>What is the agreement rate between the engineer and all the raters for each week?</h3>
            <ul>
              {this.state.weekly.map((item, index) => (
                <li key={index}>Week {index+1}: {item}%</li>
              ))}
            </ul>
          <h3>Identify raters that have the highest agreement rates with the engineer.</h3>
          <h3>Identify raters that have the lowest agreement rates with the engineer.</h3>
          <ul>
            {this.state.raters.map((item, index) => (
              <li key={index}>{item.rater}: {item.data}%</li>
            ))}
          </ul>
          <h3>Identify raters that have completed the most Task IDs.</h3>
          <h3>Identify raters that have completed the least Task IDs.</h3>
          <ul>
            {this.state.completed.map((item, index) => (
              <li key={index}>{item.rater}: {item.data} completions</li>
            ))}
          </ul>
          <h3>What is the overall agreement rate considering that the raters have to be in agreement with both the engineer's 3-label answer and the engineer's 5-label answer.</h3>
          <span>{this.state.overall}%</span>
          <h3>What can you do to improve agreement rates overtime?</h3>
          <h3>How do you improve precision of a label overtime?</h3>
          <h3>What changes are needed or required to improve your dataset to achieve over 90% agreement, precision, or recall?</h3>
          <h3>Why do some raters perform better than others?</h3>
          <ul>
            <li>Give raters promotions, pay increases, performance appraisal and giving feedback.</li>
            <li>Train raters better to decrease biases and increase accuracy of evaluations.</li>
            <li>Provide more and better communication with raters.</li>
            <li>More consistency in scheduling.</li>
          </ul>
          <h3>How can we train raters better?</h3>
          <h3>How can we make raters happy?</h3>
          <h3>How can we manage and communicate with raters better?</h3>
          </>
        )}
      </main>
    )
  }
}
