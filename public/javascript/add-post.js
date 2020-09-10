async function newFormHandler(event) {
    event.preventDefault();

    // const title = document.querySelector('input[name="post-title"]').value;
    const post_url = document.querySelector('textarea[name="post-content"]').value.trim();
    console.log(post_url); // this pulls the right info

    if (post_url) {
        const response = await fetch(`/api/posts`, {
            method: 'POST',
            body: JSON.stringify({
                // title,
                post_url
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

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);