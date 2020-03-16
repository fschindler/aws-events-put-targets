import * as core from '@actions/core'
import path from 'path'
import fs from 'fs'
import aws from 'aws-sdk'

async function run(): Promise<void> {
  try {
    const cloudWatchEvents = new aws.CloudWatchEvents({
      customUserAgent: 'aws-events-put-targets-for-github-actions'
    })

    // Get inputs
    const targetsFile = core.getInput('targets', {required: true})

    // Run the task
    core.debug('Put the targets')
    const targetsPath = path.isAbsolute(targetsFile)
      ? targetsFile
      : path.join(process.env.GITHUB_WORKSPACE || '', targetsFile)
    const fileContents = fs.readFileSync(targetsPath, 'utf8')
    const targetsContents = JSON.parse(fileContents)
    await cloudWatchEvents.putTargets(targetsContents).promise()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
