async function deleteFormHandler(event) {
    event.preventDefault();

    const question_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/questions/${question_id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-question-btn').addEventListener('click', deleteFormHandler);
