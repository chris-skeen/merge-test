document.addEventListener('DOMContentLoaded', () => {

  const checkbox = document.createElement('input');
  const ammountbox = document.getElementById('ammount-box')
  const hourlyAmmountbox = document.getElementById('hourly-ammount-box')
  checkbox.type = 'checkbox';  
  checkbox.id = 'hourly';
  checkbox.name = 'Hourly';

  const label = document.createElement('label');
  label.htmlFor = 'myCheckbox';
  label.textContent = ' Hourly? (Reclick to go back)';

  const container = document.getElementById('checkbox-container');
  container.appendChild(checkbox);
  container.appendChild(label)

  checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
        ammountbox.style.display = 'none';
        hourlyAmmountbox.style.display = 'block'; 
        ammountbox.value = ''
    } else {
        ammountbox.style.display = 'block'; 
        hourlyAmmountbox.style.display = 'none';
        hourlyAmmountbox.value = ''
    }
  });
});