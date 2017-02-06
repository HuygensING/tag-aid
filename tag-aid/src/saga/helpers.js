import { fork, cancel, take } from 'redux-saga/effects'
import { isArray, includes } from 'lodash'

const arrayze = (a) => isArray(a) ? a : [a]

const mergePatterns = (...patterns) => patterns.reduce((finalPattern, pattern) => {
  return [ ...finalPattern, ...arrayze(pattern) ]
}, [])

const matchPattern = (action, pattern) =>
  pattern === '*' || includes(action.type, arrayze(pattern))

export function* takeEveryAndCancel(pattern, cancelPattern, saga, ...args) {
  const task = yield fork(function* () {
    let pendingTasks = []
    while (true) {
      const action = yield take(mergePatterns(pattern, cancelPattern))

      if (matchPattern(action, cancelPattern)) {
        // Cancel all pending tasks
        for (const task of pendingTasks) {
          yield cancel(task)
        }
        pendingTasks = []
      } else {
        // Fork saga and remove handled tasks
        const task = yield fork(saga, ...args.concat(action))
        pendingTasks.push(task)
        pendingTasks = pendingTasks.filter(task => !task.isRunning())
      }
    }
  })
  return task
}

export function* takeLatestAndCancel(pattern, cancelPattern, saga, ...args) {
  const task = yield fork(function* () {
    let lastTask
    while (true) {
      const action = yield take(mergePatterns(pattern, cancelPattern))

      // Cancel previous task
      if (lastTask) {
        yield cancel(lastTask)
      }
      // Fork saga only
      if (!matchPattern(action, cancelPattern)) {
        lastTask = yield fork(saga, ...args.concat(action))
      }
    }
  })
  return task
}
