/**
 * Automatically enhances code blocks with VS Code editor chrome,
 * file tabs, traffic light controls, line numbers, and a clipboard copy button.
 */
export function initVSCodeCodeBlocks() {
	const codeBlocks = Array.from(document.querySelectorAll<HTMLElement>('.prose pre.astro-code'));

	codeBlocks.forEach((pre) => {
		// Avoid double initialization
		if (pre.closest('.vscode-window')) return;

		const lang = pre.dataset.language || '';
		const filename = getFilenameForLanguage(lang, pre.innerText);

		const wrapper = document.createElement('div');
		wrapper.className = 'vscode-window';

		const header = document.createElement('div');
		header.className = 'vscode-header';

		// Mac traffic lights
		const dots = document.createElement('div');
		dots.className = 'vscode-dots';
		dots.innerHTML = `
			<span class="vscode-dot vscode-dot--red" aria-hidden="true"></span>
			<span class="vscode-dot vscode-dot--yellow" aria-hidden="true"></span>
			<span class="vscode-dot vscode-dot--green" aria-hidden="true"></span>
		`;

		// Tab bar
		const tabs = document.createElement('div');
		tabs.className = 'vscode-tabs';
		tabs.innerHTML = `
			<div class="vscode-tab is-active">
				<span class="vscode-tab__icon">${getFileIconSvg(lang)}</span>
				<span class="vscode-tab__name">${filename}</span>
			</div>
		`;

		// Copy button
		const copyBtn = document.createElement('button');
		copyBtn.type = 'button';
		copyBtn.className = 'vscode-copy-btn';
		copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
		copyBtn.innerHTML = `
			<svg class="vscode-copy-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
				<path d="M3.5 11V3.5C3.5 2.67157 4.17157 2 5 2H11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
			</svg>
			<span class="vscode-copy-label">Copy</span>
		`;

		copyBtn.addEventListener('click', async () => {
			try {
				const codeText = pre.querySelector('code')?.innerText || pre.innerText;
				await navigator.clipboard.writeText(codeText);

				copyBtn.classList.add('is-copied');
				const label = copyBtn.querySelector('.vscode-copy-label');
				if (label) label.textContent = 'Copied!';

				setTimeout(() => {
					copyBtn.classList.remove('is-copied');
					if (label) label.textContent = 'Copy';
				}, 2000);
			} catch (err) {
				console.error('Failed to copy code:', err);
			}
		});

		header.appendChild(dots);
		header.appendChild(tabs);
		header.appendChild(copyBtn);

		// Insert wrapper before pre, then move pre inside wrapper
		pre.parentNode?.insertBefore(wrapper, pre);
		wrapper.appendChild(header);
		wrapper.appendChild(pre);
	});
}

function getFilenameForLanguage(lang: string, code: string): string {
	const l = lang.toLowerCase();
	if (l === 'swift') {
		if (code.includes('DictationStateMachine')) return 'DictationStateMachine.swift';
		if (code.includes('App') || code.includes('AppDelegate')) return 'App.swift';
		return 'main.swift';
	}
	if (l === 'bash' || l === 'sh' || l === 'shell' || l === 'zsh') return 'terminal.sh';
	if (l === 'typescript' || l === 'ts') return 'index.ts';
	if (l === 'javascript' || l === 'js') return 'index.js';
	if (l === 'json') return 'package.json';
	if (l === 'python' || l === 'py') return 'main.py';
	if (l === 'rust' || l === 'rs') return 'main.rs';
	if (l === 'html') return 'index.html';
	if (l === 'css') return 'styles.css';
	return l ? `code.${l}` : 'snippet.txt';
}

function getFileIconSvg(lang: string): string {
	const l = lang.toLowerCase();
	if (l === 'swift') {
		return `<svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13" style="color: #F05138"><path d="M14.6 9.8c-.8 1.4-2.1 2.6-3.7 3.3 3.1-1.3 4.2-4.4 4.2-4.4s-1.8 1.9-4.7 1.8c2.2-1.7 3.5-4.2 3.5-4.2s-2.7 2.6-6 3.1c1.5-1.5 2.6-3.8 2.6-3.8s-3.5 3.3-7.5 4.5c-.3.1-.6.2-.9.4C1 11.2 0 12.3 0 12.3s2.4-.6 5-1.9c-2.4 1.3-4.5 3.5-4.5 3.5s3.2-1.5 6.4-3.4c2.8 1.5 6.1 1.6 7.7-.7z"/></svg>`;
	}
	return `<svg viewBox="0 0 16 16" fill="none" width="13" height="13" stroke="currentColor" stroke-width="1.3"><path d="M4 2.5h5.5L13 6v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"/><path d="M9 2.5V6h3.5"/></svg>`;
}
