// ============================================
// ===== ЗАСТАВКА =====
// ============================================
const cover = document.getElementById('cover');
const openButton = document.getElementById('openButton');
const main = document.getElementById('main');

openButton.addEventListener('click', () => {
    cover.classList.add('fade-out');
    setTimeout(() => {
        cover.classList.add('hidden');
        main.classList.remove('hidden');
    }, 800);
});

// ============================================
// ===== ЭЛЕМЕНТЫ =====
// ============================================
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const secretButton = document.getElementById('secretButton');
const sendButton = document.getElementById('sendButton');
const response = document.getElementById('response');
const body = document.body;
let selectedActivity = '';

// ============================================
// ===== КНОПКА "НЕТ" УБЕГАЕТ =====
// ============================================
let noButtonClicks = 0;

const funnyMessages = [
    "эээй ты чеее 👀",
    "куда жмёшь! 😳",
    "ой-ой-ой! 🙈",
    "не поймал! 😜",
    "убежала! 🏃‍♀️",
    "а я быстрее! ⚡",
    "мимо! 🎯",
    "ха-ха! 😂",
    "даже не пытайся! 😎",
    "ну ты и настырный! 😅",
    "не-не-не! 🙅‍♀️",
    "я тут не стояла 💨",
    "а ты упорный! 🔥",
    "сдавайся лучше! 🌸",
    "поймал? неа! 🤭",
];

const noButtonTexts = [
    "🌸 НЕТ",
    "😏 Уверен?",
    "🤔 Точно?",
    "😢 Подумай",
    "💔 Расстроюсь",
    "🥺 Ну пожалуйста",
    "😤 Не сдавайся",
    "🤯 Не поймаешь",
];

function showFloatingMessage() {
    const rect = noButton.getBoundingClientRect();
    const msg = document.createElement('div');
    msg.className = 'floating-message';
    msg.textContent = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    msg.style.position = 'fixed';
    msg.style.left = Math.min(window.innerWidth - 200, rect.right + 10) + 'px';
    msg.style.top = Math.max(10, rect.top - 10) + 'px';
    msg.style.zIndex = '99999';
    document.body.appendChild(msg);
    setTimeout(() => {
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(-20px)';
        setTimeout(() => msg.remove(), 400);
    }, 1200);
}

function escapeNoButton(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    noButtonClicks++;
    showFloatingMessage();
    noButton.textContent = noButtonTexts[noButtonClicks % noButtonTexts.length];
    
    const btnW = noButton.offsetWidth;
    const btnH = noButton.offsetHeight;
    
    // Берём позицию карточки как ориентир
    const card = document.querySelector('.container');
    const cardRect = card.getBoundingClientRect();
    
    // Прыгаем в радиусе карточки + запас (200px)
    const padding = 40;
    const zoneLeft = Math.max(padding, cardRect.left - 200);
    const zoneRight = Math.min(window.innerWidth - btnW - padding, cardRect.right + 200);
    const zoneTop = Math.max(padding, cardRect.top - 100);
    const zoneBottom = Math.min(window.innerHeight - btnH - padding, cardRect.bottom + 100);
    
    // 8 точек вокруг карточки + пара в стороне
    const spots = [
        { x: zoneLeft, y: zoneTop },                                 // верх-лево
        { x: zoneRight, y: zoneTop },                                // верх-право
        { x: zoneLeft, y: zoneBottom },                              // низ-лево
        { x: zoneRight, y: zoneBottom },                             // низ-право
        { x: (zoneLeft + zoneRight) / 2, y: zoneTop },               // верх-центр
        { x: (zoneLeft + zoneRight) / 2, y: zoneBottom },            // низ-центр
        { x: zoneLeft, y: (zoneTop + zoneBottom) / 2 },              // лево-центр
        { x: zoneRight, y: (zoneTop + zoneBottom) / 2 },             // право-центр
    ];
    
    // Ищем точку, максимально далёкую от курсора (но не слишком далеко)
    let chosen = spots[Math.floor(Math.random() * spots.length)];
    if (event && event.clientX) {
        let bestDist = 0;
        for (const pt of spots) {
            const dist = Math.hypot(pt.x - event.clientX, pt.y - event.clientY);
            // Хотим не меньше 250, но и не больше 700 (чтобы не улетала)
            if (dist > bestDist && dist < 700) {
                bestDist = dist;
                chosen = pt;
            }
        }
    }
    
    noButton.style.position = 'fixed';
    noButton.style.left = chosen.x + 'px';
    noButton.style.top = chosen.y + 'px';
    noButton.style.zIndex = '9999';
    noButton.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    noButton.style.transform = `rotate(${Math.random() * 30 - 15}deg) scale(1.05)`;
    
    if (noButtonClicks >= 12) {
        setTimeout(() => {
            noButton.textContent = "😩 Ладно, уговорил!";
            noButton.style.background = "linear-gradient(135deg, #ff8fab, #ff4d8a)";
            noButton.style.color = "white";
            setTimeout(() => {
                noButton.textContent = "💖 Всё равно ДА";
            }, 1200);
        }, 500);
    }
}

