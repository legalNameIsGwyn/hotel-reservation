window.onload = function() {
    fetch('https://192.168.1.7:3000/staff/readQR', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: 'Hello server!'})
    })
}
function onScanSuccess(decodedText, decodedResult) {
    let dataDiv = document.getElementById("user-data");
    fetch('https://192.168.1.7:3000/staff/readQR', {
      method: 'POST',
      body: decodedText
    })
    html5QrcodeScanner.clear();
    dataDiv.textContent = decodedText
}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
}
  
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: {width: 250, height: 250} },
    /* verbose= */ false);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);

  