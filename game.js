// Game state
let state = {
  flicks: 0,
  activeSkin: 'ball',
  showShop: false,
  showHelp: false,
  currentMilestone: 0,
  nextMilestone: 100,
  skins: [
    { id: 'ball', name: 'Ball', icon: '⚽', unlocked: true },
    { id: 'star', name: 'Star', icon: '⭐', unlocked: false, requiredFlicks: 100 },
    { id: 'heart', name: 'Heart', icon: '❤️', unlocked: false, requiredFlicks: 250 },
    { id: 'smile', name: 'Smile', icon: '😊', unlocked: false, requiredFlicks: 500 },
    { id: 'moon', name: 'Moon', icon: '🌙', unlocked: false, requiredFlicks: 750 },
    { id: 'sun', name: 'Sun', icon: '☀️', unlocked: false, requiredFlicks: 1000 }
  ]
};

// DOM Elements
const ball = document.getElementById('ball');
const scoreValue = document.querySelector('.score-value');
const progressFill = document.querySelector('.progress-fill');
const shopButton = document.getElementById('shop-button');
const shopModal = document.getElementById('shop-modal');
const helpButton = document.getElementById('help-button');
const helpModal = document.getElementById('help-modal');
const skinsGrid = document.querySelector('.skins-grid');

// Ball movement
let isDragging = false;
let startPos = { x: 0, y: 0 };
let position = { x: 0, y: 0 };
let velocity = { x: 0, y: 0 };

// Initialize ball position
function initBall() {
  const gameArea = document.getElementById('game-area');
  position = {
    x: (gameArea.clientWidth - ball.clientWidth) / 2,
    y: (gameArea.clientHeight - ball.clientHeight) / 2
  };
  updateBallPosition();
}

// Update ball position
function updateBallPosition() {
  ball.style.left = `${position.x}px`;
  ball.style.top = `${position.y}px`;
}

// Ball animation loop
function animate() {
  if (velocity.x === 0 && velocity.y === 0) return;

  const gameArea = document.getElementById('game-area');
  const friction = 0.95;

  // Update position
  position.x += velocity.x;
  position.y += velocity.y;

  // Check boundaries
  const shopButtonRect = shopButton.getBoundingClientRect();
  const gameAreaRect = gameArea.getBoundingClientRect();

  if (position.x < 0) {
    position.x = 0;
    velocity.x = -velocity.x * 0.7;
    ball.classList.add('bounce');
  } else if (position.x > gameAreaRect.width - ball.clientWidth - shopButtonRect.width) {
    position.x = gameAreaRect.width - ball.clientWidth - shopButtonRect.width;
    velocity.x = -velocity.x * 0.7;
    ball.classList.add('bounce');
  }

  if (position.y < 0) {
    position.y = 0;
    velocity.y = -velocity.y * 0.7;
    ball.classList.add('bounce');
  } else if (position.y > gameAreaRect.height - ball.clientHeight) {
    position.y = gameAreaRect.height - ball.clientHeight;
    velocity.y = -velocity.y * 0.7;
    ball.classList.add('bounce');
  }

  // Apply friction
  velocity.x *= friction;
  velocity.y *= friction;

  // Stop if velocity is very small
  if (Math.abs(velocity.x) < 0.1) velocity.x = 0;
  if (Math.abs(velocity.y) < 0.1) velocity.y = 0;

  updateBallPosition();
  requestAnimationFrame(animate);
}

function updateGameState() {
  // Update score display
  scoreValue.textContent = state.flicks;

  // Calculate progress based on current flicks
  const progress = ((state.flicks - state.currentMilestone) / 
    (state.nextMilestone - state.currentMilestone)) * 100;
  
  progressFill.style.width = `${Math.min(100, progress)}%`; // Limit to 100%

  // Check if new skins are unlocked based on flicks
  state.skins.forEach(skin => {
    if (!skin.unlocked && skin.requiredFlicks <= state.flicks) {
      skin.unlocked = true;
      alert(`New skin unlocked: ${skin.name}!`);
    }
  });

  // Update milestones and progress bar values
  if (state.flicks >= state.nextMilestone) {
    state.currentMilestone = state.nextMilestone;
    state.nextMilestone += 100;

    // Update milestone text
    document.querySelector('.milestone-text').textContent = state.currentMilestone;
    document.querySelectorAll('.milestone-text')[1].textContent = state.nextMilestone;
  }
}

