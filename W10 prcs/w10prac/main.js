// Setup
const ARRAY_SIZE = 500000;
let outputAreaRef = document.getElementById("outputArea");
outputAreaRef.innerHTML += ARRAY_SIZE+ " houses setting up and ready to go.<br/>";
// Generating array
let array =[];
for (let i = 0; i < ARRAY_SIZE; i++)
{
  let house ={
    address:i,
    result:false
  };
  array.push(house);
}

// Randomly set one house to true for result
let centerIndex = ARRAY_SIZE - 1;
let randomAddress = Math.floor(Math.random()*centerIndex);
array[randomAddress].result=true;
console.log(randomAddress);

// Randomise (shuffle) array contents
while (centerIndex > 0)
{
  let i = Math.floor(Math.random() * centerIndex);
  let tempItem = array[centerIndex];
  array[centerIndex] = array[i];
  array[i] = tempItem;
  centerIndex--;
}
// startTest runs when button clicked
function startTest()
{
  let serialSearch = serialSearchTest(array);
  outputArea.innerHTML += "Serial Search - done. Searched address is at "+serialSearch+"<br/>";
  let bidirectionalSearch = bidirectionalSearchTest(array);
  outputArea.innerHTML += "Bidirectional Search - done. Searched address is at "+bidirectionalSearch+"<br/>";
  let midpointBidirectionalSearch = midpointBidirectionalSearchTest(array);
  outputArea.innerHTML += "Midpoint Bidirectional Search - done. Searched address is at "+midpointBidirectionalSearch+"<br/>";
  let jumpSearch = jumpSearchTest(array);
  outputArea.innerHTML += "Jump Search - done. Searched address is at "+jumpSearch+"<br/>";
  outputArea.innerHTML += "Testing completed. You may now stop the Google Chrome Profiler and review the results.";
}
