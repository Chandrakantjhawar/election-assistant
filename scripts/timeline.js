/**
 * timeline.js — Timeline rendering and navigation logic
 * Handles stage switching, progress bar, and keyboard navigation
 */

let currentStageIndex = 0;

/** Render the timeline bar with all 8 steps */
function renderTimeline() {
  const bar = document.getElementById('timeline-bar');
  bar.innerHTML = '';

  // Static connector line
  const connLine = document.createElement('div');
  connLine.className = 'timeline-connector-line';
  bar.appendChild(connLine);

  // Dynamic progress line
  const progLine = document.createElement('div');
  progLine.className = 'timeline-progress-line';
  progLine.id = 'progress-line';
  bar.appendChild(progLine);

  STAGES.forEach((stage, idx) => {
    const btn = document.createElement('button');
    btn.className = 'timeline-step' +
      (idx < currentStageIndex ? ' completed' : '') +
      (idx === currentStageIndex ? ' active' : '');
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', `Go to stage ${stage.id}: ${stage.label}`);
    btn.setAttribute('id', `step-${stage.id}`);

    btn.innerHTML = `
      <div class="step-circle">${idx < currentStageIndex ? '✓' : stage.id}</div>
      <span class="step-label">${stage.label}</span>
    `;

    btn.addEventListener('click', () => goToStage(idx));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToStage(idx);
      }
    });

    bar.appendChild(btn);
  });

  updateProgressLine();
}

/** Update the progress fill line width */
function updateProgressLine() {
  const line = document.getElementById('progress-line');
  if (!line) return;

  const steps = document.querySelectorAll('.timeline-step');
  if (!steps.length) return;

  const barEl = document.getElementById('timeline-bar');
  const barRect = barEl.getBoundingClientRect();

  if (currentStageIndex === 0) {
    line.style.width = '0px';
    return;
  }

  const targetStep = steps[currentStageIndex];
  const targetRect = targetStep.getBoundingClientRect();
  const targetCenter = targetRect.left + targetRect.width / 2 - barRect.left;

  const firstStep = steps[0];
  const firstRect = firstStep.getBoundingClientRect();
  const firstCenter = firstRect.left + firstRect.width / 2 - barRect.left;

  line.style.width = (targetCenter - firstCenter) + 'px';
  line.style.left = firstCenter + 'px';
}

/** Navigate to a specific stage by index */
function goToStage(index) {
  currentStageIndex = Math.max(0, Math.min(index, STAGES.length - 1));
  renderTimeline();
  renderStageCard();
  updateNavControls();
  updateProgressBar();
  updateSuggestions();
}

/** Previous / Next navigation */
function prevStage() { if (currentStageIndex > 0) goToStage(currentStageIndex - 1); }
function nextStage() {
  if (currentStageIndex < STAGES.length - 1) {
    goToStage(currentStageIndex + 1);
  } else {
    goToStage(0); // "Start Over"
  }
}

/** Update the linear progress bar and counter */
function updateProgressBar() {
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text-bar');
  if (!fill || !text) return;

  const pct = ((currentStageIndex + 1) / STAGES.length) * 100;
  fill.style.width = pct + '%';

  const progressbar = document.getElementById('main-progressbar');
  if (progressbar) {
    progressbar.setAttribute('aria-valuenow', currentStageIndex + 1);
  }
}

/** Update nav button states and stage counter */
function updateNavControls() {
  const prevBtn  = document.getElementById('btn-prev');
  const nextBtn  = document.getElementById('btn-next');
  const counter  = document.getElementById('stage-counter');

  if (prevBtn) prevBtn.disabled = currentStageIndex === 0;
  if (nextBtn) {
    nextBtn.textContent = currentStageIndex === STAGES.length - 1
      ? '↺  Start Over'
      : 'Next Stage  →';
  }
  if (counter) counter.textContent = `Stage ${currentStageIndex + 1} of ${STAGES.length}`;
}

/** Scroll active step into view in the timeline */
function scrollActiveIntoView() {
  const active = document.querySelector('.timeline-step.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}
