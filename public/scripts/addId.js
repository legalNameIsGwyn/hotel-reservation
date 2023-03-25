let frontIDInput = document.getElementById('frontID')
let backIDInput = document.getElementById('backID')

frontIDInput.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', function() {
        // Set the preview image source to the loaded image
        document.getElementById('frontImage').src = reader.result;
    });
    reader.readAsDataURL(file);
});
  
backIDInput.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', function() {
        // Set the preview image source to the loaded image
        document.getElementById('backImage').src = reader.result;
    });
    reader.readAsDataURL(file);
});