class TypingTest {
    constructor() {
        this.texts = [
            "The digital revolution has fundamentally transformed how we live, work, and interact with the world around us. From the moment we wake up to the time we go to sleep, technology plays an integral role in our daily routines. Smartphones have become extensions of ourselves, providing instant access to information, communication, and entertainment. Social media platforms connect us with friends and family across the globe, while also creating new challenges related to privacy and mental health. The rise of artificial intelligence and machine learning is reshaping industries, from healthcare and finance to transportation and education. Autonomous vehicles are no longer science fiction but a rapidly approaching reality that will revolutionize how we travel. Cloud computing has enabled businesses to scale rapidly and efficiently, while remote work has become the norm for millions of professionals worldwide. E-commerce has transformed retail, making it possible to purchase almost anything with a few clicks. Digital currencies and blockchain technology are challenging traditional financial systems and creating new opportunities for innovation. As we navigate this digital landscape, it's crucial to balance the benefits of technology with the need for human connection and privacy. The future promises even more exciting developments, including virtual reality, augmented reality, and the Internet of Things, which will further integrate technology into every aspect of our lives.",
            "Climate change represents one of the most pressing challenges of our time, requiring immediate and sustained action from individuals, governments, and organizations worldwide. The scientific evidence is overwhelming: global temperatures are rising, ice caps are melting, and extreme weather events are becoming more frequent and severe. The primary cause of this crisis is the emission of greenhouse gases, particularly carbon dioxide, from burning fossil fuels for energy production, transportation, and industrial processes. Deforestation and agricultural practices also contribute significantly to the problem by reducing the Earth's capacity to absorb carbon dioxide. The consequences of climate change are already visible in many parts of the world, including rising sea levels, prolonged droughts, devastating wildfires, and unprecedented flooding. These environmental changes threaten food security, water resources, and human health, particularly affecting vulnerable populations in developing countries. However, there is still hope if we act decisively. Renewable energy technologies like solar, wind, and hydroelectric power are becoming more efficient and cost-effective, offering viable alternatives to fossil fuels. Energy conservation measures, sustainable transportation options, and green building practices can significantly reduce our carbon footprint. Governments must implement policies that incentivize clean energy adoption and penalize excessive emissions. Individuals can contribute by making conscious choices about consumption, transportation, and energy use. The transition to a sustainable future requires unprecedented global cooperation and commitment to protecting our planet for future generations."
        ];

        this.wordsPerView = 35;
        this.currentWordIndex = 0;

        this.currentText = '';
        this.fullText = '';
        this.startTime = null;
        this.endTime = null;
        this.isTestActive = false;
        this.timeLimit = 60;
        this.timer = null;
        this.timeRemaining = 60;
        this.correctChars = 0;
        this.totalChars = 0;
        this.currentIndex = 0;

        this.initializeElements();
        this.initializeEventListeners();
        this.initializeTheme();
        this.generateNewText();
    }

    initializeElements() {
        this.elements = {
            textDisplay: document.getElementById('textDisplay'),
            typingInput: document.getElementById('typingInput'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            retryBtn: document.getElementById('retryBtn'),
            timeSelector: document.getElementById('timeSelector'),
            themeToggle: document.getElementById('themeToggle'),
            themeSelector: document.getElementById('themeSelector'),
            wpm: document.getElementById('wpm'),
            accuracy: document.getElementById('accuracy'),
            timer: document.getElementById('timer'),
            cpm: document.getElementById('cpm'),
            results: document.getElementById('results'),
            finalWPM: document.getElementById('finalWPM'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            finalCPM: document.getElementById('finalCPM'),
            totalWords: document.getElementById('totalWords'),
            performanceBadge: document.getElementById('performanceBadge')
        };
    }

    initializeEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startTest());
        this.elements.resetBtn.addEventListener('click', () => this.resetTest());
        this.elements.retryBtn.addEventListener('click', () => this.retryTest());
        this.elements.timeSelector.addEventListener('change', (e) => this.changeTimeLimit(e.target.value));
        this.elements.themeToggle.addEventListener('click', () => this.cycleTheme());
        this.elements.themeSelector.addEventListener('change', (e) => this.setTheme(e.target.value));
        this.elements.typingInput.addEventListener('input', (e) => this.handleTyping(e));
        this.elements.typingInput.addEventListener('paste', (e) => e.preventDefault());
    }

