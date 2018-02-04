const
  express = require('express')
  router = express.Router()
  async = require('async')
  _ = require('lodash')

/**
 * Simulated work routine for generating semi-random output
 *
 * In a real application, this could be any complex job that runs asynchronously
 * and/or takes a variable amount of time to complete
 */
makeid = () => {
  let text = ""
  let space = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < 5; i++)
    text += space.charAt(Math.floor(Math.random() * space.length))
  return text
}

/**
 * Generate random number within a range between min and max
 * @param  {Number} min
 * @param  {Number} max
 */
getNumInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Async queue that accepts a "worker" function and a concurrency setting (50 in this case)
 *
 * For the purposes of example, we simulate and asynchronous and long-running job here:
 *
 * First, set a timeout using the time parameter passed in the task payload
 * Next, generate a semi-random output that simulates work being completed
 * Finally, call the callback with either a processing error or completed output
 *
 * @param  {Object} task job payload which contains information for processing
 * @param  {Function} callback the function to run when processing completes
 */
var q = async.queue((task, callback) => {
  setTimeout(() => {
    let id = makeid()
    if (task.time < 20000) {
      return callback(new Error(`Contrived error occurred while processing task ${id}`))
    } else {
      return callback(null, id)
    }
  }, task.time)
}, 50)

/**
 * Our processing endpoint that accepts jobs and
 *
 * @param  {Object} req Express request object
 * @param  {Object} res Express response object
 */
router.post('/process', (req, res) => {
  q.push({ time: getNumInRange(10000, 60000) }, completedTaskHandler)
  res.json({ success: true, msg: 'job queued for processing' })
})

/**
 * A handy endpoint for checking processing status
 *
 * async's queue object has several useful methods for
 * monitoring and manipulating queue activity
 *
 * @See: https://caolan.github.io/async/docs.html#QueueObject
 *
 * @param  {Object} req Express request object
 * @param  {Object} res Express response object
 */
router.get('/status', (req, res) => {
  res.json({
    currentlyProcessing: q.workersList(),
    queued: q.length()
  })
})

/**
 * Function that is called upon completion of a task
 *
 * Do any saving to a db, forwarding to other systems, API calls, file writes, etc
 * that you wish here
 *
 * @param  {Error} processErr  Any error that occurred during processing of the task
 * @param  {Object} output     The successful output of processing the task
 */
completedTaskHandler = (processErr, output) => {
  if (processErr) {
    console.log(`Got processErr: ${processErr}`)
  } else {
    console.log(`Got finished output: ${output}`)
  }
}

module.exports = router;