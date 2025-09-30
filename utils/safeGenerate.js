export async function safeGenerate(model, prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retrying... (${i + 1})`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}
