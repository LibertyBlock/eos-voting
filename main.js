getProducers().then(checkLibertyBlock);

function checkLibertyBlock() {
    document.querySelector("input[value=libertylion1]").checked = true
    updateBPList();
}

function getEos() {
	var privateKey = document.getElementById('private-key').value;
	var config = {
		keyProvider: privateKey,
		httpEndpoint: "http://13.71.191.137:8889",
		broadcast: true,
		sign: true
	}
	return Eos.Testnet(config);
}

function getProducers() {
    var eos = getEos();
    var params = {
        json: true,
        scope: "eosio",
        code: "eosio",
        table: "producers", 
        limit: 200
    }
    var tbody = document.querySelector("#block-producers tbody");
    return eos.getTableRows(params).then(resp => {
        var sorted = resp.rows.sort((a,b) => Number(a.total_votes) > Number(b.total_votes) ? -1:1);
        sorted.map(prod => `<tr>
            <td><input type="checkbox" name="vote-prods" value="${prod.owner}"></td>
            <td>${prod.owner}</td>
            <td>${prettyNumber(prod.total_votes)}</td>
        </tr>`)
        .forEach(row => tbody.innerHTML += row);

        document.getElementsByName('vote-prods').forEach(e => {
            e.onclick = updateBPList;
        });

    });

}

function updateBPList() {
    var checked = []
    document.getElementsByName('vote-prods').forEach(function (prod) {
        if (prod.checked)
            checked.push(prod.value);
    });
    document.getElementById("my-bps").innerHTML = checked.join(', ');
}

function prettyNumber(num) {
    num = parseInt(parseInt(num) / 1e10 * 1.4);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function vote () {
    var eos = getEos();
    eos.transaction(tr => {
        tr.voteproducer("libertylion1", "", ["block21genic", "libertylion1"]);
    });
}

