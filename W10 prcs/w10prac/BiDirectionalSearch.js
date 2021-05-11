/* Write your function for implementing the Bi-directional Search algorithm here */
/*
* Test1: 6.6ms
* Test2: 6.2ms
* Test3: 9.7ms
* Test4:  6.6ms
* Test5: 12.5ms
* Test6: 4.5ms

*Average time: 7.68ms
*/
function bidirectionalSearchTest(array)
{
    let counter = 0;
    let endArrayIndex = ARRAY_SIZE - 1;
    let currentIndex = 0;
    while (counter <= (ARRAY_SIZE / 2) - 1)
    {
        currentIndex = endArrayIndex - counter; 
        if (array[currentIndex].result == true)
           return array[currentIndex].address;
        currentIndex = counter;
        if (array[currentIndex].result == true)
            return array[currentIndex].address;
        counter++;
    }
    return null;
}