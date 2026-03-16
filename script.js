// แมปค่าเพื่อแสดงผล
const emojiMap = {
  rock: '✊ ค้อน',
  paper: '✋ กระดาษ',
  scissors: '✌️ กรรไกร'
};

// DOM
const choiceBtns = document.querySelectorAll('.choice-btn');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const resultTextEl = document.getElementById('resultText');
const resultBox = document.getElementById('resultBox');
const resetBtn = document.getElementById('resetBtn');
const changeModeBtn = document.getElementById('changeModeBtn');
const limitDisplay = document.getElementById('limitDisplay');

// ตัวแปรเก็บ state ของเกม
let playerScore = 0;
let computerScore = 0;
let winLimit = 5; // กำหนดจำนวนคะแนนที่ต้องชนะ

limitDisplay.textContent = winLimit;

// สุ่ม choice ของคอม
function computerChoice() {
  const choices = ['rock', 'paper', 'scissors'];
  const idx = Math.floor(Math.random() * choices.length);
  return choices[idx];
}

// ตัดสินผู้ชนะ
function decideWinner(player, computer) {
  if (player === computer) return 'tie';
  // แมปว่าผู้เล่นเลือกแต่ละตัวเลือกแล้วจะชนะอะไร (ไม่ใช้if+returnหลายเงื่อนไข เพราะเกิด complexity is 11 you must be kidding)
  const winMap = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };

  return winMap[player] === computer ? 'player' : 'computer';
}

// อัปเดตคะแนน
function updateScores() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

// แสดงผลหลังเล่นรอบหนึ่ง
function showRoundResult(player, comp, winner) {
  if (winner === 'tie') {
    resultTextEl.textContent = `เสมอ! คุณ: ${emojiMap[player]} — คอม: ${emojiMap[comp]}`;
  } else if (winner === 'player') {
    resultTextEl.textContent = `คุณชนะรอบนี้! คุณ: ${emojiMap[player]} ✅ — คอม: ${emojiMap[comp]}`;
    flash(resultBox);
  } else {
    resultTextEl.textContent = `คอมชนะรอบนี้! คุณ: ${emojiMap[player]} — คอม: ${emojiMap[comp]} ✅`;
    flash(resultBox);
  }

  updateScores();

  // เช็คว่าถึง winLimit หรือยัง
  if (playerScore >= winLimit || computerScore >= winLimit) {
    endGame();
  }
}

// แฟลชสั้นๆ เพิ่มและลบ class ออกหลัง 450ms
function flash(el) {
  el.classList.add('flash-win');
  setTimeout(() => el.classList.remove('flash-win'), 450);
}

// ประกาศผลเมื่อเกมจบ
function endGame() {
  if (playerScore > computerScore) {
    resultTextEl.textContent = `🎉 คุณชนะเกม! สกอร์ ${playerScore} : ${computerScore}`;
  } else if (computerScore > playerScore) {
    resultTextEl.textContent = `😞 คอมพิวเตอร์ชนะเกม! สกอร์ ${playerScore} : ${computerScore}`;
  } else {
    resultTextEl.textContent = `เสมอทั้งเกม! สกอร์ ${playerScore} : ${computerScore}`;
  }
  
  choiceBtns.forEach(b => b.disabled = true); // ปิดปุ่ม choice เพื่อหยุดเล่น
  resetBtn.classList.add('btn-primary'); // เปลี่ยนปุ่มรีเซ็ตให้เด่นขึ้นด้วย btn-primary
}

// รีเซ็ตเกม
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  updateScores();
  resultTextEl.textContent = 'เริ่มเล่นใหม่! เลือกสิ่งที่คุณต้องการ';
  choiceBtns.forEach(b => b.disabled = false); // เปิดปุ่ม choice เพื่อให้เล่นต่อได้
  resetBtn.classList.remove('btn-primary');
}

// เปลี่ยนโหมดเกม (winLimit)
function changeMode() {
  // เปลี่ยนค่าที่คุณต้องการได้โดยตรง — ในที่นี้สลับระหว่าง 3/5/7
  const modes = [3, 5, 7];
  const currIdx = modes.indexOf(winLimit);
  const next = modes[(currIdx + 1) % modes.length]; // ทุกครั้งที่กดปุ่ม → สลับไปโหมดถัดไป 
  winLimit = next;
  limitDisplay.textContent = winLimit;
  changeModeBtn.textContent = `เปลี่ยนโหมด: First to ${winLimit}`; // อัปเดตข้อความปุ่ม และรีเซ็ตเกมใหม่
  resetGame();
}

// เมื่อผู้เล่นกดปุ่มเลือก
function onPlayerChoice(ev) {   // รับevent(ev) ของปุ่มที่เรากด
  const player = ev.currentTarget.dataset.choice; // ดึงค่าจาก data-choice ในปุ่ม
  const comp = computerChoice(); // สุ่ม choice ของคอม
  const winner = decideWinner(player, comp); 

  if (winner === 'player') playerScore += 1;
  else if (winner === 'computer') computerScore += 1;

  showRoundResult(player, comp, winner);
}

// การผูกปุ่มกับฟังก์ชัน Event Binding
choiceBtns.forEach(btn => btn.addEventListener('click', onPlayerChoice));
resetBtn.addEventListener('click', resetGame);
changeModeBtn.addEventListener('click', changeMode);

// ตอนเปิดหน้าเว็บครั้งแรก → เรียก resetGame() เพื่อให้คะแนนเป็น 0-0 และข้อความเริ่มต้นแสดงว่า "เริ่มเล่นใหม่!"
resetGame();
