# Async Job Processing Server

## Overview

A simple but working prototype of a long-running job processing server in node.js leveraging the async library, that efficiently manages complex jobs.

Accepts requests representing processing jobs, pops them onto a queue,

## Get started

```
# Clone the project and install dependencies
git clone https://github.com/zackproser/async-queue
cd async-queue
npm i
# Run the server
node app.js
# In a new tab, run the load simulating script:
./load.sh
```
As the server completes work, you'll see output like the following:

```

Got processErr: Error: Contrived error occurred while processing task y4cZI
Got processErr: Error: Contrived error occurred while processing task fLsGP
Got processErr: Error: Contrived error occurred while processing task 7yM2R
Got processErr: Error: Contrived error occurred while processing task RLWLQ
Got processErr: Error: Contrived error occurred while processing task oEQd3
Got finished output: GM2wT
Got finished output: jqSsj
Got finished output: hABKD
Got finished output: bEAZC
Got processErr: Error: Contrived error occurred while processing task TP9uD

```

## How it works

The server uses the async library and defines an async queue which runs new jobs through a worker function

## Use cases and benefits

The benefit of using this pattern is that the server can respond immediately to requesting clients, and accept and hold onto many more tasks than it can actually process simultaneously. The concurrency limit (the second argument to async.queue) allows you to throttle your server's workloads.

This allows for efficient use of server resources while processing resource-intensive or long-running jobs.

Upon job completion, you can take any action necessary for your application's behavior in the task processing callback: post results to a webhook, save them to a database, email or archive them, etc.

## Status endpoint
Meanwhile, you can use async.queue's handy methods to build a monitoring endpoint that allows you to view current queue state (and programmatically act upon it as necessary).

```
curl http://localhost:3000/status
```

Will get you:

```
{"currentlyProcessing":[{"data":{"time":39484},"next":null,"prev":null},{"data":{"time":38074},"prev":null,"next":null}],"queued":214}
```

This could be useful for debugging purposes, or to create a healthcheck endpoint that another system can consume when determining whether or not to spin up or down additional processing machines.