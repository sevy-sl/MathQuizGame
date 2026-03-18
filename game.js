const questionDiv = document.getElementById('question');
const answersDiv = document.getElementById('answers');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');


let state = {
	score: 0,
	currentQuestion: null,
	timeLeft: 10
};


const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randOperator = () => ['+', '-', '*', '/'][randInt(0,3)];


const generateQuestion = () => {
	let a = randInt(1, 10);
	let b = randInt(1, 20);
	const op = randOperator();

	if (op === '/') {
		a = b * randInt(1,10);
	};

	const correct = eval(`${a} ${op} ${b}`);

	let initialOptions = [correct];
	while(initialOptions.length < 4){
		let fake = correct + randInt(-3,3);
		if (fake != correct && !initialOptions.includes(fake)){
			initialOptions.push(fake);
		}
	}

	const options = initialOptions.sort(() => Math.random() - 0.5);
	return {text: `${a} ${op} ${b} = ?`, correct, options};
};


const nextStateOnCorrect = (state) => ({
	score: state.score + 1,
	currentQuestion: generateQuestion(),
	timeLeft: 10
});


const nextStateOnWrong = () => ({
	score: 0,
	currentQuestion: generateQuestion(),
	timeLeft: 10
});


const nextStateOnTick = (state) => {
	if (state.timeLeft <= 1) {
		return nextStateOnWrong();
	}
	return {...state, timeLeft: state.timeLeft - 1};
};


const handleAnswer = (state, answer) => {
    if (answer === state.currentQuestion.correct){
        return nextStateOnCorrect(state);
    } else {
        return nextStateOnWrong();  
    };
};


const tick = (state) => nextStateOnTick(state);


const update = (newState) => {
	state = newState;
	renderQuestion(state);
};


const onAnswer = (answer) => {
	update(handleAnswer(state, answer));
};


const renderQuestion = (state) => {
    if (!state.currentQuestion) return;    
    
	questionDiv.textContent = state.currentQuestion.text;
	timerEl.textContent = state.timeLeft;
	scoreEl.textContent = state.score;
	answersDiv.innerHTML = '';

	state.currentQuestion.options.forEach(opt => {
		const btn = document.createElement('button');
		btn.textContent = opt;
		btn.onclick = () => onAnswer(opt);
		answersDiv.appendChild(btn);
	});
};


state = {...state, currentQuestion: generateQuestion()};
renderQuestion(state);

setInterval(() => {
	update(tick(state));
}, 1000);