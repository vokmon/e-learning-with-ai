// Import the readline module
import * as readline from "readline";

// Create an interface for the readline
interface ReadLineInterface {
  question(query: string, callback: (answer: string) => void): void;
  close(): void;
}

const rl: ReadLineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export { rl };
