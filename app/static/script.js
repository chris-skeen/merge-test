// Creating checkbox for hourly.
const checkbox = document.createElement('input');
const ammountbox = document.getElementById('ammount-box')
const hourlyAmmountbox = document.getElementById('hourly-ammount-box')
checkbox.type = 'checkbox';  // Set it as a checkbox

checkbox.id = 'hourly';
checkbox.name = 'Hourly';

const label = document.createElement('label');
label.htmlFor = 'myCheckbox';
label.textContent = 'Hourly?'

const container = document.getElementById('checkbox-container');
container.appendChild(checkbox);
container.appendChild(label)

checkbox.addEventListener('change', function() {

  if (checkbox.checked) {
      ammountbox.style.display = 'none';
      hourlyAmmountbox.style.display = 'block';  // Hide the content
      ammountbox.value = ''
  } else {
      ammountbox.style.display = 'block'; // Show the content again
      hourlyAmmountbox.style.display = 'none';
      hourlyAmmountbox.value = ''
  }

});