noButton.addEventListener('click', escapeNoButton);
noButton.addEventListener('touchstart', escapeNoButton);

// ============================================
// ===== КНОПКА "ДА" =====
// ============================================
yesButton.addEventListener('click', () => {
    body.classList.add('shake');
    setTimeout(() => body.classList.remove('shake'), 1000);
    
    yesButton.classList.add('shake-button');
    setTimeout(() => yesButton.classList.remove('shake-button'), 1000);
    
    launchFireworks();
    showBigResponse("💖 УРААААА!", "Жду тебя с нетерпением! 💖<br>Ты самый лучший! 🥰");
    
    // ← ДОБАВИЛИ ЭТО: берём дату и занятие
    const date = document.getElementById('dateInput').value;
    let extra = '';
    if (selectedActivity) {
        extra = `Занятие: ${selectedActivity}`;
    }
    
    // ← И передаём их в sendAnswer
    sendAnswer('yes', date, extra);
});

function showBigResponse(title, text) {
    const old = document.querySelector('.big-response-modal');
    if (old) old.remove();
    
    // Берём выбранную дату
    const dateInput = document.getElementById('dateInput');
    const selectedDate = dateInput ? dateInput.value : '';
    
    // Готовим блок с обратным отсчётом
    let countdownHTML = '';
    if (selectedDate) {
        countdownHTML = `
            <div class="countdown-block">
                <div class="countdown-label">⏳ До нашей встречи осталось:</div>
                <div class="countdown" id="countdown">
                    <div class="countdown-item">
                        <span class="countdown-num" id="cd-days">0</span>
                        <span class="countdown-text">дней</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-num" id="cd-hours">0</span>
                        <span class="countdown-text">часов</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-num" id="cd-minutes">0</span>
                        <span class="countdown-text">минут</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-num" id="cd-seconds">0</span>
                        <span class="countdown-text">секунд</span>
                    </div>
                </div>
                <div class="countdown-date" id="cd-date"></div>
            </div>
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'big-response-modal';
    modal.innerHTML = `
        <div class="big-response-content">
            <div class="big-hearts">💖✨💖</div>
            <h1>${title}</h1>
            <p>${text}</p>
            ${countdownHTML}
            <button class="big-response-close">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Запускаем таймер, если дата выбрана
    let intervalId = null;
    if (selectedDate) {
        startCountdown(selectedDate);
        intervalId = setInterval(() => startCountdown(selectedDate), 1000);
    }
    
    const close = () => {
        if (intervalId) clearInterval(intervalId);
        modal.remove();
        document.body.style.overflow = '';
    };
    
    modal.querySelector('.big-response-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
}

// ============================================
// ===== ОБРАТНЫЙ ОТСЧЁТ =====
// ============================================
function startCountdown(dateStr) {
    const target = new Date(dateStr + 'T00:00:00').getTime();
    const now = Date.now();
    const diff = target - now;
    
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');
    const cdDate = document.getElementById('cd-date');
    
    if (!cdDays) return;  // модалка закрыта
    
    // Красивая дата
    if (cdDate) {
        const d = new Date(dateStr + 'T00:00:00');
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        cdDate.textContent = `📅 ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    
    if (diff <= 0) {
        cdDays.textContent = '🎉';
        cdHours.textContent = '🎉';
        cdMinutes.textContent = '🎉';
        cdSeconds.textContent = '🎉';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    cdDays.textContent = days;
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
}
// ============================================
// ===== СЕКРЕТНАЯ КНОПКА =====
// ============================================
secretButton.addEventListener('click', showSecretModal);

function showSecretModal() {
    const old = document.querySelector('.secret-modal');
    if (old) old.remove();
    
    const modal = document.createElement('div');
    modal.className = 'secret-modal';
    modal.innerHTML = `
        <div class="secret-content">
            <h1>🤫 САМ РЕШУУУУУ</h1>
            <h2>БЕБЕБЕ! 🤪</h2>
            <p>Ладно, ладно... выбери что хочешь:</p>
            <div class="secret-buttons">
                <button class="secret-option" data-choice="walk">🚶 Погулять</button>
                <button class="secret-option" data-choice="drive">🚗 Покататься</button>
                <button class="secret-option" data-choice="both">✨ И то, и другое!</button>
            </div>
            <button class="secret-close">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';  // блокируем скролл, пока открыто
    
    const close = () => {
        modal.remove();
        document.body.style.overflow = '';
    };
    
    modal.querySelector('.secret-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
    
    modal.querySelectorAll('.secret-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.dataset.choice;
            response.textContent = `💫 Ты выбрал: ${btn.textContent}`;
            response.classList.remove('hidden');
            sendAnswer('secret', '', `Выбрано: ${choice}`);
            close();
        });
    });
}
// ============================================
// ===== ФЕЕРВЕРК =====
// ============================================
function launchFireworks() {
    const colors = ['#ff4d8a', '#ff8fab', '#ffb3d1', '#ffd1dc', '#d4b5ff', '#ffeb3b'];
    const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌟', '💫'];
    
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'firework';
            
            if (Math.random() > 0.5) {
                particle.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                particle.style.fontSize = (15 + Math.random() * 25) + 'px';
            } else {
                particle.style.width = (8 + Math.random() * 12) + 'px';
                particle.style.height = particle.style.width;
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.borderRadius = '50%';
            }
            
            const rect = yesButton.getBoundingClientRect();
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 300;
            particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
            particle.style.animationDuration = (1.5 + Math.random() * 1) + 's';
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 2500);
        }, i * 15);
    }
}

