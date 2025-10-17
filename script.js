//Local Quotes
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

//DOM elements
const quoteText = document.getElementById("quoteText");
const authorText = document.getElementById("authorText");
const generateBtn = document.getElementById("generateBtn");
const shareBtn = document.getElementById("shareBtn");

let presentQuote = { content: "", author: "" };
let lastApiSuccess = false;

async function fetchQuote(retry = false) {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en";
  const fullUrl = proxyUrl + apiUrl;
  console.log(`Fetching from API: ${fullUrl} (retry: ${retry})`);

  try {
    const response = await fetch(fullUrl);
    console.log(`API Response Status: ${response.status}`);
    console.log(`API Response OK: ${response.ok}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`API Error (${response.status}): ${errorText}`);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("API Success: Quote fetched!", data);
    lastApiSuccess = true;
    return {
      content: data.quoteText,
      author: data.authorText || "Anonymous",
    };
  } catch (error) {
    console.warn("API fetch failed:", error.message);
    lastApiSuccess = false;

    if (retry) {
      console.log("Retry failed-using fallback");
      //fallback to random stock quote
      const randomIndex = Math.floor(Math.random() * stockQuotes.length);
      const fallback = stockQuotes[randomIndex];
      console.log("Using fallback quote:", fallback);
      return fallback;
    } else {
      //retry once
      console.log("Retrying API fetch....");
      return fetchQuote(true);
    }
  }
}

//function to display quotes
function displayQuote(quote, isFallback = false) {
  presentQuote = quote;

  //update DOM with fade-out effects
  quoteText.style.animation = "none";
  authorText.style.animation = "none";
  quoteText.style.opacity = "0";
  authorText.style.opacity = "0";

  setTimeout(() => {
    quoteText.textContent = `"${quote.content}"`;
    authorText.textContent = `- ${quote.author}`;
    if (isFallback && !lastApiSuccess) {
      authorText.textContent += "";
    }

    //fade-in animation
    quoteText.style.animation = "fadeIn 0.8s ease forwards";
    authorText.style.animation = "fadeIn 0.8s ease 0.2s forwards";
  }, 200);

  shareBtn.disabled = false;
}

//function to generate random quotes
async function generateQuote() {
  generateBtn.classList.add("loading");
  generateBtn.disabled = true;
  generateBtn.textContent = "Fetching...";
  shareBtn.disabled = true;

  try {
    const quote = await fetchQuote();
    const isFallback = !lastApiSuccess;
    displayQuote(quote, isFallback);
  } catch (error) {
    console.error("Error generating quote:", error);
    //show default message incase of total failure
    quoteText.textContent = "Unable to fetch a quote right now. Try again!";
    authorText.textContent = "- System";
  } finally {
    generateBtn.classList.remove("loading");
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate New Quote";
  }
}

//function on sharebtn
async function shareQuote() {
  if (!presentQuote.content) {
    alert("No Quote to share! Generate one first.");
    return;
  }

  const shareText = `"${presentQuote.content}" - ${presentQuote.author} #RandomQuote #Inspiration`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Random Quote",
        text: shareText,
        url: window.location.href,
      });
      console.log("Shared successfully");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
        fallbackShare(shareText);
      }
    }
  } else {
    fallbackShare(shareText);
  }
}

function fallbackShare(shareText) {
  const encodedText = encodeURIComponent(shareText);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    window.location.href
  )}&quote=${encodedText}`;
  window.open(facebookUrl, "_blank", "width=600, height=400");
  console.log("Opening Facebook sharer with quote");
}

//event listeners
generateBtn.addEventListener("click", generateQuote);
shareBtn.addEventListener("click", shareQuote);
