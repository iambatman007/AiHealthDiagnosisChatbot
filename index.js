// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
var infer = require('./inferenceLogic.js')
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  var threshold = 0.5;

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function fever_family(agent){
    console.log('inside fever family');

    

    var bodyTemp = agent.parameters.temperature.amount;
    var dayUnit = agent.parameters.duration.unit;
    var dayCount = agent.parameters.duration.amount;
    
    //convert week into days
    if(dayUnit ==='wk'){
      dayCount *= 7; 
    }

    var reply = infer.check(bodyTemp,dayCount);
    if(reply !== 'askSymptoms'){
      agent.add(reply);
    } else{
        agent.setFollowupEvent('high_symptoms_event');
    }    
  }
  
  function Not_well_high(agent){
    console.log('Not_well_high');
    var evidenceHigh=[];
    if(agent.parameters.headache === 'true'){
      evidenceHigh.push('headache');
    }
    
    if(agent.parameters.nauseaVomit === 'true'){
      evidenceHigh.push('nauseaVomit');
    }
    
    if(agent.parameters.jointPain === 'true'){
      evidenceHigh.push('jointPain');
    }
    
    if(agent.parameters.musclePain === 'true'){
      evidenceHigh.push('musclePain');
    }
    
    if(agent.parameters.diarrhea === 'true'){
      evidenceHigh.push('diarrhea');
    }

    var confidenceIntervalMap = infer.arguments(evidenceHigh,'high');
    console.log('high Evidence');
    console.log(evidenceHigh);
    
    //If fever is High and disease is asymptomatic
    if(confidenceIntervalMap ==='noSymptoms'){
        agent.add('I think your disease is asymptomatic and you should visit a doctor for blood test recommendations');
    } 
    else {
      let candidateCI=confidenceIntervalMap.get(confidenceIntervalMap.keys().next().value);
      
      
      // Check Against Threshold Value
      if(candidateCI > threshold){
          agent.setFollowupEvent('medium_symptoms_event')
      }else{
        let decisionSet = confidenceIntervalMap.keys().next().value;
        infer.clearFocalTable();
        for(let decision of decisionSet){
          if(decision==='chik'){
            decision='Chikungunya';
          }
          agent.add('I think you have : '+ decision);
        } 
      }
    }

  
   }

  function Not_well_medium(agent){
    var evidenceMedium=[];
    
    if(agent.parameters.abdominalPain === 'true'){
      evidenceMedium.push('abdominalPain');
    }
    
    if(agent.parameters.rash === 'true'){
      evidenceMedium.push('rash');
    }
    
    if(agent.parameters.chillSweat === 'true'){
      evidenceMedium.push('chillSweat');
    }
    
    var confidenceIntervalMap = infer.arguments(evidenceMedium,'medium');
    console.log('medium Evidence');
    console.log(evidenceMedium);

    console.log('medium symptoms confidence interval');
    console.log(confidenceIntervalMap);

    let candidateCI=confidenceIntervalMap.get(confidenceIntervalMap.keys().next().value);
    
    // Check Against Threshold Value
    if(candidateCI > threshold){
      agent.setFollowupEvent('low_symptoms_event');
  }else{
    let decisionSet = confidenceIntervalMap.keys().next().value;
    infer.clearFocalTable();
    for(let decision of decisionSet){
      if(decision==='chik'){
        decision='Chikungunya';
      }
      agent.add('Based on all your symptoms I think you have: '+decision);
    }
    
    }

  }

  function Not_well_low(agent){
    var evidenceLow=[];
    
    if(agent.parameters.appetiteLoss === 'true'){
      evidenceLow.push('appetiteLoss');
    }
    
    if(agent.parameters.cough === 'true'){
      evidenceLow.push('cough');
    }
    
    if(agent.parameters.painEyes === 'true'){
      evidenceLow.push('painEyes');
    }
    

    var confidenceIntervalMap = infer.arguments(evidenceLow, 'low');
    console.log('evidenceLow ');
    console.log(evidenceLow);

    console.log('Low symtoms confidence interval');
    console.log(confidenceIntervalMap);
    

    let decisionSet = confidenceIntervalMap.keys().next().value;
    infer.clearFocalTable();
    for(let decision of decisionSet){
      if(decision==='chik'){
        decision='Chikungunya';
      }
      agent.add('Based on what you told me I think you have :'+decision);
       }
    }


  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Not_well_high', Not_well_high);
  intentMap.set('Not_well_medium', Not_well_medium);
  intentMap.set('Not_well_low', Not_well_low);
  intentMap.set('fever_family',fever_family);

  agent.handleRequest(intentMap);
  
});