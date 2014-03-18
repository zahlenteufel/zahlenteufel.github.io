function MachinePlayer(game) {
	this.game = game;
	this.decideCard = machineDecideCard;
	this.isWinnerPosition = machineIsWinnerPosition;
	this.cachePositionType = cachePositionType;
	this.cachedPositionType = cachedPositionType;
	this.positionType = createMultidimensionalArray([5,5,5,5,5], -1);
}

function machineDecideCard() {
	var possibleMoves = [];
	var winnerMoves = [];
	for (var i = 0; i < 6; ++i) {
		if (this.game.cardsLeft[i] > 0) {
			possibleMoves.push(i)
			if (!this.isWinnerPosition(substractOneInIndex(this.game.cardsLeft, i)))
				winnerMoves.push(i);
		}
	}
	if (winnerMoves.length > 0)
		return chooseAtRandom(winnerMoves);

	console.log("there are no winner moves, choosing any one available");
	if (possibleMoves.length > 0)
		return chooseAtRandom(possibleMoves);
}

function cachePositionType(cardsLeft, type) {
	return this.positionType[cardsLeft[0]][cardsLeft[1]][cardsLeft[2]][cardsLeft[3]][cardsLeft[4]] = type;
}

function cachedPositionType(cardsLeft) {
	return this.positionType[cardsLeft[0]][cardsLeft[1]][cardsLeft[2]][cardsLeft[3]][cardsLeft[4]];
}

function machineIsWinnerPosition(cardsLeft) {
	if (this.cachedPositionType(cardsLeft) != -1)
	 	return this.cachedPositionType(cardsLeft);

	if (sumCards(cardsLeft, this.game.numSuits) > this.game.maxCount)	
	 	return this.cachePositionType(cardsLeft, true);

	for (var i = 0; i < 6; ++i)
		if (cardsLeft[i] > 0 && !this.isWinnerPosition(substractOneInIndex(cardsLeft, i)))
			return this.cachePositionType(cardsLeft, true);

	return this.cachePositionType(cardsLeft, false);
}

function sumCards(cardsLeft, numSuits) { 
	var total = 0;
	for (var i = 0; i < cardsLeft.length; ++i)
		total += (numSuits - cardsLeft[i]) * (i + 1);
	return total;
}

function getAvailableCards(cardsLeft) {
	var a = [];
	for (var i = 0; i < cardsLeft.length; ++i)
		if (cardsLeft[i] > 0)
			a.push(i);
	return a;
}

function substractOneInIndex(array, position) {
	var modifiedArray = array.slice(0);
	modifiedArray[position]--;
	return modifiedArray;
}
