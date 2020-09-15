async function newFormHandler(event) {
    event.preventDefault();

    const question_url = document.querySelector('textarea[name="question-content"]').value.trim();

    if (question_url) {
        const response = await fetch(`/api/questions`, {
            method: 'POST',
            body: JSON.stringify({
                // title,
                question_url
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Your question was submitted, Father Time will respond soon!");
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }

}

document.querySelector('.new-question-form').addEventListener('submit', newFormHandler);