// ============================================
// ===== ОТПРАВКА =====
// ============================================
async function sendAnswer(type, date = '', message = '') {
    try {
        await fetch('/api/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, date, message })
        });
    } catch (e) {
        console.error('Ошибка отправки:', e);
    }
}

sendButton.addEventListener('click', async () => {
    const message = document.getElementById('messageInput').value;
    const date = document.getElementById('dateInput').value;

    if (!message.trim() && !date && !selectedActivity) {
        response.textContent = "Выбери дату, занятие или напиши сообщение 💕";
        response.classList.remove('hidden');
        return;
    }

    const fullMessage = [];
    if (selectedActivity) fullMessage.push(`Занятие: ${selectedActivity}`);
    if (message.trim()) fullMessage.push(`Сообщение: ${message}`);
    
    await sendAnswer('message', date, fullMessage.join(' | '));
    
    response.innerHTML = "💌 Спасибо! Всё передано ❤️<br>Жду нашей встречи!";
    response.classList.remove('hidden');
    document.getElementById('messageInput').value = '';
});

// ============================================
// ===== ВЫБОР ЧЕМ ЗАНЯТЬСЯ =====
// ============================================

document.querySelectorAll('.activity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Снимаем выделение со всех
        document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('selected'));
        // Выделяем нажатую
        btn.classList.add('selected');
        selectedActivity = btn.dataset.activity;
        console.log('Выбрано занятие:', selectedActivity);
    });
});
// ============================================
// ===== ЛЕТАЮЩИЕ СЕРДЕЧКИ НА ФОНЕ =====
// ============================================
const heartsBg = document.getElementById('hearts-bg');
const heartEmojisBg = ['💖', '💕', '💗', '💓', '💝', '❤️', '💘', '💞', '🩷'];

function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.textContent = heartEmojisBg[Math.floor(Math.random() * heartEmojisBg.length)];
    
    // Случайная позиция по ширине
    heart.style.left = Math.random() * 100 + '%';
    
    // Случайный размер
    const size = 16 + Math.random() * 24;
    heart.style.fontSize = size + 'px';
    
    // Случайная скорость (от 6 до 14 сек)
    const duration = 6 + Math.random() * 8;
    heart.style.animationDuration = duration + 's';
    
    // Случайная задержка (для разнообразия)
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    heartsBg.appendChild(heart);
    
    // Удаляем после завершения анимации
    setTimeout(() => heart.remove(), (duration + 2) * 1000);
}

// Запускаем сердечки каждые 800 мс
setInterval(spawnHeart, 800);

// Первые 5 сердечек — сразу при загрузке
for (let i = 0; i < 5; i++) {
    setTimeout(spawnHeart, i * 300);
}

console.log("💕 Любовь запущена в воздух!");
console.log("💖 Приглашение загружено!");