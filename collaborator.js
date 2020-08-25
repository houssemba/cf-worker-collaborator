// Telegram configuration
const telegramToken = "CHANGEME";
const telegramUserId = "CHANGEME"; // User ID
const telegramURL = "https://api.telegram.org/bot" + telegramToken + "/sendMessage";

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

function formatMessage(request) {
    const method = request.method;
    const url = request.url;
    const headers = new Map(request.headers);
    const body = request.body;

    let message = `<strong>${method}</strong> ${url} : \n `;
    headers.forEach((value, key) => {
        message += `\t ${key} : ${value} \n`;
    })
    message += `\t body : ${body}`;

    return message;
}

async function sendToTelegram(message) {
    const requestInit = {
        method: "POST",
        headers: new Headers([['Content-Type', 'application/x-www-form-urlencoded']]),
        body: "chat_id=" + telegramUserId + "&disable_web_page_preview=1&parse_mode=html&text=" + message
    }

    return await fetch(telegramURL, requestInit)
}

async function handleRequest(request) {
    const message = formatMessage(request);
    console.debug("Send message : ", message);

    const telegramResponse = await sendToTelegram(message);
    console.debug("Telegram response : ", telegramResponse.status);

    return new Response("Ok", {
        headers: new Headers([['Access-Control-Allow-Origin', '*']]),
        status: 200
    })
}