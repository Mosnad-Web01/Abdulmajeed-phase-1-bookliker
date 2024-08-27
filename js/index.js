document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
    const currentUser = { "id": 1, "username": "pouros" };  // Example current user

    // Fetch and display list of books
    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => {
            books.forEach(book => displayBookTitle(book));
        });

    // Function to display book titles in the list
    function displayBookTitle(book) {
        const li = document.createElement('li');
        li.textContent = book.title;
        li.addEventListener('click', () => displayBookDetails(book));
        bookList.appendChild(li);
    }

    // Function to display book details in the show panel
    function displayBookDetails(book) {
        showPanel.innerHTML = `
            <img src="${book.img_url}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p>${book.description}</p>
            <ul id="user-list"></ul>
            <button id="like-btn">LIKE</button>
        `;

        const userList = document.getElementById('user-list');
        book.users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.username;
            userList.appendChild(li);
        });

        const likeButton = document.getElementById('like-btn');
        likeButton.addEventListener('click', () => toggleLikeBook(book));
    }

    // Function to toggle like/unlike a book
    function toggleLikeBook(book) {
        const userList = document.getElementById('user-list');

        // Check if the current user has already liked the book
        const userHasLiked = book.users.some(user => user.id === currentUser.id);

        if (userHasLiked) {
            // Un-like the book by removing the current user from the array
            book.users = book.users.filter(user => user.id !== currentUser.id);
        } else {
            // Like the book by adding the current user to the array
            book.users.push(currentUser);
        }

        // Update the server with the new list of users
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ users: book.users })
        })
        .then(response => response.json())
        .then(updatedBook => {
            // Update the displayed user list in the DOM
            userList.innerHTML = '';
            updatedBook.users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username;
                userList.appendChild(li);
            });
        });
    }
});
