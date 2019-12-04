var utility = require("./utility");

var dempster = {};
var fod = new Set(['malaria','dengue','chik']);

// Iterate through the arguments and return a focal table(array of map)
dempster.focalTable = function(focalTable, argummentsArray) {
    console.log('focal table method');
    for (let i=0; i<argummentsArray.length; i++) {
      const k = GetNormalizingFactor(focalTable, argummentsArray[i]);
      focalTable = GetFocalElemetsList(focalTable, argummentsArray[i], k);
    focalTable = GetUniqueFocalElementsList(focalTable);
  }
  return focalTable;
  }

  // Calculate the belief of the input focal table 
dempster.beliefCalculator= function (MapArray){
    var focalMap = new Map();
    //var beliefMapArray = new Array();

    MapArray.forEach((item) => {
            const focalElement = item.keys().next().value;
            var uniqueSubSets = utility.powerSet(focalElement);
            let beliefValue = 0;
            uniqueSubSets.forEach((subSetItem) => {
                const value = findInMap(MapArray, subSetItem)
                if (value !== undefined) {
                  beliefValue = (parseFloat)(beliefValue.toFixed(3)) + (parseFloat)(value.toFixed(3));
                }
            })
            //console.log('The focal Element is '+focalElement.keys().next().value+' and the BelValue is '+beliefValue);
            focalMap.set(focalElement, beliefValue);
      })
        return focalMap;   
  }

  // Find the set(key of the map array) in the existing maparray
  function findInMap(MapArray, subSetItem) {
    for (let i=0;i<MapArray.length;i++) {
      const key =MapArray[i].keys().next().value;
      if (utility.isSetEqual(key, subSetItem)) {
        const value = MapArray[i].get(key);
        return value;
    }
  }
}

// return the normalizing factor(floating point) value in case of conflict 
function GetNormalizingFactor(existingFocalElementList, newEvidence) {
    var normalizingFactor=0;
      for(let i=0;i<existingFocalElementList.length;i++){
            var tempNormalizer = conflict(existingFocalElementList[i],newEvidence);
            normalizingFactor += tempNormalizer;
            var newFodEvidence = new Map();
            newFodEvidence.set(fod, 1 - newEvidence.get(newEvidence.keys().next().value));
            var tempNormalizer1 = conflict(existingFocalElementList[i],newFodEvidence);
            normalizingFactor += tempNormalizer1;
      }
      return normalizingFactor;
  }



// Return an array of unique focal Elements in the current iteration.
  // Also it adds up repeated elements of value
function GetUniqueFocalElementsList(focalTable) {
  var newFocalTable = [];
  var distinctElements = [];
  for (var i = 0; i < focalTable.length; i++) {
      var temp = 0;
      var tempKkey = new Set();
      var isDistinct = true;
      for (var test = 0; test < distinctElements.length; test++) {
        if (utility.isSetEqual( distinctElements[test],focalTable[i].keys().next().value))
        { 
          isDistinct = false
          break;
        }
      }
      if(isDistinct === false) {
        continue;
      }
    distinctElements.push(focalTable[i].keys().next().value);
      for (var k = i; k < focalTable.length; k++) {
          const key = focalTable[k].keys().next().value;
//          console.log(key)
          if (utility.isSetEqual(focalTable[i].keys().next().value,key)) {
              temp += focalTable[k].get(key);
              focalTable[k].keys().next().value = 0;
              tempKkey = key;
          }

      }
      if (temp !== 0) {
          let tempMap = new Map();
          tempMap.set(tempKkey, temp);
          newFocalTable.push(tempMap);
      }
  }
  return newFocalTable;
}



