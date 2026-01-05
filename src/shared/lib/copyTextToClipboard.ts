const copyTextToClipboard = (text: string): boolean => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
    } catch (err) {
        console.error('Failed to copy text:', err);
        document.body.removeChild(textarea);
        return false;
    }
};

export default copyTextToClipboard;