// Event Handlers
function handleStart(event) {
  if (state.showShop || state.showHelp) return;

  const touch = event.touches ? event.touches[0] : event;
  isDragging = true;
  ball.classList.add('grabbing');
  
  const ballRect = ball.getBoundingClientRect();
  startPos = {
    x: touch.clientX - ballRect.left,
    y: touch.clientY - ballRect.top
  };
  
  velocity = { x: 0, y: 0 };
}

function handleMove(event) {
  if (!isDragging || state.showShop || state.showHelp) return;

  const touch = event.touches ? event.touches[0] : event;
  const gameArea = document.getElementById('game-area');
  
  position = {
    x: Math.max(0, Math.min(gameArea.clientWidth - ball.clientWidth - shopButton.clientWidth,
      touch.clientX - startPos.x)),
    y: Math.max(0, Math.min(gameArea.clientHeight - ball.clientHeight,
      touch.clientY - startPos.y))
  };
  
  updateBallPosition();
}

function handleEnd(event) {
  if (!isDragging || state.showShop || state.showHelp) return;

  const touch = event.changedTouches ? event.changedTouches[0] : event;
  isDragging = false;
  ball.classList.remove('grabbing');

  const ballRect = ball.getBoundingClientRect();
  const endX = touch.clientX - ballRect.left;
  const endY = touch.clientY - ballRect.top;
  
  const dx = endX - startPos.x;
  const dy = endY - startPos.y;

  // Apply a smaller multiplier to make the flick feel smoother and more responsive
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    velocity = {
      x: dx * 0.05,  // Smaller multiplier for smoother flick
      y: dy * 0.05   // Smaller multiplier for smoother flick
    };

    // Increment flick count
    state.flicks++;

    // Save flick count to localStorage
    localStorage.setItem('flickCount', state.flicks);

    // Log the flick count for debugging
    console.log('Flick count:', state.flicks);

    // Update game state (score and progress bar)
    updateGameState();
    
    // Start ball animation
    animate();
  }
}






// Shop functions
function renderShop() {
  skinsGrid.innerHTML = '';
  state.skins.forEach(skin => {
    const skinElement = document.createElement('div');
    skinElement.className = `skin-item${skin.id === state.activeSkin ? ' active' : ''}${!skin.unlocked ? ' locked' : ''}`;
    
    if (skin.unlocked) {
      skinElement.onclick = () => {
        state.activeSkin = skin.id;
        ball.textContent = skin.icon;
        renderShop();
      };
    }
    
    skinElement.innerHTML = `
      <div class="skin-icon">${skin.icon}</div>
      <p class="skin-name">${skin.name}</p>
      ${!skin.unlocked ? `
        <p class="skin-requirement">
          ${skin.requiredFlicks} flicks required
          ${state.flicks < skin.requiredFlicks ? 
            `(${skin.requiredFlicks - state.flicks} more)` : ''}
        </p>
      ` : ''}
    `;
    
    skinsGrid.appendChild(skinElement);
  });
}

// Event Listeners
ball.addEventListener('mousedown', handleStart);
ball.addEventListener('touchstart', handleStart);

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove);

document.addEventListener('mouseup', handleEnd);
document.addEventListener('touchend', handleEnd);

shopButton.addEventListener('click', () => {
  state.showShop = true;
  shopModal.classList.remove('hidden');
  renderShop();
});

helpButton.addEventListener('click', () => {
  state.showHelp = true;
  helpModal.classList.remove('hidden');
});

// Close modals when clicking outside
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      state.showShop = false;
      state.showHelp = false;
      shopModal.classList.add('hidden');
      helpModal.classList.add('hidden');
    }
  });
});

document.querySelectorAll('.close-button').forEach(button => {
  button.addEventListener('click', () => {
    state.showShop = false;
    state.showHelp = false;
    shopModal.classList.add('hidden');
    helpModal.classList.add('hidden');
  });
});

// Prevent scrolling on mobile
document.addEventListener('touchmove', (e) => {
  if (e.target === ball || !isDragging) {
    e.preventDefault();
  }
}, { passive: false });

// Initialize
initBall();
ball.textContent = state.skins[0].icon;
console.log(scoreValue); // Should log the score element
console.log(progressFill); // Should log the progress bar element
// When the page loads, retrieve the flick count from localStorage
window.addEventListener('load', () => {
  // Check if there's a stored flick count in localStorage
  const storedFlickCount = localStorage.getItem('flickCount');

  // If a flick count is found, restore it
  if (storedFlickCount) {
    state.flicks = parseInt(storedFlickCount, 10);
    console.log('Restored flick count:', state.flicks);
  } else {
    state.flicks = 0; // Set to 0 if no flick count is found
  }

  // Optionally, update the display immediately
  updateGameState();
});
