const stockQuotes = [
  {
    content: "In the end, we only regret the chances we didn't take",
    author: "Lewis Carroll",
  },
  { content: "Sometimes you Win, Sometimes you Learn", author: "John Maxwell" },
  {
    content: "Do something today that your future self will thank you for",
    author: "Sean Patrick Flanery",
  },
  {
    content:
      "You don't have to be great to start, but you have to start to be great",
    author: "Zig Ziglar",
  },
  {
    content: "Don't watch the clock; do what it does. Keep going",
    author: "Sam Levenson",
  },
];

const quoteText = document.getElementById("quoteText");
const authorText = document.getElementById("authorText");
const generateBtn = document.getElementById("generateBtn");
const shareBtn = document.getElementById("shareBtn");

let presentQuote = { content: "", author: "" };

async function fetchQuote() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();
    return {
      content: data.content,
      author: data.author || "Anonymous",
    };
  } catch (error) {
    console.warn("API fetch failed, using fallback", error);
    //fallback to random stock quote
    const randomIndex = Math.floor(Math.random() * stockQuotes.length);
    return stockQuotes[randomIndex];
  }
}
