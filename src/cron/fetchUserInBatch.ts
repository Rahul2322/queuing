import { Queue, Worker } from "bullmq";
import { getConfigKey } from "../config/locals";
import axios, { AxiosResponse } from "axios";
import { User } from "../models/users.model";
import { formatUser } from "../utils/user-format.util";

const connection = {
  host: "localhost",
  port: 6379,
};


export const queue = new Queue("user-fetch-queue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});

async function fetchAllUsers() {
  const apiUrl = await getConfigKey("apiUrl");
  const requestsPerSecond = await getConfigKey("requestsPerSecond");
  const requestsPerBatch = await getConfigKey("requestsPerBatch");
  const sleepTime = await getConfigKey("sleepTime");
  const batchSleepTime = await getConfigKey("batchSleepTime");

  const totalBatches = Math.ceil(5000 / requestsPerBatch);

  for (let batch = 0; batch < totalBatches; batch++) {
    for (let i = 0; i < Math.ceil(requestsPerBatch / 100); i++) {
      await fetchUsersBatch(apiUrl, requestsPerSecond);
      await sleep(sleepTime * 1000);
    }

    if (batch < totalBatches - 1) {
      await sleep(batchSleepTime * 1000);
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUsersBatch(apiUrl: string, requestsPerSecond: number) {
  const promises:Promise<AxiosResponse<any>>[] = [];
  for (let i = 0; i < requestsPerSecond; i++) {
    promises.push(
        axios.get(`${apiUrl}?results=100`)
      );
      await delay(1000 / requestsPerSecond);
  }

  const results: AxiosResponse<any>[] = await Promise.all(promises);  
  const users = results.flatMap((res) => res.data.results.map(formatUser));
  console.log(users.length,users[0]);
  
  await User.insertMany(users, { ordered: false })
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const worker = new Worker(
  "user-fetch-queue",
  async () => {
    await fetchAllUsers();
  },
  {
    connection
  }
);

worker.on("completed", (job) => {
  console.log(`Job completed with result: ${job.returnvalue}`);
});

worker.on("failed", (job, err) => {
  console.error(`Job failed with error: ${err}`);
});
