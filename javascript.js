// JS extracted from original TICKETMASTER.html
// Bindings and behavior for the ticket carousel and transfer panels

// DOM Elements
const carousel = document.querySelector('.ticket-carousel');
const transferPanel = document.getElementById('transferPanel');
const transferNextPanel = document.getElementById('transferNextPanel');
const manualFormPanel = document.getElementById('manualFormPanel');
const seatRowDisplay = document.querySelector('.section-row');
const seatsContainer = document.querySelector('.seats');
const countDisplay = document.querySelector('.transfer-footer .count');
const closeTransferBtn = document.getElementById('closeTransferBtn');
const transferBtnBottom = document.querySelector('.btn.transfer');
const transferFinalBtn = document.getElementById('transferBtn');
const actionsBar = document.getElementById('actionsBar');
const transferFooter = document.querySelector('.transfer-footer');

let selectedSeats = [];

// Scroll Dot Tracking
function setupCarouselScrollTracking() {
  const dots = document.querySelectorAll('.dot');
  if (!carousel || !dots.length) return;

  if (carousel.__dotScrollAttached) {
    carousel.removeEventListener('scroll', carousel.__dotScrollHandler);
  }

  const scrollHandler = () => {
    const card = carousel.querySelector('.ticket-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    const scrollLeft = carousel.scrollLeft;
    const index = Math.round(scrollLeft / cardWidth);
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  };

  carousel.__dotScrollHandler = scrollHandler;
  carousel.__dotScrollAttached = true;
  carousel.addEventListener('scroll', scrollHandler);
}

// Open Transfer Panel
function openTransferPanel() {
  const cards = document.querySelectorAll('.ticket-card');
  const seatList = Array.from(cards).map(card => card.dataset.seats);
  
  // Update section + row label
  const firstCard = cards[0];
  if (firstCard) {
    const sec = firstCard.dataset.sec || '-';
    const row = firstCard.dataset.row || '-';
    if (seatRowDisplay) {
      seatRowDisplay.textContent = `Sec ${sec}, Row ${row}`;
    }
  }

  // Update ticket count label
  const ticketCountLabel = document.querySelector('.seat-row .ticket-count');
  if (ticketCountLabel) {
    const label = seatList.length === 1 ? '◆ 1 Ticket' : `◆ ${seatList.length} Tickets`;
    ticketCountLabel.textContent = label;
  }

  // Render seat buttons
  renderSeats(seatList);

  // Show the transfer panel
  transferPanel.classList.add('active');
  actionsBar?.classList.add('hidden');
  transferFooter.style.display = 'flex';
}

// Render Seats
function renderSeats(seatList) {
  seatsContainer.innerHTML = '';
  selectedSeats = [];

  seatList.forEach(seat => {
    const seatDiv = document.createElement('div');
    seatDiv.className = 'seat-btn';
    seatDiv.dataset.seat = seat;

    seatDiv.innerHTML = `<div class="seat-label">SEAT ${seat}</div>`;

    seatDiv.addEventListener('click', () => {
      seatDiv.classList.toggle('selected');
      const seatNum = seatDiv.dataset.seat;

      if (selectedSeats.includes(seatNum)) {
        selectedSeats = selectedSeats.filter(s => s !== seatNum);
      } else {
        selectedSeats.push(seatNum);
      }

      countDisplay.textContent = selectedSeats.length === 1 ? '1 selected' : `${selectedSeats.length} selected`;
    });

    seatsContainer.appendChild(seatDiv);
  });

  countDisplay.textContent = '0 selected';
}

// Close Transfer Panel
function closeTransfer() {
  transferPanel.classList.remove('active');
  transferNextPanel.classList.remove('active');
  manualFormPanel.style.transform = 'translateY(100%)';
  actionsBar?.classList.remove('hidden');
  transferFooter.style.display = 'none';
  selectedSeats = [];
}

// Close Transfer Next Panel
function closeTransferNext() {
  transferNextPanel.classList.remove('active');
  actionsBar?.classList.remove('hidden');
  selectedSeats = [];
}

// Go back to main transfer panel from next panel
function goBackToTransfer() {
  transferNextPanel.classList.remove('active');
  transferPanel.classList.add('active');
}

// Open Manual Form
function openManualForm() {
  transferNextPanel.classList.remove('active');
  manualFormPanel.style.transform = 'translateY(0%)';
  document.getElementById('selectedTicketCount').textContent = selectedSeats.length;
}

// Go back from manual form to transfer next panel
function goBackFromManualForm() {
  manualFormPanel.style.transform = 'translateY(100%)';
  transferNextPanel.classList.add('active');
}

// Bind Interactive Buttons
function bindInteractiveButtons() {
  document.querySelectorAll('.view-ticket').forEach(btn => {
    btn.onclick = function () {
      console.log('View ticket clicked');
    };
  });
}

// Admin Panel Functions
function openAdmin() {
  const panel = document.getElementById('adminSlideUp');
  if (panel) {
    panel.classList.remove('hidden');
    panel.classList.add('active');
  }
}

function closeAdmin() {
  const panel = document.getElementById('adminSlideUp');
  if (panel) {
    panel.classList.remove('active');
    panel.classList.add('hidden');
  }
}

// Generate Seat Inputs Based on Ticket Count
function renderSeatInputs() {
  const count = parseInt(document.getElementById('ticketCountInput')?.value || '0', 10);
  const container = document.getElementById('seatInputsContainer');
  container.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const label = document.createElement('label');
    label.textContent = `Seat ${i}:`;
    label.style.marginTop = '10px';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `e.g. ${6 + i}`;
    input.id = `seatInput${i}`;
    input.style.marginBottom = '8px';
    input.className = 'seat-input';
    
    container.appendChild(label);
    container.appendChild(input);
  }
}

