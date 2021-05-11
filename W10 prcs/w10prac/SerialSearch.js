/* Write your function for implementing the Serial Search Algorithm here */
/*
* Test1: 14.9ms
* Test2: 15.5ms
* Test3: 6.6 ms
* Test4: 14.6ms
* Test5: 8.7 ms
* Test6: 16.6 ms

*Average time: 12.82 ms
*/

function serialSearchTest(array)
{
    for (let currentIndex = 0; currentIndex < ARRAY_SIZE; currentIndex++)
    {
        if (array[currentIndex].result == true) 
          return array[currentIndex].address;
    }
    return null;
}




