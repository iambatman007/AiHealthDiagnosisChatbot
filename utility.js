

var utility={};

utility.powerSet = function (inputSet) {
  
  //convert a set into array
  var arr = Array.from(inputSet);
  
  // the final power set
  var powers = [];
  
  // the total number of sets that the power set will contain
  var total = Math.pow(2, arr.length);
  
  // loop through each value from 0 to 2^n
  for (var i = 0; i < total; i++) {
  
    // our set that we add to the power set
    var tempSet = new Set();
  
    // convert the integer to binary
    var num = i.toString(2);
    
    // pad the binary number so 1 becomes 001 for example
    while (num.length < arr.length) { num = '0' + num; }
    
    // build the set that matches the 1's in the binary number
    for (var b = 0; b < num.length; b++) {
      if (num[b] === '1') { tempSet.add(arr[b]); }    
    }
    
    // add this set to the final power set
    if (tempSet.size !== 0 ) {
        powers.push(tempSet);
    }
    
  }
  
  return powers;
  
}

utility.isSetEqual = function(setX, setY) {
  if (setX.size !== setY.size) return false;
  for (var val of setX) if (!setY.has(val)) return false;
  return true;
}

utility.intersect= function(setX,setY){
     var intersection = new Set();
    for (var val of setY){
      if(setX.has(val)){
        intersection.add(val);
      }
    }
    return intersection;
}

utility.union = function(setX, setY) {
    var _union = new Set(setX);
    for (var elements of setY) {
        _union.add(elements);
    }
    return _union;
}

/**
 * @param set, setX and setY
 * @returns setX - setY
 */
utility.difference = function(setX, setY) {
    var _difference = new Set(setX);
    for (var element of setY) {
        _difference.delete(element);
    }
    return _difference;
}

module.exports = utility;