// Create Ticket Card Element
function createTicketCard(index, seat) {
  const card = document.createElement('div');
  card.className = 'ticket-card';
  card.dataset.seats = seat;

  card.innerHTML = `
    <div class="ticket-top-tip">
      <div class="ticket-label package-label">Package</div>
    </div>
    <div class="ticket-top">
      <div class="ticket-info">
        <div class="info-block"><div class="info-title">SEC</div><div class="info-value">-</div></div>
        <div class="info-block"><div class="info-title">ROW</div><div class="info-value">-</div></div>
        <div class="info-block"><div class="info-title">SEAT</div><div class="info-value">${seat}</div></div>
      </div>
    </div>
    <div class="ticket-image">
      <img src="https://via.placeholder.com/340x280/0074e4/white?text=Event+Image" alt="Event Image" />
      <div class="gradient-overlay"></div>
      <div class="overlay">
        <div class="event-title">Event Title</div>
        <div class="event-sub">Date • Venue</div>
      </div>
    </div>
    <div class="ticket-bottom">
      <div class="floor">FLOOR</div>
      <button class="view-ticket">
        <img src="scan.png" alt="QR Icon" class="icon" />
        View Ticket
      </button>
      <div class="ticket-details">Ticket Details</div>
    </div>
    <div class="ticket-bottom-line"></div>
  `;

  return card;
}

