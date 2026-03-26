import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  deleteDoc, doc, updateDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔥 GANTI DENGAN CONFIG FIREBASE LO
const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "ISI_PROJECT.firebaseapp.com",
  projectId: "ISI_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔐 LOGIN
window.login = function() {
  const pass = document.getElementById("password").value;
  if (pass === "admin123") {
    document.getElementById("adminPanel").style.display = "block";
  } else {
    alert("Password salah!");
  }
};

// ➕ TAMBAH TIM
window.addTeam = async function() {
  const name = document.getElementById("teamName").value;
  const group = document.getElementById("group").value;

  await addDoc(collection(db, "teams"), {
    name,
    group,
    point: 0,
    main: 0,
    win: 0,
    lose: 0,
    goal: 0,
    conceded: 0,
    diff: 0
  });

  alert("Tim ditambahkan!");
};

// 📥 AMBIL DATA
async function getData() {
  const snapshot = await getDocs(collection(db, "teams"));
  let data = [];
  snapshot.forEach(docSnap => {
    data.push({ id: docSnap.id, ...docSnap.data() });
  });
  return data;
}

// ⚽ INPUT HASIL
window.addMatch = async function() {
  const t1 = document.getElementById("team1").value;
  const s1 = parseInt(document.getElementById("score1").value);
  const t2 = document.getElementById("team2").value;
  const s2 = parseInt(document.getElementById("score2").value);

  let data = await getData();

  let team1 = data.find(t => t.name === t1);
  let team2 = data.find(t => t.name === t2);

  if (!team1 || !team2) return alert("Tim tidak ditemukan!");

  team1.main++;
  team2.main++;

  team1.goal += s1;
  team1.conceded += s2;
  team2.goal += s2;
  team2.conceded += s1;

  team1.diff = team1.goal - team1.conceded;
  team2.diff = team2.goal - team2.conceded;

  if (s1 > s2) {
    team1.win++;
    team2.lose++;
    team1.point += 3;
  } else if (s2 > s1) {
    team2.win++;
    team1.lose++;
    team2.point += 3;
  }

  await updateDoc(doc(db, "teams", team1.id), team1);
  await updateDoc(doc(db, "teams", team2.id), team2);

  alert("Hasil disimpan!");
};

// ❌ HAPUS TIM
window.deleteTeam = async function() {
  const name = document.getElementById("deleteTeam").value;
  let data = await getData();
  let team = data.find(t => t.name === name);

  if (!team) return alert("Tim tidak ditemukan!");

  await deleteDoc(doc(db, "teams", team.id));
  alert("Tim dihapus!");
};

// 📊 RENDER TABEL
async function renderTable() {
  let data = await getData();

  let groupA = data.filter(t => t.group === "A");
  let groupB = data.filter(t => t.group === "B");

  groupA.sort((a,b) => b.point - a.point || b.diff - a.diff || b.goal - a.goal);
  groupB.sort((a,b) => b.point - a.point || b.diff - a.diff || b.goal - a.goal);

  function draw(id, group) {
    let html = `
    <tr>
    <th>Tim</th><th>M</th><th>W</th><th>L</th>
    <th>GM</th><th>GK</th><th>SG</th><th>Poin</th>
    </tr>`;

    group.forEach((t, i) => {
      let cls = i===0?"top1":i===1?"top2":i===2?"top3":"";
      html += `
      <tr class="${cls}">
        <td>${t.name}</td>
        <td>${t.main}</td>
        <td>${t.win}</td>
        <td>${t.lose}</td>
        <td>${t.goal}</td>
        <td>${t.conceded}</td>
        <td>${t.diff}</td>
        <td>${t.point}</td>
      </tr>`;
    });

    document.getElementById(id).innerHTML = html;
  }

  if (document.getElementById("groupA")) {
    draw("groupA", groupA);
    draw("groupB", groupB);
  }
}

// 🔥 REALTIME UPDATE
onSnapshot(collection(db, "teams"), () => {
  renderTable();
});

renderTable();
