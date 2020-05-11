import axios from "axios";

/**
 * Type alias for page speeds results.
 */
export type PageSpeedResults = any;

/**
 * The schema for the tabular metrics data.
 * Note, the keys will be printed.
 */
export interface ITabularMetricsData {
  "URL": string;
  "First Contentful Paint": string;
  "Speed Index": string;
  "Time To Interactive": string;
  "First CPU Idle": string;
  "Estimated Input Latency": string;
}

/**
 * Sleep interval between sequential tests.
 */
const SLEEP_INTERVAL = 5000;

/**
 * Promise that resolves after the given timeout in ms.
 * @param ms The delay in millseconds.
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 
 * @param result The page speed results json.
 */
export const toTabularMetricData = (result: PageSpeedResults): ITabularMetricsData => {
  const { audits, requestedUrl } = result.lighthouseResult;

  return {
    "URL": requestedUrl,
    "First Contentful Paint": audits["first-contentful-paint"].displayValue,
    "Speed Index": audits["speed-index"].displayValue,
    'Time To Interactive': audits["interactive"].displayValue,
    "First CPU Idle": audits["first-cpu-idle"].displayValue,
    "Estimated Input Latency": audits["estimated-input-latency"].displayValue,
  };
};

/**
 * Makes an API call to google page speeds, to test a url.
 * API key = run them simultaneously.
 * No Key = run them sequentially.
 * @param url The url to test.
 * @param apiKey  The google page speed API key.
 */
export const runPageSpeedTest = async (
  url: string,
  apiKey?: string
): Promise<PageSpeedResults> => {
  const request = await (
    axios({
      url: "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
      method: "GET",
      params: {
        apiKey,
        url,
      },
    })
  );

  return request.data;
};

/**
 * Tests multiple urls using google page speed API.
 * API key = run them simultaneously.
 * No Key = run them sequentially.
 * @param urls      The urls to test.
 * @param apiKey    The google page speed API key.
 * @param onStatus  The on status callback.
 */
export const runPageSpeedTestMany = async (
  urls: string[],
  apiKey?: string,
  onStatus?: (status: string) => void
): Promise<PageSpeedResults[]> => {
  // api key means run the tests simultaneously
  if (apiKey) {
    if (onStatus) onStatus(`Loading ${urls.length} concurrently.`);
    return Promise.all(
      urls.map(url => runPageSpeedTest(url, apiKey))
    );
  }

  // no api key means run them sequentially with 1s in between
  const results = new Array<PageSpeedResults>();

  let i = 0;
  let result: any;

  for (const url of urls) {
    if (onStatus) onStatus(url);

    result = await runPageSpeedTest(url);
    results.push(result);

    if (--i > 0) {
      await sleep(SLEEP_INTERVAL);
    }
  }

  return results;
};