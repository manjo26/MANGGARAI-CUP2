const PASSWORD = "admin123";

// LOGIN
function login() {
  let pass = document.getElementById("password").value;
  if (pass === PASSWORD) {
    document.getElementById("adminPanel").style.display = "block";
  } else {
    alert("Password salah!");
  }
}

// AMBIL DATA
function getData() {
  return JSON.parse(localStorage.getItem("teams")) || [];
}

// SIMPAN DATA
function saveData(data) {
  localStorage.setItem("teams", JSON.stringify(data));
}

// TAMBAH TIM
function addTeam() {
  let name = document.getElementById("teamName").value;
  let group = document.getElementById("group").value;

  let data = getData();

  data.push({
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

  saveData(data);
  alert("Tim ditambahkan!");
}

// INPUT HASIL
function addMatch() {
  let t1 = document.getElementById("team1").value;
  let s1 = parseInt(document.getElementById("score1").value);
  let t2 = document.getElementById("team2").value;
  let s2 = parseInt(document.getElementById("score2").value);

  let data = getData();

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

  saveData(data);
  alert("Hasil disimpan!");
}

// HAPUS TIM
function deleteTeam() {
  let name = document.getElementById("deleteTeam").value;
  let data = getData();

  data = data.filter(t => t.name !== name);

  saveData(data);
  alert("Tim dihapus!");
}

// RENDER
function renderTable() {
  let data = getData();

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

renderTable();
