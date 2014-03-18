function Game31(maxCount, currentPlayer) {
	this.numSuits = 4;
	this.numCards = 5;
	this.maxCount = maxCount;
	this.count = 0;
	this.currentPlayer = currentPlayer;

	this.cardsLeft = createMultidimensionalArray([5], 4);

	this.ended = gameEnded;
	this.chooseCard = gameChooseCard;
}

function gameEnded() {
	return this.count > this.maxCount; 
}

function gameChooseCard(who, number) {
	if (!this.ended()) {
		if (this.cardsLeft[number - 1] == 0) {
			console.log("there is no more cards of that number.");
		} else {
			this.count += number;
			this.cardsLeft[number - 1]--;
			this.currentPlayer = this.currentPlayer == "human" ? "machine" : "human";
			if (this.ended()) {
				this.winner = this.currentPlayer;
				console.log("game ended, winner: " + this.winner);
			}
		}
	}
}

function createMultidimensionalArray(dimensions, defaultValue) {
	var d = dimensions[0];
	var mda = new Array(d);
	if (dimensions.length == 1)
		for (var i = 0; i < d; ++i)
			mda[i] = defaultValue;
	else
		for (var i = 0; i < d; ++i)
			mda[i] = createMultidimensionalArray(dimensions.slice(1), defaultValue);
	return mda;
}