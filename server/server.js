const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/chat", async (req, res) => {
  console.log("Received request:", req.body);
  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.1:8b", // Ensure this matches the model you're running
        prompt: req.body.prompt,
      },
      {
        responseType: "stream",
      }
    );

    let fullResponse = "";
    response.data.on("data", (chunk) => {
      const chunkData = JSON.parse(chunk.toString());
      if (chunkData.response) {
        fullResponse += chunkData.response;
      }
    });

    response.data.on("end", () => {
      console.log("Full response:", fullResponse);
      res.json({ response: fullResponse });
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Add this new test route
app.get("/test", async (req, res) => {
  try {
    console.log("Test route accessed");
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.1:8b",
        prompt: "Hello, how are you?",
      },
      {
        responseType: "stream",
      }
    );

    let fullResponse = "";
    response.data.on("data", (chunk) => {
      const chunkData = JSON.parse(chunk.toString());
      if (chunkData.response) {
        fullResponse += chunkData.response;
      }
    });

    response.data.on("end", () => {
      console.log("Full response:", fullResponse);
      res.json({ response: fullResponse });
    });
  } catch (error) {
    console.error("Test Error:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    res.status(500).json({ error: "Test failed: " + error.message });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
