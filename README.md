# EduMind AI

Open `index.html` in a browser (or run `npx serve .` in this folder).

- `app.js` - app logic. The n8n webhook URL is the `WEBHOOK` constant on line 1.
- `styles.css` - theme tokens (dark/light) and layout.

The tutor sends `{prompt, message, chatInput, question, sessionId}` by POST and reads `output` from the reply.
Progress, theme and chat are saved in the browser's localStorage.
