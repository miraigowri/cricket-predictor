let players = [];
const playerInputs = document.getElementById("playerInputs");
const addPlayerBtn = document.getElementById("addPlayer");
const generateBtn = document.getElementById("generateTeams");

// Debug logs to help confirm elements are present and handlers attach
console.log('playerInputs element:', playerInputs);
console.log('addPlayerBtn element:', addPlayerBtn);
console.log('generateBtn element:', generateBtn);

addPlayerBtn.addEventListener("click", () => {
    console.log('Add Player clicked');
    const div = document.createElement("div");
    div.className = "playerInput";
    div.innerHTML = `
        <input type="text" placeholder="Player Name" class="name" required/>
        <input type="number" placeholder="Form (1-10)" class="form" min="1" max="10" required/>
        <input type="number" placeholder="Last Runs" class="runs" required/>
        <input type="number" placeholder="Wickets" class="wickets" required/>
    `;
    playerInputs.appendChild(div);
    console.log('Appended new player input. Current playerInputs children:', playerInputs.children.length);
})

generateBtn.addEventListener("click", () => {
    const allInputs = document.querySelectorAll(".playerInput");
    players = [];
    console.log('Generate clicked. Found player input blocks:', allInputs.length);
    allInputs.forEach(div => {
        const name = div.querySelector(".name").value;
    // parse numeric inputs and default to 0 when empty/invalid
    const form = parseFloat(div.querySelector(".form").value) || 0;
    const runs = parseFloat(div.querySelector(".runs").value) || 0;
    const wickets = parseFloat(div.querySelector(".wickets").value) || 0;
    const PL = Number((form * 0.4 + (runs * 0.3) + (wickets * 3)) || 0);
    if (name) players.push({name, form, runs, wickets, PL});
    });
    console.log('Collected players:', players);

    if (players.length < 6) {
        alert("Add at least 6 players!");
        return;
    }
    const teamSize = parseInt(document.getElementById("teamSize").value);
    const teams = generateTeams(players, teamSize);
    console.log('Generated teams (count):', teams.length, teams);
    localStorage.setItem('predictedTeams', JSON.stringify(teams));
    console.log('Saved teams to localStorage under key predictedTeams');
    window.location.href = "results.html";
});

function generateTeams(players, teamSize) {
    const teams = [];
    for (let i = 0; i < 20; i++) {
        const shuffled = [...players].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, teamSize).sort((a, b) => b.PL - a.PL);
        const captain = selected[0].name;
        const viceCaptain = selected[1]?.name || "";
        const totalPl = selected.reduce((sum, p) => sum + p.PL, 0);
        teams.push({players: selected, captain, viceCaptain, totalPl});
    }
    return teams.sort((a, b) => b.totalPl - a.totalPl);
}
