async function check_datas_lol(api_key){
    let player_name = document.getElementById("player-name").value;
    let summoner_id;

    await fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + player_name + "?api_key=" + api_key)
    .then(result => result.json())
    .then(data => {
        summoner_id = data.id;
        //console.log("data" , data);
    })
    .catch((e) =>{
        console.log("errore", e);
    })
    
    return summoner_id;
}

async function clash_info(summoner_id, api_key){
    let team_id;
    await fetch("https://euw1.api.riotgames.com/lol/clash/v1/players/by-summoner/" + summoner_id + "?api_key=" + api_key)
    .then(result => result.json())
    .then(data => {
        team_id = data[0].teamId;
    })

    return team_id;
}

async function display_players(team_id, api_key){
    let output = document.getElementById("information");
    let table = document.createElement("table");
    await fetch("https://euw1.api.riotgames.com/lol/clash/v1/teams/" + team_id + "?api_key=" + api_key)
    .then(result => result.json())
    .then(data => {
        for(let i = 0; i < 5; i++){
            let sum_id = data.players[i].summonerId;
            let pos = data.players[i].position;
            fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/" + sum_id + "?api_key=" + api_key)
            .then(result => result.json())
            .then(data => {
                let row = document.createElement("tr");
                let name_player = document.createElement("td");
                let position = document.createElement("td");

                name_player.innerHTML = data.name;
                position.innerHTML = pos;
                row.appendChild(name_player);
                row.appendChild(position);

                table.appendChild(row);
            })
        }
    })

    output.appendChild(table);
}

async function run_clash_script(){
    let output_html = document.getElementById("information");
    let api_key = document.getElementById("api-key").value;
    let summoner_id = await check_datas_lol(api_key);

    if(summoner_id != false){
        let team_id = await clash_info(summoner_id, api_key);

        await display_players(team_id, api_key);
    }
    else{
        output_html.innerHTML = "player name or api key wrong";
    }
}