function getExplanation(card, choice, answer) {
	const explanation = card.dataset.explanation;

	if (choice === answer) {
		return explanation;
	}

	const correctOption = [...card.querySelectorAll('.option')]
		.find(option => option.dataset.choice === answer);

	return `Belum tepat. Jawaban yang benar adalah <strong>${answer}. ${correctOption.textContent.slice(3)}</strong>. ${explanation}`;
}

function initializeQuiz(quiz) {
	const quizList = quiz.querySelector('.quiz-list');
	const questionCardsInMarkup = [...quizList.querySelectorAll('.question-card')];
	const questionCards = questionCardsInMarkup.sort((firstCard, secondCard) => {
		const firstNumber = Number(firstCard.querySelector('.question-meta span').textContent.replace(/\D/g, ''));
		const secondNumber = Number(secondCard.querySelector('.question-meta span').textContent.replace(/\D/g, ''));
		return firstNumber - secondNumber;
	});

	questionCards.forEach(card => quizList.append(card));

	const answeredCountElement = quiz.querySelector('.answered-count') || quiz.querySelector('#answered-count');
	const finishButton = quiz.querySelector('.finish-quiz') || quiz.querySelector('#finish-quiz');
	const resetButton = quiz.querySelector('.reset-quiz') || quiz.querySelector('#reset-quiz');
	const resultBox = quiz.querySelector('.result-box');

	function updateAnsweredCount() {
		const answered = questionCards.filter(card => card.dataset.selected).length;
		answeredCountElement.textContent = answered;
	}

	function chooseAnswer(card, option) {
		const answer = card.dataset.answer;
		const choice = option.dataset.choice;
		const feedback = card.querySelector('.feedback');

		card.dataset.selected = choice;
		card.querySelectorAll('.option').forEach(item => item.classList.remove('selected', 'correct', 'incorrect'));
		option.classList.add('selected', choice === answer ? 'correct' : 'incorrect');

		if (choice !== answer) {
			card.querySelector(`[data-choice="${answer}"]`).classList.add('correct');
		}

		feedback.innerHTML = `<strong>${choice === answer ? 'Jawaban benar.' : 'Jawaban belum tepat.'}</strong> ${getExplanation(card, choice, answer)}`;
		feedback.classList.add('visible');
		updateAnsweredCount();
	}

	questionCards.forEach(card => {
		card.querySelectorAll('.option').forEach(option => option.addEventListener('click', () => chooseAnswer(card, option)));
	});

	finishButton.addEventListener('click', () => {
		const answered = questionCards.filter(card => card.dataset.selected).length;

		if (answered < questionCards.length) {
			resultBox.textContent = `Kamu baru menjawab ${answered} dari ${questionCards.length} soal. Jawab semua soal agar hasil akhir dapat dihitung.`;
		} else {
			const score = questionCards.filter(card => card.dataset.selected === card.dataset.answer).length;
			const message = score === questionCards.length
				? 'Sempurna! Semua konsep pada bab ini sudah kamu kuasai.'
				: 'Baca kembali penjelasan pada setiap soal untuk memperkuat pemahamanmu.';
			resultBox.innerHTML = `<strong>Nilai kamu: ${score}/${questionCards.length}</strong><br>${message}`;
		}

		resultBox.classList.add('visible');
		resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	});

	resetButton.addEventListener('click', () => {
		questionCards.forEach(card => {
			delete card.dataset.selected;
			card.querySelectorAll('.option').forEach(option => option.classList.remove('selected', 'correct', 'incorrect'));
			const feedback = card.querySelector('.feedback');
			feedback.classList.remove('visible');
			feedback.textContent = '';
		});

		resultBox.classList.remove('visible');
		resultBox.textContent = '';
		updateAnsweredCount();
	});
}

document.querySelectorAll('[data-quiz]').forEach(initializeQuiz);
