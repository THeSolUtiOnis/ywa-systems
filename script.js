let timerInterval;
let pausedTime = null;

// =====================
// THIS IS A TEST TAKE IT LIGHTLY
// =====================
const rooms = {

  init: {
    title: "Initialization Chamber",
    text: "A mannequin is bolted into a metal frame. A blade rests beneath it.",
    companion: "This unit measures hesitation.",
    timer: 30,
    choices: [
      { text: "Examine keypad", next: "hallway" },
      { text: "Wait", next: "death_camera" },
      { text: "Touch mannequin", next: "init_touch", pauseTimer: true }
    ]
  },

  init_touch: {
    title: "Initialization Chamber",
    text: "The surface is cold. The eyes do not react.",
    companion: "Please don't.",
    choices: [
      { text: "Step back", next: "init", resumeTimer: true }
    ]
  },

  // =====================
  // TEST 2 — HALLWAY
  // =====================
  hallway: {
    title: "Compliance Corridor",
    text: "EXIT signs repeat endlessly. A figure stands down the hall.",
    companion: "The signs are decorative.",
    choices: [
      { text: "Follow the EXIT signs", next: "death_camera" },
      { text: "Walk toward the figure", next: "theater" },
      { text: "Stop and observe", next: "hallway_observe" }
    ]
  },

  hallway_observe: {
    title: "Compliance Corridor",
    text: "The body on the floor looks recent.",
    companion: "I failed this one.",
    choices: [
      { text: "Continue forward", next: "theater" }
    ]
  },

  // =====================
  // DEATH ROOM
  // =====================
  death_camera: {
    title: "Observation Terminated",
    text: "The camera continues recording.",
    companion: "Thank you for your participation.",
    choices: []
  },

  // =====================
  // NEXT ROOM PLACEHOLDER
  // =====================
  theater: {
    title: "Observation Theater",
    text: "Seats face a darkened glass wall.",
    companion: "This was my station.",
    choices: [
      { text: "Continue", next: "end_placeholder" }
    ]
  },

  end_placeholder: {
    title: "END OF TEST BUILD",
    text: "More rooms pending.",
    companion: "Outcome logged.",
    choices: []
  }
};

// =====================
// ENGINE (DON'T TOUCH)
// =====================
function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resumeTimer() {
  if (pausedTime !== null && pausedTime > 0) {
    startTimer(pausedTime);
  }
}

function loadRoom(key, choice) {
  const room = rooms[key];
  
  if (choice && choice.pauseTimer) {
    pauseTimer();
  } else if (choice && choice.resumeTimer) {
    resumeTimer();
    document.getElementById("roomTitle").textContent = room.title;
    document.getElementById("roomText").textContent = room.text;
    document.getElementById("companionText").textContent = room.companion;
    
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    
    room.choices.forEach(c => {
      const btn = document.createElement("button");
      btn.textContent = c.text;
      btn.onclick = () => loadRoom(c.next, c);
      choicesDiv.appendChild(btn);
    });
    return;
  } else {
    clearInterval(timerInterval);
    pausedTime = null;
    document.getElementById("timer").textContent = "";
  }

  document.getElementById("roomTitle").textContent = room.title;
  document.getElementById("roomText").textContent = room.text;
  document.getElementById("companionText").textContent = room.companion;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  room.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c.text;
    btn.onclick = () => loadRoom(c.next, c);
    choicesDiv.appendChild(btn);
  });

  if (room.timer) startTimer(room.timer);
}

function startTimer(seconds) {
  let time = seconds;
  pausedTime = null;
  document.getElementById("timer").textContent = "TIME: " + time;

  timerInterval = setInterval(() => {
    time--;
    pausedTime = time;
    document.getElementById("timer").textContent = "TIME: " + time;
    if (time <= 0) {
      clearInterval(timerInterval);
      loadRoom("death_camera");
    }
  }, 1000);
}

// =====================
// START GAME
// =====================
loadRoom("init");
