document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    if(name && message){
        const messagesList = document.getElementById('messagesList');
        const messageEl = document.createElement('div');
        messageEl.className = 'user-message';
        messageEl.innerHTML = `<strong>${name}:</strong> ${message}`;
        messageEl.style.animation = 'fadeIn 0.8s ease forwards';
        messagesList.appendChild(messageEl);
        document.getElementById('messageForm').reset();
    }
    });
  