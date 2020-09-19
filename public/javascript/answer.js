async function answerFormHandler(event) {
    event.preventDefault();
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    const question_id = parseInt(this.dataset.questionid);
    const answer_text = document.querySelector(`textarea[data-id="${question_id}"]`).value.trim();

    // const question_id = window.location.toString().split('/')[
    //     window.location.toString().split('/').length - 1
    // ];

    // reach into the html
    // grab the element that holds the data-questionId (this)
    // console.dir(this);
    // extract the data-questionId
    // set it to question_id


    console.log(answer_text, typeof answer_text);
    console.log(question_id, typeof question_id);
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

