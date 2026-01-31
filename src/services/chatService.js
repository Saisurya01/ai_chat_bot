/**
 * Generates a short title for a chat session based on the first message.
 * Uses a temporary WebSocket connection to the AI.
 * @param {string} userMessage - The first message from the user.
 * @returns {Promise<string>} - The generated title.
 */
export const generateChatTitle = (userMessage) => {
    return new Promise((resolve, reject) => {
        const url = "wss://backend.buildpicoapps.com/api/chatbot/chat";
        const websocket = new WebSocket(url);
        const chatId = crypto.randomUUID();
        let title = "";

        const systemPrompt = "You are a helpful assistant. Generate a very short, concise title (max 4-5 words) for a chat that starts with the following message. Do not use quotes or punctuation. Just the title.";

        websocket.onopen = () => {
            websocket.send(JSON.stringify({
                chatId: chatId,
                appId: "apply-official",
                systemPrompt: systemPrompt,
                message: userMessage,
            }));
        };

        websocket.onmessage = (event) => {
            title += event.data;
        };

        websocket.onclose = () => {
            // Clean up the title
            const cleanTitle = title.trim().replace(/^["']|["']$/g, '');
            resolve(cleanTitle || "New Chat");
        };

        websocket.onerror = (error) => {
            console.error("Title generation error:", error);
            reject(error);
        };

        // Timeout after 10 seconds to avoid hanging
        setTimeout(() => {
            if (websocket.readyState === WebSocket.OPEN || websocket.readyState === WebSocket.CONNECTING) {
                websocket.close();
            }
        }, 10000);
    });
};
