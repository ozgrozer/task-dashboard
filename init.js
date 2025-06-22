var weekdayTasks = [
  ['wake up', '9:30 am', '9:40 am'],
  ['breakfast', '9:40 am', '10:20 am'],
  ['gym prep', '10:20 am', '10:40 am'],
  ['drive', '10:40 am', '11:00 am'],
  ['gym', '11:00 am', '12:00 pm'],
  ['groceries', '12:00 pm', '12:20 pm'],
  ['drive', '12:20 pm', '12:40 pm'],
  ['lunch', '12:40 pm', '12:50 pm'],
  ['shower', '12:50 pm', '1:00 pm'],
  ['work', '1:00 pm', '3:30 pm'],
  ['dinner', '3:30 pm', '4:00 pm'],
  ['walk', '4:00 pm', '4:30 pm'],
  ['work', '4:30 pm', '12:00 am'],
  ['fun', '12:00 am', '2:00 am']
]
var weekendTasks = [
  ['wake up', '9:30 am', '9:40 am'],
  ['breakfast', '9:40 am', '10:20 am'],
  ['read', '10:20 am', '10:50 am'],
  ['workout', '10:50 am', '11:30 am'],
  ['shower', '11:30 am', '11:40 am'],
  ['x', '11:40 am', '12:10 pm'],
  ['lunch', '12:10 pm', '12:30 pm'],
  ['work ', '12:30 pm', '2:00 pm'],
  ['dinner', '2:30 pm', '3:00 pm'],
  ['walk', '3:00 pm', '3:30 pm'],
  ['work ', '3:30 pm', '12:00 am'],
  ['fun', '12:00 am', '2:00 am']
]

var tasks
var getDay = new Date().getDay()
if (getDay === 0 || getDay === 6) {
  tasks = weekendTasks
} else {
  tasks = weekdayTasks
}

var fakeTime
/* var fakeTime = '1-16-2018 22:32:00' */

var state = {}
var templater = function (id, object) {
  if (!state.hasOwnProperty(id)) state[id] = {}
  var divs = document.querySelectorAll('#' + id + ' [data-templater]')
  for (var i = 0; i < divs.length; i++) {
    var div = divs[i]
    var getAttribute = div.getAttribute('data-templater')
    if (state[id][getAttribute] !== object[getAttribute]) {
      div.innerHTML = object[getAttribute]
      state[id][getAttribute] = object[getAttribute]
    }
  }
}

var splitTime = function (time) {
  var splitFullTime = time.split(' ')
  var splitHour = splitFullTime[0].split(':')
  var hour = parseInt(splitHour[0])
  var minute = parseInt(splitHour[1])
  var amPm = splitFullTime[1]
  return {
    hour: hour,
    minute: minute,
    amPm: amPm
  }
}

var t24ToT12 = function (hour) {
  var amPm = 'am'
  if (hour > 12) {
    hour -= 12
    amPm = 'pm'
  } else if (hour === 12) {
    amPm = 'pm'
  } else if (hour === 0) {
    hour = 12
  }
  return {
    hour: hour,
    amPm: amPm
  }
}

var t12ToT24 = function (hour, amPm) {
  if (hour !== 12 && amPm === 'pm') {
    hour += 12
  }
  if (hour === 12 && amPm === 'am') {
    hour = 24
  }
  return {
    hour: hour
  }
}

var calculateMinutes = function (hours, minutes) {
  return hours * 60 + minutes
}