    initializeTheme() {
        this.themes = ['light', 'dark', 'ocean', 'forest', 'sunset', 'purple'];
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.elements.themeSelector.value = theme;
    }

    cycleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const currentIndex = this.themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }

    generateNewText() {
        this.fullText = this.texts[Math.floor(Math.random() * this.texts.length)];
        this.currentWordIndex = 0;
        this.updateDisplayText();
    }

    updateDisplayText() {
        if (!this.fullText) return;

        const words = this.fullText.split(' ').filter(w => w.length > 0);
        const startIndex = Math.max(0, this.currentWordIndex);
        const endIndex = Math.min(startIndex + this.wordsPerView, words.length);

        if (startIndex >= words.length) {
            this.currentWordIndex = Math.max(0, words.length - this.wordsPerView);
            return this.updateDisplayText();
        }

        this.currentText = words.slice(startIndex, endIndex).join(' ');
        this.displayText();
    }

    displayText() {
        this.elements.textDisplay.innerHTML = this.currentText
            .split('')
            .map((char, index) => `<span class="char" data-index="${index}">${char}</span>`)
            .join('');
    }

    startTest() {
        this.isTestActive = true;
        this.startTime = new Date();
        this.timeRemaining = this.timeLimit;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.currentWordIndex = 0;

        this.elements.typingInput.disabled = false;
        this.elements.typingInput.focus();
        this.elements.typingInput.value = '';
        this.elements.startBtn.disabled = true;
        this.elements.timeSelector.disabled = true;
        this.elements.results.style.display = 'none';

        this.updateDisplayText();
        this.startTimer();
        this.updateCurrentChar();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.elements.timer.textContent = this.timeRemaining;

            if (this.timeRemaining <= 0) {
                this.endTest();
            }
        }, 1000);
    }

    handleTyping(e) {
        if (!this.isTestActive) return;

        const typedText = e.target.value;

        if (typedText.length > this.currentText.length) {
            e.target.value = typedText.slice(0, this.currentText.length);
            return;
        }

        this.updateCharacterDisplay(typedText);
        this.updateStats(typedText);
        this.checkForScroll(typedText);
    }

    checkForScroll(typedText) {
        if (!typedText || !this.currentText) return;

        const words = this.currentText.split(' ').filter(w => w.length > 0);
        const typedWords = typedText.trim().split(' ').filter(w => w.length > 0);

        if (typedWords.length >= Math.floor(words.length * 0.7) && this.hasMoreText()) {
            this.scrollToNextSection(typedText);
        }
    }

    hasMoreText() {
        if (!this.fullText) return false;
        const totalWords = this.fullText.split(' ').filter(w => w.length > 0).length;
        return this.currentWordIndex + this.wordsPerView < totalWords;
    }

    scrollToNextSection(typedText) {
        const scrollAmount = Math.floor(this.wordsPerView * 0.6);
        this.currentWordIndex += scrollAmount;
        this.updateDisplayText();

        const remainingText = this.getRemainingTypedText(typedText);
        this.elements.typingInput.value = remainingText;

        setTimeout(() => {
            this.updateCharacterDisplay(remainingText);
        }, 50);
    }

    getRemainingTypedText(typedText) {
        if (!typedText || typedText.trim().length === 0) return '';

        const words = typedText.trim().split(' ').filter(w => w.length > 0);
        const keepWords = Math.max(1, Math.floor(words.length * 0.3));
        return words.slice(-keepWords).join(' ');
    }

    updateCharacterDisplay(typedText) {
        const chars = this.elements.textDisplay.querySelectorAll('.char');
        if (!chars || !this.currentText) return;

        chars.forEach((char, index) => {
            char.className = 'char';

            if (index < typedText.length && index < this.currentText.length) {
                if (typedText[index].toLowerCase() === this.currentText[index].toLowerCase()) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            } else if (index === typedText.length && index < this.currentText.length) {
                char.classList.add('current');
            }
        });
    }

    updateStats(typedText) {
        this.totalChars = typedText.length;
        this.correctChars = 0;

        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i].toLowerCase() === this.currentText[i].toLowerCase()) {
                this.correctChars++;
            }
        }

        const timeElapsed = (new Date() - this.startTime) / 1000 / 60; // in minutes
        const wordsTyped = this.correctChars / 5; // standard: 5 characters = 1 word
        const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        const cpm = timeElapsed > 0 ? Math.round(this.correctChars / timeElapsed) : 0;

        this.elements.wpm.textContent = wpm;
        this.elements.accuracy.textContent = accuracy + '%';
        this.elements.cpm.textContent = cpm;
    }

    updateCurrentChar() {
        const chars = this.elements.textDisplay.querySelectorAll('.char');
        chars.forEach(char => char.classList.remove('current'));
        if (chars[this.currentIndex]) {
            chars[this.currentIndex].classList.add('current');
        }
    }

    endTest() {
        this.isTestActive = false;
        this.endTime = new Date();
        clearInterval(this.timer);

        this.elements.typingInput.disabled = true;
        this.elements.startBtn.disabled = false;
        this.elements.timeSelector.disabled = false;

        this.showResults();
    }

    showResults() {
        const timeElapsed = (this.endTime - this.startTime) / 1000 / 60; // in minutes
        const wordsTyped = this.correctChars / 5;
        const wpm = Math.round(wordsTyped / timeElapsed);
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        const cpm = Math.round(this.correctChars / timeElapsed);
        const totalWords = Math.round(this.totalChars / 5);

        this.elements.finalWPM.textContent = wpm;
        this.elements.finalAccuracy.textContent = accuracy + '%';
        this.elements.finalCPM.textContent = cpm;
        this.elements.totalWords.textContent = totalWords;

        // Performance badge
        let performance = 'poor';
        let performanceText = 'Keep Practicing';

        if (wpm >= 60 && accuracy >= 95) {
            performance = 'excellent';
            performanceText = 'Excellent!';
        } else if (wpm >= 40 && accuracy >= 90) {
            performance = 'good';
            performanceText = 'Good Job!';
        } else if (wpm >= 25 && accuracy >= 80) {
            performance = 'average';
            performanceText = 'Not Bad';
        }

        this.elements.performanceBadge.className = `performance-badge ${performance}`;
        this.elements.performanceBadge.textContent = performanceText;

        this.elements.results.style.display = 'block';
        this.elements.results.scrollIntoView({ behavior: 'smooth' });
    }

    resetTest() {
        this.isTestActive = false;
        clearInterval(this.timer);

        this.timeRemaining = this.timeLimit;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.currentWordIndex = 0;

        this.elements.typingInput.value = '';
        this.elements.typingInput.disabled = true;
        this.elements.startBtn.disabled = false;
        this.elements.timeSelector.disabled = false;
        this.elements.results.style.display = 'none';

        this.elements.wpm.textContent = '0';
        this.elements.accuracy.textContent = '100%';
        this.elements.timer.textContent = this.timeLimit;
        this.elements.cpm.textContent = '0';

        this.generateNewText();
    }

    retryTest() {
        this.resetTest();
        setTimeout(() => this.startTest(), 100);
    }

    changeTimeLimit(newTime) {
        this.timeLimit = parseInt(newTime);
        this.timeRemaining = this.timeLimit;
        this.elements.timer.textContent = this.timeLimit;

        if (!this.isTestActive) {
            this.resetTest();
        }
    }
}

// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});

// Add some visual feedback for better UX
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const typingTest = document.querySelector('.typing-input');
        if (typingTest && !typingTest.disabled) {
            typingTest.blur();
        }
    }
});

// Prevent context menu on typing area for better focus
document.querySelector('.typing-area')?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});