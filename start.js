const concurrently = require("concurrently");

concurrently(
  [
    { command: "npm run server", name: "SERVER" },
    { command: "ollama run llama3.1:8b", name: "OLLAMA" },
    { command: "npm run app", name: "REACT_APP" },
  ],
  {
    prefix: "name",
    killOthers: ["failure", "success"],
    restartTries: 3,
  }
).result.then(
  () => console.log("All processes exited with success"),
  (error) => {
    console.error("One or more processes failed");
    error.forEach(({ command, exitCode }) => {
      console.error(`${command.name} exited with code ${exitCode}`);
    });
  }
);
