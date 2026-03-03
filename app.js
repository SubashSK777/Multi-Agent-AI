document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const dilemmaInput = document.getElementById('dilemmaInput');
    const progressContainer = document.getElementById('progressContainer');
    const agentsGrid = document.getElementById('agentsGrid');
    const resultSection = document.getElementById('resultSection');
    const finalReport = document.getElementById('finalReport');

    // Dynamic Cursor Tracking
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
        document.addEventListener('mousedown', () => {
            cursorGlow.style.width = '300px';
            cursorGlow.style.height = '300px';
            cursorGlow.style.background = 'radial-gradient(circle at center, rgba(0, 210, 211, 0.18) 0%, transparent 60%)';
        });
        document.addEventListener('mouseup', () => {
            cursorGlow.style.width = '400px';
            cursorGlow.style.height = '400px';
            cursorGlow.style.background = 'radial-gradient(circle at center, rgba(107, 102, 255, 0.12) 0%, transparent 60%)';
        });
    }

    // Define the multi-agent system structure based on original CrewAI logic
    const agents = [
        {
            id: 'scenario_creator',
            role: 'Scenario Creator',
            icon: '📝',
            prompt: `You are skilled in outlining ethical dilemmas. 
Your task is to clearly present the following scenario: 
"{DILEMMA}"
Provide a clear and concise description of the ethical dilemma, identifying the core conflict.`
        },
        {
            id: 'moral_analyzer',
            role: 'Moral Analyzer',
            icon: '⚖️',
            prompt: `You are an expert in moral philosophy. 
Based on the defined scenario:
"{PREVIOUS}"
Assess the moral implications. Evaluate the ethical considerations involved in making a choice, referring to moral frameworks like utilitarianism or deontology.`
        },
        {
            id: 'emotional_evaluator',
            role: 'Emotional Evaluator',
            icon: '❤️',
            prompt: `You specialize in emotional intelligence.
Based on the analysis so far:
"{PREVIOUS}"
Analyze the emotional impact of the decision on the individual making it and society at large. Keep it empathetic and profound.`
        },
        {
            id: 'consequence_evaluator',
            role: 'Consequence Evaluator',
            icon: '🌍',
            prompt: `You specialize in societal impact analysis.
Given the evolving context:
"{PREVIOUS}"
Evaluate the broader societal and practical consequences of the potential choices. Consider stability, historical impact, and future potential.`
        },
        {
            id: 'final_decider',
            role: 'Final Decider',
            icon: '🏛️',
            prompt: `You are a decision-making specialist.
Integrate all these insights to make a reasoned decision:
"{PREVIOUS}"
Summarize all analyses to arrive at a well-reasoned, definitive choice or synthesis. Present the final synthesis clearly formatted in Markdown using Headings.`
        }
    ];

    analyzeBtn.addEventListener('click', async () => {
        const dilemma = dilemmaInput.value.trim();
        if (!dilemma) {
            dilemmaInput.style.borderColor = '#FF6B6B';
            setTimeout(() => dilemmaInput.style.borderColor = 'rgba(255, 255, 255, 0.08)', 1000);
            return;
        }

        // Initialize UI State
        analyzeBtn.disabled = true;
        analyzeBtn.classList.add('loading');
        resultSection.classList.add('hidden');
        progressContainer.classList.remove('hidden');
        agentsGrid.innerHTML = '';

        // Render Agents in Grid
        agents.forEach((agent, index) => {
            const card = document.createElement('div');
            card.className = 'agent-card';
            card.id = `card-${agent.id}`;
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="agent-shimmer"></div>
                <div class="agent-header">
                    <span class="agent-icon">${agent.icon}</span>
                    <span class="agent-role">${agent.role}</span>
                </div>
                <div class="agent-status" id="status-${agent.id}">Waiting...</div>
            `;
            agentsGrid.appendChild(card);
        });

        // Run Multi-Agent Process sequentially (like CrewAI process.sequential)
        let accumulatedContext = "";

        try {
            for (let i = 0; i < agents.length; i++) {
                const currentAgent = agents[i];
                const card = document.getElementById(`card-${currentAgent.id}`);
                const status = document.getElementById(`status-${currentAgent.id}`);

                card.classList.add('active');
                status.textContent = 'Analyzing...';

                // Formulate the prompt based on agent configuration
                let actualPrompt = currentAgent.prompt;
                if (i === 0) {
                    actualPrompt = actualPrompt.replace('{DILEMMA}', dilemma);
                } else {
                    // Feed the entire accumulated context to the next agent
                    actualPrompt = actualPrompt.replace('{PREVIOUS}', accumulatedContext);
                }

                // Call Puter.js AI
                const response = await puter.ai.chat(actualPrompt);
                let textResult = response;

                // Puter AI responses can be objects containing the message, depending on exactly how v2 parses it.
                // We'll safely stringify / extract
                if (typeof textResult !== 'string') {
                    textResult = textResult?.message?.content || textResult?.text || String(textResult);
                }

                // Append output to context
                accumulatedContext += `\n\n--- Output from ${currentAgent.role} ---\n${textResult}`;

                card.classList.remove('active');
                card.classList.add('completed');
                status.textContent = 'Completed';
                status.style.color = '#6B66FF';

                // Ensure final output gets rendered
                if (i === agents.length - 1) {
                    renderFinalResult(textResult);
                }
            }
        } catch (error) {
            console.error("AI Error:", error);
            alert("An error occurred during AI processing. Check console for details.");
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('loading');
        }
    });

    function renderFinalResult(markdownText) {
        // Use marked.js for robust Markdown to HTML parsing
        let htmlText;
        try {
            htmlText = marked.parse(markdownText);
        } catch (e) {
            console.error("Markdown parsing failed, raw output used", e);
            htmlText = `<pre>${markdownText}</pre>`;
        }

        finalReport.innerHTML = htmlText;
        resultSection.classList.remove('hidden');

        // Add a small delay for smooth scrolling animation rendering
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
});