// Update Event Info
function updateEventInfo() {
  const title = document.getElementById('eventTitleInput')?.value.trim();
  const date = document.getElementById('eventDateInput')?.value.trim();
  const venue = document.getElementById('eventVenueInput')?.value.trim();
  const section = document.getElementById('eventSectionInput')?.value.trim();
  const row = document.getElementById('eventRowInput')?.value.trim();
  const floor = document.getElementById('eventFloorInput')?.value.trim();
  const packageName = document.getElementById('eventPackageInput')?.value.trim();
  const ticketCount = parseInt(document.getElementById('ticketCountInput')?.value || '0', 10);
  const imageInput = document.getElementById('eventImageInput');

  // Build seat list
  const seatList = [];
  for (let i = 1; i <= ticketCount; i++) {
    const seatVal = document.getElementById(`seatInput${i}`)?.value.trim() || `${6 + i}`;
    seatList.push(seatVal);
  }

  if (!carousel) return;

  // Clear carousel and add left spacer
  carousel.innerHTML = '';
  const leftSpacer = document.createElement('div');
  leftSpacer.className = 'carousel-spacer';
  carousel.appendChild(leftSpacer);

  for (let i = 0; i < ticketCount; i++) {
    const seat = seatList[i];
    const card = createTicketCard(i + 1, seat);

    // Update visible ticket data
    if (title) card.querySelector('.event-title').textContent = title;
    if (date && venue) card.querySelector('.event-sub').textContent = `${date} • ${venue}`;
    if (floor) card.querySelector('.floor').textContent = floor;
    if (packageName) card.querySelector('.package-label').textContent = packageName;

    // Set correct data attributes
    if (section) card.setAttribute('data-sec', section);
    if (row) card.setAttribute('data-row', row);
    if (seat) card.setAttribute('data-seats', seat);

    // Update visible SEC, ROW, SEAT in card
    const infoValues = card.querySelectorAll('.info-block .info-value');
    if (infoValues.length >= 3) {
      if (section) infoValues[0].textContent = section;
      if (row) infoValues[1].textContent = row;
      if (seat) infoValues[2].textContent = seat;
    }

    // Handle image upload
    if (imageInput?.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = card.querySelector('.ticket-image img');
        if (img) img.src = e.target.result;
      };
      reader.readAsDataURL(imageInput.files[0]);
    }

    carousel.appendChild(card);
  }

  // Right spacer
  const rightSpacer = document.createElement('div');
  rightSpacer.className = 'carousel-spacer';
  carousel.appendChild(rightSpacer);

  // Update scroll dots
  const dotsContainer = document.querySelector('.dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < ticketCount; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    }
  }

  // Rebind click events
  bindInteractiveButtons();

  // Update ticket count
  updateTicketCount();

  // Re-enable scroll tracking
  setupCarouselScrollTracking();

  // Close admin panel
  closeAdmin();
}

// Update Ticket Count
function updateTicketCount() {
  const cards = document.querySelectorAll('.ticket-card');
  const count = cards.length;
  const countSpan = document.getElementById('ticketCount');

  if (countSpan) {
    countSpan.textContent = count;
  }
}

// Go Back Function
function goBack() {
  console.log('Going back...');
}

// Validate and submit transfer form
function submitTransferForm() {
  const firstNameInput = document.getElementById('firstNameInput');
  const lastNameInput = document.getElementById('lastNameInput');
  const emailInput = document.getElementById('emailInput');
  
  // Validate inputs
  if (!firstNameInput.value.trim()) {
    alert('Please enter your first name');
    firstNameInput.focus();
    return;
  }
  
  if (!lastNameInput.value.trim()) {
    alert('Please enter your last name');
    lastNameInput.focus();
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
    alert('Please enter a valid email address');
    emailInput.focus();
    return;
  }
  
  // Show success modal
  showSuccessModal(emailInput.value, selectedSeats.length);
}

// Show transfer success modal
function showSuccessModal(email, ticketCount) {
  const modal = document.getElementById('transferSuccessModal');
  const countElement = document.getElementById('successTicketCount');
  const emailElement = document.getElementById('successEmail');
  
  countElement.textContent = ticketCount;
  emailElement.textContent = email;
  
  modal.classList.remove('hidden');
  
  // Auto-close after 4 seconds
  setTimeout(() => {
    closeSuccessModal();
  }, 4000);
}

// Close transfer success modal
function closeSuccessModal() {
  const modal = document.getElementById('transferSuccessModal');
  modal.classList.add('hidden');
  
  // Reset form and close panels
  document.getElementById('transferForm').reset();
  goBackFromManualForm();
  closeTransfer();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {

  updateTicketCount();
  setupCarouselScrollTracking();
  bindInteractiveButtons();

  // Transfer button event listeners
  if (transferFinalBtn) {
    transferFinalBtn.addEventListener('click', () => {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
      }
      // Go to transfer next panel
      transferPanel.classList.remove('active');
      transferNextPanel.classList.add('active');
      transferFooter.style.display = 'none';
    });
  }

  if (transferBtnBottom) {
    transferBtnBottom.addEventListener('click', openTransferPanel);
  }

  if (closeTransferBtn) {
    closeTransferBtn.addEventListener('click', closeTransfer);
  }
});

