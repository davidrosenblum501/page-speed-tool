import fs from "fs";
import path from "path";

/**
 * Parses the urls text file into an array of urls.
 * @param text The urls file text contents.
 */
const parseUrlsList = (text: string): string[] => {
  return text
    .replace(/[\s,]/g, "\n")
    .split("\n")
    .map(url => url.trim())
    .filter(url => url.length);
};

/**
 * Promises the urls text file and returns the urls array.
 */
export const loadUrlsToTest = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    // find the urls text file path
    const filePath = path.resolve('urls.txt');

    // read the file
    fs.readFile(filePath, (err, buffer) => {
      // file io error
      if (err) {
        return reject(err);
      }

      // loaded - parse it
      const text = buffer.toString();
      const urls = parseUrlsList(text);
        
      // return the parsed urls
      resolve(urls);
    });
  });
};