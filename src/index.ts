import { runPageSpeedTestMany, toTabularMetricData } from "./utils/page-speed";
import { loadUrlsToTest } from "./utils/urls-file";

/**
 * The main method.
 */
export const main = async (): Promise<void> => {
  console.log("[---| Page Speed Tool |---]\n");

  // get the api key from environment variable
  const apiKey = process.env.API_KEY;

  // the urls to test
  let urls: string[];

  // the test results from page speeds
  let testResults: any;

  // step 1: load the urls text file and parse it
  try {
    console.log("Loading URLs file...");
    urls = await loadUrlsToTest();
    console.log(`Found ${urls.length} URLs to test.\n`);
  }
  catch (err) {
    console.log("Error reading URLs file.");
    console.log(err.message);
    process.exit();
  }

  // step 2: the run tests
  try {
    console.log("Running page speeds tests...");
    testResults = await runPageSpeedTestMany(urls, apiKey, status => console.log(status));
    console.log("Tests complete.\n");

  }
  catch (err) {
    console.log("Error with page speeds testing.");
    console.log(err.message);
    process.exit();
  }

  // print the results
  const tabularData = testResults.map(toTabularMetricData);
  console.table(tabularData);
};

// run main method
if (require.main === module) {
  main();
}