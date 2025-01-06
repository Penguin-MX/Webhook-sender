const languageSelect = document.getElementById('language-select');
const title = document.getElementById('title');
const webhookLabel = document.getElementById('webhook-label');
const messageLabel = document.getElementById('message-label');
const countLabel = document.getElementById('count-label');
const sendButton = document.getElementById('send-button');
const terminalLog = document.getElementById('terminal-log');
const webhookInput = document.getElementById('webhook-url');
const countInput = document.getElementById('message-count');
const messageInput = document.getElementById('message-content');

const translations = {
    en: {
        title: "Discord Webhook Messenger",
        webhookLabel: "Webhook URL",
        webhookPlaceholder: "Enter Discord Webhook URL",
        messageLabel: "Message Content",
        messagePlaceholder: "Enter your message here...",
        countLabel: "Number of Messages",
        sendButton: "Send Messages",
        terminalPlaceholder: "Logs will appear here..."
    },
    fa: {
        title: "فرستنده وبهوک دیسکورد",
        webhookLabel: "آدرس وبهوک",
        webhookPlaceholder: "آدرس وبهوک دیسکورد را وارد کنید",
        messageLabel: "محتوای پیام",
        messagePlaceholder: "پیام خود را اینجا وارد کنید...",
        countLabel: "تعداد پیام‌ها",
        sendButton: "ارسال پیام‌ها",
        terminalPlaceholder: "لاگ‌ها در اینجا نمایش داده می‌شوند..."
    }
};

languageSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    title.textContent = translations[lang].title;
    webhookLabel.textContent = translations[lang].webhookLabel;
    webhookInput.placeholder = translations[lang].webhookPlaceholder;
    messageLabel.textContent = translations[lang].messageLabel;
    messageInput.placeholder = translations[lang].messagePlaceholder;
    countLabel.textContent = translations[lang].countLabel;
    sendButton.textContent = translations[lang].sendButton;
    if (!terminalLog.innerHTML.trim()) {
        terminalLog.innerHTML = `<span class="log">${translations[lang].terminalPlaceholder}</span>`;
    }
});

function log(message, type = 'success') {
    const p = document.createElement('p');
    p.textContent = message;
    p.classList.add('log');
    if (type === 'success') {
        p.classList.add('success');
    } else {
        p.classList.add('error');
    }
    terminalLog.appendChild(p);
    terminalLog.scrollTop = terminalLog.scrollHeight;
}

async function sendWebhook(url, count, message) {
    sendButton.disabled = true;
    sendButton.textContent = languageSelect.value === 'fa' ? 'در حال ارسال...' : 'Sending...';
    for (let i = 1; i <= count; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: message })
            });
            if (response.ok) {
                log(languageSelect.value === 'fa' ? `✅ پیام ${i} با موفقیت ارسال شد.` : `✅ Message ${i} sent successfully.`);
            } else {
                log(languageSelect.value === 'fa' ? `❌ ارسال پیام ${i} ناموفق بود. وضعیت: ${response.status}` : `❌ Failed to send message ${i}. Status: ${response.status}`, 'error');
            }
        } catch (error) {
            log(languageSelect.value === 'fa' ? `❌ خطا در ارسال پیام ${i}: ${error}` : `❌ Error sending message ${i}: ${error}`, 'error');
        }
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    sendButton.disabled = false;
    sendButton.textContent = languageSelect.value === 'fa' ? 'ارسال پیام‌ها' : 'Send Messages';
}

sendButton.addEventListener('click', () => {
    const url = webhookInput.value.trim();
    const count = parseInt(countInput.value);
    const message = messageInput.value.trim();
    const lang = languageSelect.value;

    if (!url) {
        log(lang === 'fa' ? '❌ لطفاً آدرس وبهوک را وارد کنید.' : '❌ Please enter the webhook URL.', 'error');
        return;
    }
    if (!message) {
        log(lang === 'fa' ? '❌ لطفاً محتوای پیام را وارد کنید.' : '❌ Please enter the message content.', 'error');
        return;
    }
    if (isNaN(count) || count < 1) {
        log(lang === 'fa' ? '❌ لطفاً تعداد معتبری وارد کنید.' : '❌ Please enter a valid number of messages.', 'error');
        return;
    }
    sendWebhook(url, count, message);
});

document.addEventListener('DOMContentLoaded', () => {
    const lang = languageSelect.value;
    if (!terminalLog.innerHTML.trim()) {
        terminalLog.innerHTML = `<span class="log">${translations[lang].terminalPlaceholder}</span>`;
    }
});
