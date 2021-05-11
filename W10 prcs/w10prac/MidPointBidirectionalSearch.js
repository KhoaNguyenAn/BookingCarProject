/* Write your function for implementing the Midpoint Bi-directional Search algorithm here */
/*
* Test1: 11.3ms
* Test2: 12.3 ms
* Test3: 8.9ms
* Test4: 11.3ms
* Test5: 4.5 ms
* Test6: 12.9ms

*Average time: 10.2ms
*/

function midpointBidirectionalSearchTest(array)
{
    let counter = 0;
    let middlePoint = (ARRAY_SIZE / 2) - 1;
    let currentIndex = 0;
    while (counter <= (ARRAY_SIZE / 2) - 1)
    {
        currentIndex = middlePoint - counter; 
        if (array[currentIndex].result == true)
           return array[currentIndex].address;
        currentIndex = middlePoint + counter;
        if (array[currentIndex].result == true)
            return array[currentIndex].address;
        counter++;
    }
    return null;
}