// Create a table of Focal Element MapArray, to be used in next iterations
function GetFocalElemetsList(existingFocalElementList, newEvidence, normalizingFactor) {
    const key = newEvidence.keys().next().value;
    const value = newEvidence.get(key)
    const x0 = new Map();
    x0.set(key, value);  
    const x1 = new Map();  
    x1.set(fod, 1 - value);    
    if (existingFocalElementList.length === 0 ) {
        existingFocalElementList.push(x0);
        existingFocalElementList.push(x1);
        return existingFocalElementList
    }
    else {
        let newFocalElementList = new Array();
        // Dempster Rule of Combination
        for (var i=0; i<existingFocalElementList.length; i++) {
            let newElement0 = new Map();
            let existingKey0 = existingFocalElementList[i].keys().next().value;
            let newKey0 = utility.intersect(key, existingKey0);
            if (newKey0.size !== 0){
                let val1 = (value*(existingFocalElementList[i].get(existingKey0)))/(1.00 - normalizingFactor);
                let newValue = (parseFloat)(val1.toFixed(3));
                newElement0.set(newKey0, newValue);
                newFocalElementList.push(newElement0);
            }

            let newElement1 = new Map();
            let existingKey1 = existingFocalElementList[i].keys().next().value;
            let newKey1 = utility.intersect(fod, existingKey1);
            if (newKey1.size !== 0){
                let val2 = ((1-value)*(existingFocalElementList[i].get(existingKey1)))/(1.00 - normalizingFactor);
                let newValue = (parseFloat)(val2.toFixed(3));
                newElement1.set(newKey1, newValue);
                newFocalElementList.push(newElement1);
            }
        }
        return newFocalElementList;
    }
  }

  function conflict(m1,m2) {
    var tempNormalizer = 0;
    
    //pick the key from the map
    key1 = m1.keys().next().value;
    key2 = m2.keys().next().value;
    
    var focal = utility.intersect(key1,key2);

    if(focal.size ===0) {
      //console.log('conflict exist.. calculating K value for normalizing');
        var val1= m1.get(key1);
        var val2= m2.get(key2);
        tempNormalizer = val1*val2;
      return tempNormalizer;
    } else if(focal.size >0){
        //console.log('no conflict');
        return tempNormalizer;
        }
      }


  dempster.createPlausabiltyTable = function(beliefMap,focalMapArray){
        //console.log(beliefMapArray);
      var plausibleMap = new Map();
      for (let key of beliefMap.keys()){
          var complimentKey = utility.difference(fod,key);// set output
          var allSubSets= utility.powerSet(complimentKey);
          let plausabilityValue = 1;
          let beliefValue=0;
          allSubSets.forEach((subSetItem) => {
              const value = findInMap(focalMapArray,subSetItem)
              if(value !== undefined){
                beliefValue = (parseFloat)(beliefValue.toFixed(4)) + (parseFloat)(value.toFixed(4));
                plausabilityValue = 1- beliefValue;
              }
          })
          plausibleMap.set(key,plausabilityValue);
    }
    return plausibleMap;
}

// Calculate the mean probaility of all the candidates
dempster.meanProbabiltyMap = function(beliefMap, plausibleMap){
  var confidenceIntervalMap = new Map();
  var probList = new Map();

  for(let k of beliefMap.keys()){
    const lowerProb = beliefMap.get(k);
    const upperProb = plausibleMap.get(k); 
    //const actualProb= (parseFloat)(((lowerProb+upperProb)/2).toFixed(3));
    actualProb = (lowerProb+upperProb)/2;
    probList.set(k,actualProb);
  }
  return probList;
}

//Get Confidence interval of the selected candidate
dempster.getConfidenceInterval = function(beliefMap,plausibleMap,decisionSet){
  var confidenceIntervalMap = new Map();
  const lowerProb = beliefMap.get(decisionSet);
  const upperProb = plausibleMap.get(decisionSet); 
  const tempInterval = upperProb - lowerProb;
  const interval = (parseFloat)((Math.abs(tempInterval)).toFixed(4));
  confidenceIntervalMap.set(decisionSet,interval);
return confidenceIntervalMap;
}

//Select the candidate based on the mean probablity map
// if any two candidates have same mean then select the candidate with the maximum belief.
dempster.finalDecision = function(probList,beliefMap){
  var max=0;  
  var decision;
for(let candidate of probList.keys()){
  if(candidate.size ===1){
      var val= probList.get(candidate);
      if(val>max){
        max = val;
        decision= candidate;
      }// In case when meanProbablity of two candidates in same 
       // Maxi-min Strategy by picking Highest Probabilty of belief Function
      else if(val===max && max!== 0){
        max =0;
        for(let key of beliefMap.keys()){
          if(key.size===1){
            var val1= beliefMap.get(key);
            if(val1>max){
              max = val;
              decision = key;
            }
          }
        }
        return decision;
      }
    }
  }
  return decision;
}



module.exports = dempster;