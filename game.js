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
	
    let a = randInt(1, 20);
	let b = randInt(1, 20);
	const op = randOperator();

	if (op === '/') {
		b = randInt(1,20);
		a = b * randInt(1,10);
    };

    const correct = eval(`${a} ${op} ${b}`);

	let initialOptions = [correct];
	while(initialOptions.length < 4){
		let fake = correct + randInt(-3,3);
		if (fake !== correct && !initialOptions.includes(fake)){
            initialOptions.push(fake);
        };
	};

	const options = initialOptions.sort(() => Math.random() - 0.5);
	return {text: `${a} ${op} ${b} = ?`, correct, options};
};


const handleAnswer = (answer) => {
	
    if (answer === state.currentQuestion.correct){
		state = {score: state.score + 1, currentQuestion: generateQuestion(), timeLeft: 10};
	} else {
		state = {score: 0, currentQuestion: generateQuestion(), timeLeft: 10};
	}
	renderQuestion();
};


const tick = () => {
	
    if(state.timeLeft <= 1){
		state = {score: 0, currentQuestion: generateQuestion(), timeLeft: 10};
	} else {
		state = {...state, timeLeft: state.timeLeft - 1};
	}
	renderQuestion();
};


const renderQuestion = () => {
	
    if(!state.currentQuestion){
        return;
    };
	
    questionDiv.textContent = state.currentQuestion.text;
	timerEl.textContent = state.timeLeft;
	scoreEl.textContent = state.score;
	answersDiv.innerHTML = '';

	state.currentQuestion.options.forEach(opt => {
		const btn = document.createElement('button');
		btn.textContent = opt;
		btn.onclick = () => handleAnswer(opt);
		answersDiv.appendChild(btn);
	});
};


state = {...state, currentQuestion: generateQuestion()};
renderQuestion();

setInterval(tick, 1000);