var time = () => {
  var today = fakeTime ? new Date(fakeTime) : new Date()
  var getDate = today.getDate()
  var getMonth = today.getMonth() + 1
  var getFullYear = today.getFullYear()
  var getHours = today.getHours()
  var getMinutes = today.getMinutes()
  var getSeconds = today.getSeconds()

  var convertTime = t24ToT12(getHours)
  var cHour = convertTime.hour
  var cAmPm = convertTime.amPm

  getDate = getDate.toString()
  getMonth = getMonth.toString()
  getFullYear = getFullYear.toString()
  getHours = cHour.toString()
  getMinutes = getMinutes.toString()
  getSeconds = getSeconds.toString()

  var hours = getHours
  var minutes = getMinutes.length === 1 ? '0' + getMinutes : getMinutes
  var seconds = getSeconds.length === 1 ? '0' + getSeconds : getSeconds
  var time =
    hours + ':' + minutes + ':' + seconds + '<b id="amPm">' + cAmPm + '</b>'
  var date = getMonth + '/' + getDate + '/' + getFullYear
  return {
    time: time,
    date: date
  }
}

var run = function () {
  var today = fakeTime ? new Date(fakeTime) : new Date()
  var getHours =
    parseInt(today.getHours()) === 0 ? 24 : parseInt(today.getHours())
  var getMinutes = parseInt(today.getMinutes())
  var getNowM = getHours * 60 + getMinutes

  var currentTask
  var nextTask
  var nextTaskTime
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i]
    var taskName = task[0]
    var taskBeginningTime = task[1]
    var taskFinishTime = task[2]

    var taskBeginningSplitTime = splitTime(taskBeginningTime)
    var taskBeginningHour = taskBeginningSplitTime.hour
    var taskBeginningMinute = taskBeginningSplitTime.minute
    var taskBeginningAmPm = taskBeginningSplitTime.amPm
    taskBeginningHour = t12ToT24(taskBeginningHour, taskBeginningAmPm).hour
    var taskBeginningM = calculateMinutes(
      taskBeginningHour,
      taskBeginningMinute
    )

    var taskFinishSplitTime = splitTime(taskFinishTime)
    var taskFinishHour = taskFinishSplitTime.hour
    var taskFinishMinute = taskFinishSplitTime.minute
    var taskFinishAmPm = taskFinishSplitTime.amPm
    taskFinishHour = t12ToT24(taskFinishHour, taskFinishAmPm).hour
    var taskFinishM = calculateMinutes(taskFinishHour, taskFinishMinute)
    var ifConditionValue =
      taskBeginningAmPm === 'pm' ? taskFinishM : taskBeginningM

    if (
      (getNowM >= taskBeginningM && getNowM < taskFinishM) ||
      (taskBeginningM >= ifConditionValue &&
        taskBeginningM > taskFinishM &&
        !currentTask)
    ) {
      currentTask = taskName
      var nextTaskArrayIndex = i === tasks.length - 1 ? 0 : i + 1
      nextTask = tasks[nextTaskArrayIndex][0]
      nextTaskTime = tasks[nextTaskArrayIndex][1]
    }
  }

  if (currentTask) {
    var splitNextTaskTime = splitTime(nextTaskTime)
    var splitNextTaskTimeC = t12ToT24(
      splitNextTaskTime.hour,
      splitNextTaskTime.amPm
    )

    var getTimeM = calculateMinutes(getHours, getMinutes)
    var splitNextTaskTimeM = calculateMinutes(
      splitNextTaskTimeC.hour,
      splitNextTaskTime.minute
    )

    var calculateRemainMinutes
    if (splitNextTaskTimeM > getTimeM) {
      calculateRemainMinutes = splitNextTaskTimeM - getTimeM
    } else {
      calculateRemainMinutes = 1440 - getTimeM + splitNextTaskTimeM
    }
    var remainHours = Math.floor(calculateRemainMinutes / 60)
    var remainMinutes = (calculateRemainMinutes - remainHours * 60).toString()
    remainMinutes =
      remainMinutes.length === 1 ? '0' + remainMinutes : remainMinutes
    var currentTaskRemain = remainHours + ':' + remainMinutes

    templater('templater', {
      currentTime: time().time,
      currentDate: time().date,
      currentTask: currentTask,
      nextTask: nextTask,
      currentTaskRemain: 'eta: ' + currentTaskRemain,
      nextTaskTime: nextTaskTime
    })
  }
}

run()
setInterval(run, fakeTime ? 100000 : 1000)
