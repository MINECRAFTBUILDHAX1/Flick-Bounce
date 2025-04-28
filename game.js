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
    { id: 'sun', name: 'Sun', icon: '☀️', unlocked: false, requiredFlicks: 1000 },
    { id: 'rocket', name: 'Rocket', icon: '🚀', unlocked: false, requiredFlicks: 2000 },
  { id: 'gem', name: 'Gem', icon: '💎', unlocked: false, requiredFlicks: 3000 },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈', unlocked: false, requiredFlicks: 5000 },
  { id: 'dragon', name: 'Dragon', icon: '🐉', unlocked: false, requiredFlicks: 10000 },
  { id: 'unicorn', name: 'Unicorn', icon: '🦄', unlocked: false, requiredFlicks: 25000 },
  { id: 'phoenix', name: 'Phoenix', icon: '🔥', unlocked: false, requiredFlicks: 50000 },
  { id: 'galaxy', name: 'Galaxy', icon: '🌌', unlocked: false, requiredFlicks: 75000 },
  { id: 'lion', name: 'Lion', icon: '🦁', unlocked: false, requiredFlicks: 100000 },
  { id: 'butterfly', name: 'Butterfly', icon: '🦋', unlocked: false, requiredFlicks: 200000 },
  { id: 'tiger', name: 'Tiger', icon: '🐅', unlocked: false, requiredFlicks: 300000 },
  { id: 'knight', name: 'Knight', icon: '🛡️', unlocked: false, requiredFlicks: 500000 },
  { id: 'golden_star', name: 'Golden Star', icon: '🌟', unlocked: false, requiredFlicks: 750000 },
  { id: 'crown', name: 'Crown', icon: '👑', unlocked: false, requiredFlicks: 1000000 }
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
  const friction = 0.98;

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

  // Update milestones and progress bar values
  if (state.flicks >= state.nextMilestone) {
    state.currentMilestone = state.nextMilestone;
    state.nextMilestone += 100;

    // Update milestone text
    document.querySelector('.milestone-text').textContent = state.currentMilestone;
    document.querySelectorAll('.milestone-text')[1].textContent = state.nextMilestone;
  }

// Check for unlocking skins based on flicks and auto-equip
state.skins.forEach(skin => {
  if (!skin.unlocked && state.flicks >= skin.requiredFlicks) {
    skin.unlocked = true;
    state.activeSkin = skin.id; // 🚀 AUTO EQUIP
    console.log(`${skin.name} unlocked and equipped!`);
  }
});

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
  const flickMultiplier = 0.02; // Smaller multiplier for smoother flick
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    velocity = {
      x: dx * flickMultiplier,  // Reduced multiplier
      y: dy * flickMultiplier   // Reduced multiplier
    };

    // Limit the max velocity to prevent the ball from moving too fast
    const maxVelocity = 5;  // Max speed, can be adjusted for smoother results
    velocity.x = Math.max(Math.min(velocity.x, maxVelocity), -maxVelocity);
    velocity.y = Math.max(Math.min(velocity.y, maxVelocity), -maxVelocity);

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

// Check if the browser supports "Add to Home Screen" prompt
let deferredPrompt;
const addToHomeScreenButton = document.getElementById('add-to-home-screen');

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Save the event so it can be triggered later
  deferredPrompt = event;
  
  // Show the "Add to Home Screen" button
  addToHomeScreenButton.style.display = 'block';

  // When the user clicks the button, trigger the prompt
  addToHomeScreenButton.addEventListener('click', () => {
    // Hide the button
    addToHomeScreenButton.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user's response to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(`User response to the A2HS prompt: ${choiceResult.outcome}`);
      deferredPrompt = null; // Reset the prompt
    });
  });
});

// Optionally hide the "Add to Home Screen" button after the prompt has been used
window.addEventListener('appinstalled', (event) => {
  console.log('App successfully installed');
  addToHomeScreenButton.style.display = 'none';
});

 
