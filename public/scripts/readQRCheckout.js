
let serverAddress = "https://192.168.1.7:3000/staff/checkout"

function onScanSuccess(decodedText, decodedResult) {
    html5QrcodeScanner.clear();
    fetch(serverAddress, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        body: JSON.stringify({text: decodedText})
    }).then((response) => {
        if(response.redirected){
            window.location.href = response.url;
        }
    })
    .catch((error) => {
        console.log('Error', error)
    });
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

  