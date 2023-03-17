var qrcode;

// check if document has loaded
document.addEventListener("DOMContentLoaded", function(){
    qrcode = new QRCode(document.getElementById("qrcode"));

    document.getElementById("qr-button").addEventListener("click", function() {
        console.log("Generating QR Code...");
        makeCode();
        console.log("QR Code Generated!");
    });
});

function makeCode() {
    qrcode.clear();

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let bday = document.getElementById("birthday").value;

    let jsonData = {
        name: name,
        age: age,
        gender: gender,
        bday: bday
    }

    let data = JSON.stringify(jsonData);

    console.log(data);

    qrcode.makeCode(data);

}
