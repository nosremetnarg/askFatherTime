async function editFormHandler(event) {
    event.preventDefault();

    const question_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    console.log("button clicked");

    const question_url = document.querySelector('textarea[name="question-content"]').value.trim();
    const response = await fetch(`/api/questions/${question_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            // title,
            question_url
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.edit-question-form').addEventListener('submit', editFormHandler);