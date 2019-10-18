const rater = _ => {
  const ids = ['A', 'B', 'C', 'D', 'E']
  let random = Math.floor(Math.random() * 5)
  return ids[random]
}

const date = _ => {
  const pre = '10/'
  const suf = '/05'
  let random = Math.floor((Math.random() * 30) + 1)
  return `${pre}${random}${suf}`
}

const three = _ => {
  const labels = ['Low', 'Average', 'High']
  let random = Math.floor(Math.random() * 3)
  return labels[random]
}

const five = _ => {
  const labels = ['Bad', 'Okay', 'Intermediate', 'Great', 'Exceptional']
  let random = Math.floor(Math.random() * 5)
  return labels[random]
}

module.exports = {
  rater,
  date,
  three,
  five
}