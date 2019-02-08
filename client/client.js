const sourceURL = "http://ec2-54-84-149-116.compute-1.amazonaws.com:54062/topn/updates";
const source = new EventSource(sourceURL);
source.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data) {
        const tbl = document.getElementById("eventsTbl");
        tr = tbl.insertRow(1);
        const cell1 = tr.insertCell(0);
        const cell2 = tr.insertCell(1);
        const cell3 = tr.insertCell(2);
        const cell4 = tr.insertCell(3);
        cell1.innerHTML = data.name;
        cell2.innerHTML = data.nick;
        cell3.innerHTML = data.event;
        cell4.innerHTML = data.params;
    }
};
