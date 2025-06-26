/**
 * 1. 
 */
function countUnique(arr) {
    return new Set(arr).size;
}

console.log(countUnique([1,2,2,3,3,3])); 
console.log(countUnique([4,4,4,4,4,4]));

/**
 * 2.
 */
function capitalizeWords(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

console.log(capitalizeWords("salom dunyo")); 
console.log(capitalizeWords("men dasturchiman")); 

/**
 * 3. 
 */
function isPalindrome(str) {
    const reversed = str.split('').reverse().join('');
    return str === reversed;
}
console.log(isPalindrome("level")); 
console.log(isPalindrome("hello")); 