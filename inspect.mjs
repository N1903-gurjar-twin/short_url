import mammoth from 'mammoth';

(async () => {
  try {
    const result = await mammoth.extractRawText({ path: 'data/URL_Shortener_Analytics_Frontend_Requirements-febafe.docx' });
    console.log(result.value);
  } catch (err) {
    console.error('Error reading document:', err);
  }
})();
