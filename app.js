const fs = require('fs')

// Parse input.txt to an array of arrays
var content = fs.readFileSync('input.txt', 'utf-8').split("\n")
content.forEach( function(line, index) {content[index] = line.split(" ")} )

// define cards and styles
const cardsLow = ["A","2","3","4","5","6","7","8","9","T","J","Q","K"]
const cardsHigh = ["2","3","4","5","6","7","8","9","T","J","Q","K", "A"]

let straightFlush = ["2H", "5H", "AH", "3H", "4H"]
let quads = [ 'QC', 'QD', 'QS', 'QH', 'KH' ]

// Calculate best possible hand
function bestHand(array) {
  let hand = array.slice(0,5)
//   console.log("hand: "+hand)
  let deck = array.slice(5,10)
//   console.log("deck: "+deck)
  let possibleHands = combination(hand)
  possibleHands.forEach((possibleHand, index) => {
    let a = possibleHand
    let b = deck.slice(0,5-possibleHand.length)
    // console.log("a: "+a+"; b: "+b)
    b.forEach(item => {a.push(item)})
    if (checkFlush(a) && checkStraight(a)) {
        possibleHands[index] = 20
    } else if (checkFlush(a)) {
        possibleHands[index] = 12.5
    } else if (checkStraight(a)) {
        possibleHands[index] = 11.5
    } else {
        possibleHands[index] = checkHand(a).reduce((sum, accumulator) => sum+accumulator)
    }
  })
  let handScore =  Math.max.apply(null, possibleHands)
//   return handScore
  switch(handScore) {
    case 5:
        return {bestHand:"highest-card", hand:hand, deck:deck}
    case 7:
        return {bestHand: "one-pair", hand:hand, deck:deck}
    case 9:
        return {bestHand:"two-pairs", hand:hand, deck:deck}
    case 11:
        return {bestHand: "three-of-a-kind", hand:hand, deck:deck}
    case 11.5:
        return { bestHand: "straight", hand:hand, deck:deck}
    case 12.5:
        return {bestHand: "flush", hand:hand, deck:deck}
    case 13:
        return {bestHand: "full-house", hand:hand, deck:deck}
    case 17:
        return {bestHand: "four-of-a-kind", hand:hand, deck:deck}
    case 20:
        return {bestHand: "straight-flush", hand:hand, deck:deck}
  }
}

//Write output file
function output (array) {
    let output
    return output
}

//Check if an array has consecutive items
function isConsecutive(array) {   
    array = array.sort((a,b)=>a>b)
    let returnArray = []
    let result = true
    array.forEach((value, index) => {
        if(array[index+1]){
            returnArray[index] = array[index+1]-value ===1
        }
        else {
            returnArray[index] = value-array[index-1] === 1
        }
        if(returnArray[index] === false){result =  false} 
    })
    return result
}

//Check if an array of cards makes a flush
function checkFlush(array) {
    return array.every( (val, i, array) => val[1] === array[0][1])
}

//Check if an array of cards makes a straight
function checkStraight(array) {
    let handLow = []
    let handHigh = []
    let result
    array.forEach(function(card, index) {
        handHigh[index] = cardsHigh.indexOf(card[0])
        handLow[index] = cardsLow.indexOf(card[0])
    })
    
    return isConsecutive(handHigh) || isConsecutive(handLow)
}

//Checks hand and returns hand structure/# of repeating cards
function checkHand(array) {
    let hand = []
    array.forEach((value, index) => {
        let counter = 0
        array.forEach(newValue => {
            if(value[0] === newValue[0]){
                counter++
            }
        })
        hand[index] = counter
    })
    return hand.sort((a,b)=>a<b)
}

//returns all combinations of the array items
function combination (arr) {

    let i, j, temp
    let result = []
    let arrLen = arr.length
    let power = Math.pow
    let combinations = power(2, arrLen)
    
    // Time & Space Complexity O (n * 2^n)
    
    for (i = 0; i < combinations;  i++) {
      temp = []
      
      for (j = 0; j < arrLen; j++) {
        // & is bitwise AND
        if ((i & power(2, j))) {
          temp.push(arr[j]) 
        }
      }
      result.push(temp)
    }
    return result
  }


content.forEach(line => {
    let result = bestHand(line)
    console.log("Hand: "+result.hand+" Deck: "+result.deck+" Best hand: "+result.bestHand)
    // console.log(result)
})
  

