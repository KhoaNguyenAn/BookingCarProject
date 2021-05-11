/* Write your function for implementing the Jump Search algorithm here */

/*
* Test1: 6.6ms
* Test2: 9.5ms
* Test3: 9.3ms
* Test4: 3.0ms
* Test5: 11.7ms
* Test6: 12.2ms

*Average time: 8.72ms
*/
function jumpSearchTest(array)
{
    let startPoint = 0;
    let currentIndex = 0;
    const BLOCK_SIZE = Math.floor(Math.random()*(ARRAY_SIZE - 1));
    while (startPoint != ARRAY_SIZE - 1)
    {
        if (array[startPoint].result == true)
           return array[startPoint].address;
        currentIndex = startPoint + BLOCK_SIZE;
        if (currentIndex <= ARRAY_SIZE - 1 && array[currentIndex].result == true) 
            return array[currentIndex].address;
        while (currentIndex + BLOCK_SIZE <= ARRAY_SIZE - 1)
        {
            currentIndex += BLOCK_SIZE;
            if (array[currentIndex].result == true) 
                return array[currentIndex].address;
        }
        startPoint++;
    }
    return null;
}