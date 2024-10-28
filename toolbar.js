document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchPrompt');
    searchInput.addEventListener('input', searchPrompts);

    const addPromptForm = document.getElementById('addPromptForm');
    addPromptForm.addEventListener('submit', handleAddPromptFormSubmit);

    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.addEventListener('click', confirmDeletePrompt);
});

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
    const promptList = document.getElementById('promptList');
    promptList.innerHTML = '';

    const prompts = getPromptsFromStorage();
    prompts.forEach(prompt => {
        const newPrompt = document.createElement('li');
        newPrompt.innerHTML = `${prompt.title} <span class="category">${prompt.category}</span> <button onclick="insertPrompt('${prompt.text}')">Insert</button> <button onclick="editPrompt(this)">Edit</button> <button onclick="deletePrompt(this)">Delete</button> <button onclick="toggleFavorite(this)">Favorite</button>`;
        newPrompt.dataset.category = prompt.category;
        newPrompt.dataset.favorite = prompt.favorite;
        newPrompt.classList.toggle('favorite', prompt.favorite);
        promptList.appendChild(newPrompt);
    });
}

function searchPrompts() {
    const query = document.getElementById('searchPrompt').value.toLowerCase();
    const prompts = document.querySelectorAll('#promptList li');
    prompts.forEach(prompt => {
        const title = prompt.firstChild.textContent.toLowerCase();
        if (title.includes(query)) {
            prompt.style.display = '';
        } else {
            prompt.style.display = 'none';
        }
    });
}

function addPrompt() {
    const addPromptModal = document.getElementById('addPromptModal');
    addPromptModal.style.display = 'block';
}

function handleAddPromptFormSubmit(event) {
    event.preventDefault();
    const promptTitle = document.getElementById('promptTitle').value;
    const promptCategory = document.getElementById('promptCategory').value;

    if (promptTitle) {
        const promptList = document.getElementById('promptList');
        const newPrompt = document.createElement('li');
        newPrompt.innerHTML = `${promptTitle} <span class="category">${promptCategory}</span> <button onclick="insertPrompt('${promptTitle}')">Insert</button> <button onclick="editPrompt(this)">Edit</button> <button onclick="deletePrompt(this)">Delete</button> <button onclick="toggleFavorite(this)">Favorite</button>`;
        newPrompt.dataset.category = promptCategory;
        newPrompt.dataset.favorite = 'false';
        promptList.appendChild(newPrompt);
        closeAddPromptModal();
    }
}

function closeAddPromptModal() {
    const addPromptModal = document.getElementById('addPromptModal');
    addPromptModal.style.display = 'none';
    document.getElementById('addPromptForm').reset();
}

function editPrompt(button) {
    const promptItem = button.parentElement;
    const promptTitle = promptItem.firstChild.textContent;
    const promptCategory = promptItem.dataset.category;

    const addPromptModal = document.getElementById('addPromptModal');
    addPromptModal.style.display = 'block';

    document.getElementById('promptTitle').value = promptTitle;
    document.getElementById('promptCategory').value = promptCategory;

    const addPromptForm = document.getElementById('addPromptForm');
    addPromptForm.removeEventListener('submit', handleAddPromptFormSubmit);
    addPromptForm.addEventListener('submit', function updatePrompt(event) {
        event.preventDefault();
        promptItem.innerHTML = `${promptTitle} <span class="category">${promptCategory}</span> <button onclick="insertPrompt('${promptTitle}')">Insert</button> <button onclick="editPrompt(this)">Edit</button> <button onclick="deletePrompt(this)">Delete</button> <button onclick="toggleFavorite(this)">Favorite</button>`;
        promptItem.dataset.category = document.getElementById('promptCategory').value;
        closeAddPromptModal();
        addPromptForm.removeEventListener('submit', updatePrompt);
        addPromptForm.addEventListener('submit', handleAddPromptFormSubmit);
    });
}

function deletePrompt(button) {
    const promptItem = button.parentElement;
    const deletePromptModal = document.getElementById('deletePromptModal');
    deletePromptModal.style.display = 'block';
    deletePromptModal.dataset.promptItem = promptItem;
}

function confirmDeletePrompt() {
    const deletePromptModal = document.getElementById('deletePromptModal');
    const promptItem = deletePromptModal.dataset.promptItem;
    promptItem.remove();
    closeDeletePromptModal();
}

function closeDeletePromptModal() {
    const deletePromptModal = document.getElementById('deletePromptModal');
    deletePromptModal.style.display = 'none';
    deletePromptModal.dataset.promptItem = null;
}

function insertPrompt(prompt) {
    const contenteditable = document.querySelector('.contenteditable');
    contenteditable.innerText = prompt;
}

function toggleFavorite(button) {
    const promptItem = button.parentElement;
    const isFavorite = promptItem.dataset.favorite === 'true';
    promptItem.dataset.favorite = isFavorite ? 'false' : 'true';
    promptItem.classList.toggle('favorite', !isFavorite);
}

function exportPrompts() {
    const prompts = [];
    document.querySelectorAll('#promptList li').forEach(prompt => {
        prompts.push({
            title: prompt.firstChild.textContent,
            category: prompt.dataset.category,
            favorite: prompt.dataset.favorite === 'true'
        });
    });
    const blob = new Blob([JSON.stringify(prompts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompts.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importPrompts() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const prompts = JSON.parse(reader.result);
            const promptList = document.getElementById('promptList');
            promptList.innerHTML = '';
            prompts.forEach(prompt => {
                const newPrompt = document.createElement('li');
                newPrompt.innerHTML = `${prompt.title} <span class="category">${prompt.category}</span> <button onclick="insertPrompt('${prompt.title}')">Insert</button> <button onclick="editPrompt(this)">Edit</button> <button onclick="deletePrompt(this)">Delete</button> <button onclick="toggleFavorite(this)">Favorite</button>`;
                newPrompt.dataset.category = prompt.category;
                newPrompt.dataset.favorite = prompt.favorite;
                newPrompt.classList.toggle('favorite', prompt.favorite);
                promptList.appendChild(newPrompt);
            });
        };
        reader.readAsText(file);
    });
    input.click();
}

function filterPromptsByCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const prompts = document.querySelectorAll('#promptList li');
    prompts.forEach(prompt => {
        if (selectedCategory === '' || prompt.dataset.category === selectedCategory) {
            prompt.style.display = '';
        } else {
            prompt.style.display = 'none';
        }
    });
}

function sortPrompts() {
    const sortOption = document.getElementById('sortPrompts').value;
    const promptList = document.getElementById('promptList');
    const prompts = Array.from(promptList.children);

    prompts.sort((a, b) => {
        if (sortOption === 'title') {
            return a.firstChild.textContent.localeCompare(b.firstChild.textContent);
        } else if (sortOption === 'category') {
            return a.dataset.category.localeCompare(b.dataset.category);
        } else if (sortOption === 'date') {
            return new Date(a.dataset.date) - new Date(b.dataset.date);
        }
    });

    promptList.innerHTML = '';
    prompts.forEach(prompt => promptList.appendChild(prompt));
}

function prevPage() {
    // Implement pagination logic for previous page
}

function nextPage() {
    // Implement pagination logic for next page
}

function getPromptsFromStorage() {
    // Retrieve prompts from local storage or other storage mechanism
    return [];
}
