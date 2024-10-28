function toggleToolbar() {
    const toolbar = document.getElementById('toolbar');
    toolbar.classList.toggle('open');
}

function changeToolbarPosition(position) {
    const toolbar = document.getElementById('toolbar');
    if (position === 'left') {
        toolbar.classList.add('left');
    } else {
        toolbar.classList.remove('left');
    }
}

function listPrompts() {
    // Function to list AI prompts
}

function searchPrompts() {
    const query = document.getElementById('searchPrompt').value.toLowerCase();
    const prompts = document.querySelectorAll('#promptList li');
    prompts.forEach(prompt => {
        const text = prompt.textContent.toLowerCase();
        if (text.includes(query)) {
            prompt.style.display = '';
        } else {
            prompt.style.display = 'none';
        }
    });
}

function addPrompt() {
    const promptText = prompt('Enter new prompt:');
    if (promptText) {
        const promptList = document.getElementById('promptList');
        const newPrompt = document.createElement('li');
        newPrompt.innerHTML = `${promptText} <button onclick="insertPrompt('${promptText}')">Insert</button> <button onclick="editPrompt(this)">Edit</button> <button onclick="deletePrompt(this)">Delete</button>`;
        promptList.appendChild(newPrompt);
    }
}

function editPrompt(button) {
    const promptItem = button.parentElement;
    const promptText = prompt('Edit prompt:', promptItem.firstChild.textContent);
    if (promptText) {
        promptItem.innerHTML = `${promptText} <button onclick="insertPrompt('${promptText}')">Insert</button> <button onclick="editPrompt(this)">Edit</button> <button onclick="deletePrompt(this)">Delete</button>`;
    }
}

function deletePrompt(button) {
    const promptItem = button.parentElement;
    promptItem.remove();
}

function insertPrompt(prompt) {
    const contenteditable = document.querySelector('.contenteditable');
    contenteditable.innerText = prompt;
}
