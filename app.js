const fs = require("fs");

// Parse input.txt to an array of arrays
let content = fs.readFileSync("input.txt", "utf-8").split("\n");
content.forEach(function(line, index) {
  content[index] = line.split(" ");
});

// define cards and styles
const cardsLow = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K"
];
const cardsHigh = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A"
];

// card sets for testing purposes
const straightFlush = ["2H", "5H", "AH", "3H", "4H"];
const quads = ["QC", "QD", "QS", "QH", "KH"];

// Calculate best possible hand
function bestPossibleHand(array) {
  const hand = array.slice(0, 5);
  const deck = array.slice(5, 10);
  let possibleHands = arrayCombination(hand);

  possibleHands.forEach((possibleHand, index) => {
    const tempHand = possibleHand;
    const tempDeck = deck.slice(0, 5 - possibleHand.length);
    tempDeck.forEach(item => {
      tempHand.push(item);
    });
    if (checkFlush(tempHand) && checkStraight(tempHand)) {
      possibleHands[index] = 20;
    } else if (checkFlush(tempHand)) {
      possibleHands[index] = 12.5;
    } else if (checkStraight(tempHand)) {
      possibleHands[index] = 11.5;
    } else {
      possibleHands[index] = checkHand(tempHand).reduce(
        (sum, accumulator) => sum + accumulator
      );
    }
  });
  const handScore = Math.max.apply(null, possibleHands);

  switch (handScore) {
    case 5:
      return { bestPossibleHand: "highest-card", hand: hand, deck: deck };
    case 7:
      return { bestPossibleHand: "one-pair", hand: hand, deck: deck };
    case 9:
      return { bestPossibleHand: "two-pairs", hand: hand, deck: deck };
    case 11:
      return { bestPossibleHand: "three-of-a-kind", hand: hand, deck: deck };
    case 11.5:
      return { bestPossibleHand: "straight", hand: hand, deck: deck };
    case 12.5:
      return { bestPossibleHand: "flush", hand: hand, deck: deck };
    case 13:
      return { bestPossibleHand: "full-house", hand: hand, deck: deck };
    case 17:
      return { bestPossibleHand: "four-of-a-kind", hand: hand, deck: deck };
    case 20:
      return { bestPossibleHand: "straight-flush", hand: hand, deck: deck };
  }
}

//Check if an array has consecutive items
function isConsecutive(array) {
  let returnArray = [];
  let result = true;
  array
    .sort((a, b) => a > b)
    .forEach((value, index) => {
      if (array[index + 1]) {
        returnArray[index] = array[index + 1] - value === 1;
      } else {
        returnArray[index] = value - array[index - 1] === 1;
      }
      if (returnArray[index] === false) {
        result = false;
      }
    });
  return result;
}

//Check if an array of cards makes a flush
function checkFlush(array) {
  return array.every((val, i, array) => val[1] === array[0][1]);
}

//Check if an array of cards makes a straight
function checkStraight(array) {
  let handLow = [];
  let handHigh = [];
  let result;
  array.forEach(function(card, index) {
    handHigh[index] = cardsHigh.indexOf(card[0]);
    handLow[index] = cardsLow.indexOf(card[0]);
  });

  return isConsecutive(handHigh) || isConsecutive(handLow);
}

//Checks hand and returns hand structure/# of repeating cards
function checkHand(array) {
  let hand = [];
  array.forEach((value, index) => {
    let counter = 0;
    array.forEach(newValue => {
      if (value[0] === newValue[0]) {
        counter++;
      }
    });
    hand[index] = counter;
  });
  return hand.sort((a, b) => a < b);
}

//returns all combinations of the array items
function arrayCombination(arr) {
  let i, j, temp;
  let result = [];
  let arrLen = arr.length;
  let power = Math.pow;
  let combinations = power(2, arrLen);

  // Time & Space Complexity O (n * 2^n)

  for (i = 0; i < combinations; i++) {
    temp = [];

    for (j = 0; j < arrLen; j++) {
      // & is bitwise AND

      if (i & power(2, j)) {
        temp.push(arr[j]);
      }
    }
    result.push(temp);
  }
  return result;
}

content.forEach(line => {
  let result = bestPossibleHand(line);
  console.log(
    "Hand: " +
      result.hand +
      " Deck: " +
      result.deck +
      " Best hand: " +
      result.bestPossibleHand
  );
  // console.log(result)
});
