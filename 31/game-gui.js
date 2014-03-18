// Game elements:
var game31, machinePlayer;

// GUI Elements:
var cards;

function resetGame() {
	var firstPlayer = Math.random() < 0.5 ? "machine" : "human";
	console.log(firstPlayer + " plays first.");
	game31 = new Game31(31, firstPlayer);
	machinePlayer = new MachinePlayer(game31);
	resetGUI();
	updateGame();
}

function resetGUI() {
	var cardsDiv = document.getElementById("cards");
	cardsDiv.innerHTML = "";
	cards = createMultidimensionalArray([game31.numCards, game31.numSuits], -1);
	for (var suit = 0; suit < game31.numSuits; ++suit) {
		for (var number = 0; number < game31.numCards; ++number)
			cardsDiv.appendChild(cards[number][suit] = newCard(suit, number));
		cardsDiv.appendChild(document.createElement("br"));
	}
}

function chooseAtRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function updateGame() {
	updateScore();
	if (!game31.ended() && game31.currentPlayer == "machine") {
		var nextCard = machinePlayer.decideCard(); // machine just chooses the number
		var suitsAvailable = [];
		for (var suit = 0; suit < game31.numSuits; ++suit)
			if (!cards[nextCard][suit].played)
				suitsAvailable.push(suit);
		cards[nextCard][chooseAtRandom(suitsAvailable)].onclick("machine");
	}
}

function updateScore() {
	count.innerHTML = "Count: " + game31.count;
	if (game31.ended())
		count.innerHTML += " " + game31.winner + " wins!";
}

function cardName() {
	var num = (this.number == 1) ? "A" : this.number + 1;
	return num + " " + "♣♦♥♠"[this.suit];
}


function cardClicked(player) {
	player = player.clientX ? "human" : "machine";
	if (!this.played && !game31.ended() && player == game31.currentPlayer) {
		console.log(player + " clicked on " + this.cardName());
		this.style.opacity = 0.3;
		this.played = true;
		game31.chooseCard(player, this.number+1);
		updateGame();
	}
}

function newCard(cardSuit, cardNumber) {
	var card = document.createElement("div");
	card.className = "card";
	card.innerHTML = "&nbsp;";
	card.suit = cardSuit;
	card.number = cardNumber;
	card.played = false;
	card.style.backgroundPosition = "-" + parseInt(64.25 * cardNumber)
	                                    + "px -" + 100 * cardSuit + "px";
	card.onclick = cardClicked;
	card.cardName = cardName;
	return card;
}

