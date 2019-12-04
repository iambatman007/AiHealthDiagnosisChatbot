var dempster = require("./dst-functions");

var infer = {};
var fever;

let focalTable= new Array();
var tempLevel;
var defaultResponse = {
    paraMild:'I think your situation is a little mild, just take a paracetamol. If it still persist then please consult a doctor',
    doctor: 'Hmmm.. I think you should consult a doctor for further examination',
    paraModerate:'I think your situation is a little moderate, just take a paracetamol. If it still persist then please consult a doctor',
    normal:'I think your temperature is normal and you have nothing to worry about. Have a nice day :)',
    emergency: 'It is an emergency situation, Please call NHS helpline 111 urgently',
    askSymptoms:'askSymptoms',
    noSymptoms:'noSymptoms'
  }

/**
 * @param A list of symptoms
 */
infer.arguments = function(symptoms, phase){
    console.log('symptoms');
    console.log(symptoms);
     var argumentArray = [];

    //if there are no symptoms in the list
    if (symptoms.length===0 && phase=== 'high'){
        return defaultResponse.noSymptoms;
    }

    if(symptoms.includes('rash')){
        var set1 = new Set(['chik']);
        var mapRash = new Map();
        mapRash.set(set1,0.17);
        argumentArray.push(mapRash);
    }
    
    if(symptoms.includes('cough')){
        var set2 = new Set(['dengue','malaria']);// not chik
        var mapCough = new Map();
        mapCough.set(set2,0.101);
        argumentArray.push(mapCough);
    }

    
    if(symptoms.includes('headache')){
        var set3 = new Set(['dengue','chik']);// not malaria
        var mapHeadache = new Map();
        mapHeadache.set(set3,0.753);
        argumentArray.push(mapHeadache);
    }
  
    if(symptoms.includes('nauseaVomit')){
        var set4 = new Set(['dengue','malaria']);//not chik
        var mapNausea = new Map();
        mapNausea.set(set4,0.3);
        argumentArray.push(mapNausea);
    }
   

    if(symptoms.includes('jointPain')){
        var set5 = new Set(['chik']);
        var mapJoint = new Map();
        mapJoint.set(set5,0.65);
        argumentArray.push(mapJoint);
        
    }

    if(symptoms.includes('musclePain')){
        var set6 = new Set(['dengue']); 
        var mapMuscle = new Map();
        mapMuscle.set(set6,0.441);
        argumentArray.push(mapMuscle);
        
    }
   

    if(symptoms.includes('diarrhea')){
        var set7 = new Set(['malaria']);
        var mapDiarrhea = new Map();
        mapDiarrhea.set(set7,0.083);
        argumentArray.push(mapDiarrhea);
        
    }

    if(symptoms.includes('abdominalPain')){
        var set8 = new Set(['dengue','malaria']); // not chik
        var mapAbdominal = new Map();
        mapAbdominal.set(set8,0.2);
        argumentArray.push(mapAbdominal);
        
    }
    if(symptoms.includes('appetiteLoss')){
        var set9 = new Set(['dengue']);
        var mapAppetite = new Map();
        mapAppetite.set(set9,0.123);
        argumentArray.push(mapAppetite);
        
    }

    if(symptoms.includes('painEyes')){
        var set10 = new Set(['dengue']);
        var mapPainEyes = new Map();
        mapPainEyes.set(set10,0.058);
        argumentArray.push(mapPainEyes);
    }

    if( symptoms.includes('metallicTaste')){
        var set11 = new Set(['dengue']);
        var mapMetallic = new Map();
        mapMetallic.set(set11,0.155);
        argumentArray.push(mapMetallic);
    }

    if( symptoms.includes('chillSweat')){
        var set12 = new Set(['malaria']);
        var mapChillSweat = new Map();
        mapChillSweat.set(set12,0.45);
        argumentArray.push(mapChillSweat);
    }
    
    
    focalTable = dempster.focalTable(focalTable, argumentArray);
    console.log('Focal Elements Table');
    console.log(focalTable);

    var beliefMap = dempster.beliefCalculator(focalTable);
    console.log('Belief, Bel(A)');
    console.log(beliefMap);

    var plausibleMap = dempster.createPlausabiltyTable(beliefMap,focalTable);
    console.log('Plausiblility, Pl(A)');
    console.log(plausibleMap);

    var probList = dempster.meanProbabiltyMap(beliefMap,plausibleMap);
    console.log('Mean Probability');
    console.log(probList);

    var decisionSet = dempster.finalDecision(probList,beliefMap);
    console.log('decision');
    console.log(decisionSet);

    var confidenceIntervalMap = dempster.getConfidenceInterval(beliefMap,plausibleMap,decisionSet);
    console.log('Confidence Interval');
    console.log(confidenceIntervalMap);

    return confidenceIntervalMap;
}

/**
 * 
 * @param {number} temp Body Temperature of the patient
 * @author Ashish Chawla
 * This method abstract the value of temprature as mild/moderate/high/normal/cold
 */
function temperatureLevel(temp) {
    if (temp >=99.5 && temp <=100.94){
        fever='mild';
        console.log('fever: '+fever);
        return fever;

    } else if(temp >=100.95 && temp <102){
        fever='moderate';
        console.log('fever: '+fever);
        return fever;

    } else if(temp >=102 && temp<=104){
        fever='high';
        console.log('fever: '+fever);
        return fever;

    }else if(temp >=98.6 && temp <=99.4){
        fever='normal';
        console.log('fever: '+fever);
        return fever;

    }else if(temp>104){
        fever='dangerous';
        console.log('fever: '+fever);
        return fever;

    }else{
        fever='cold';
        console.log('fever: '+fever);
        return fever;
    }

}
/**
 * @param {number} temp Body Temperature of the patient
 * @author Ashish Chawla
 * @return This method returns default response code based on body temprature and days count
 */
infer.check = function(bodyTemp,dayCount){
    tempLevel = temperatureLevel(bodyTemp);


     if(tempLevel === 'mild' && dayCount < 5){
        return defaultResponse.paraMild;

     } else if(tempLevel === 'mild' && dayCount >= 5){
         return defaultResponse.doctor;

     } else if (tempLevel === 'moderate' && dayCount < 5){
        return defaultResponse.paraModerate;

     } else if (tempLevel === 'moderate' && dayCount >=5){
         return defaultResponse.doctor;

     } else if (tempLevel === 'high'){
         return  defaultResponse.askSymptoms;

     } else if(tempLevel ==='normal'){
         return defaultResponse.normal;

     } else if(tempLevel === 'cold'){
         return defaultResponse.doctor;

     } else if (tempLevel === 'dangerous'){
         return defaultResponse.emergency;

     }else{
         return defaultResponse.doctor;
     }
}

// Should be called only after decision is taken
infer.clearFocalTable = function(){
    focalTable.length=0;
}

module.exports = infer;