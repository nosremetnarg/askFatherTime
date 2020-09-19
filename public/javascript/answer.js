async function answerFormHandler(event) {
    event.preventDefault();
    const question_id = parseInt(this.dataset.questionid);
    const answer_text = document.querySelector(`textarea[data-id="${question_id}"]`).value.trim();

    if (answer_text) {
        const response = await fetch('/api/answers', {
            method: 'POST',
            body: JSON.stringify({
                question_id,
                answer_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
            alert("Your answer was added!");
        } else {
            alert(response.statusText);
        }
    }
}
var answersNew = document.querySelectorAll('.answer-form');

answersNew.forEach(function (userItem) {
    userItem.addEventListener('submit', answerFormHandler);
});

