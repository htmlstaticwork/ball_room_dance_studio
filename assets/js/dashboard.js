/* 1. Sidebar Nav */
const initSidebarNav = () => {
  const links = document.querySelectorAll('.sidebar-link[data-target]');
  const sections = document.querySelectorAll('.dashboard-section');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active link
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update active section
      const targetId = link.getAttribute('data-target');
      sections.forEach(sec => {
        if (sec.id === targetId) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });
      
      // On mobile, close sidebar after clicking a link
      if (window.innerWidth <= 1024) {
        document.querySelector('.dashboard-sidebar').classList.remove('open');
      }
    });
  });
  
  // Mobile sidebar toggle
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
};

/* 2. Calendar */
const initCalendar = () => {
  const calendarGrid = document.querySelector('.calendar-grid');
  if (!calendarGrid) return;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Header days
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  daysOfWeek.forEach(day => {
    const el = document.createElement('div');
    el.className = 'calendar-day-header';
    el.textContent = day;
    calendarGrid.appendChild(el);
  });

  // Empty slots for start of month
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    calendarGrid.appendChild(el);
  }

  // Days
  for (let i = 1; i <= daysInMonth; i++) {
    const el = document.createElement('div');
    el.className = 'calendar-day';
    el.textContent = i;
    
    if (i < today.getDate()) {
      el.classList.add('disabled');
    } else {
      el.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        updateBookingSummary('date', `${currentMonth + 1}/${i}/${currentYear}`);
      });
    }

    if (i === today.getDate()) {
      el.classList.add('selected');
      updateBookingSummary('date', `${currentMonth + 1}/${i}/${currentYear}`);
    }

    calendarGrid.appendChild(el);
  }
};

/* 3. Time Slots */
const initTimeSlots = () => {
  const slots = document.querySelectorAll('.time-slot');
  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      updateBookingSummary('time', slot.textContent);
    });
  });
};

/* 4. Instructor Selector */
const initInstructorSelector = () => {
  const cards = document.querySelectorAll('.instructor-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const name = card.querySelector('div h4').textContent;
      updateBookingSummary('instructor', name);
    });
  });
};

/* 5. Booking Summary */
const bookingData = {
  date: '',
  time: '',
  instructor: '',
  cost: '$120'
};

const updateBookingSummary = (key, value) => {
  bookingData[key] = value;
  
  const dateEl = document.getElementById('summary-date');
  const timeEl = document.getElementById('summary-time');
  const instEl = document.getElementById('summary-instructor');
  
  if (dateEl && bookingData.date) dateEl.textContent = bookingData.date;
  if (timeEl && bookingData.time) timeEl.textContent = bookingData.time;
  if (instEl && bookingData.instructor) instEl.textContent = bookingData.instructor;

  const btn = document.getElementById('confirm-booking-btn');
  if (btn) {
    if (bookingData.date && bookingData.time && bookingData.instructor) {
      btn.disabled = false;
      btn.classList.remove('disabled');
      btn.textContent = `Confirm Booking (${bookingData.cost})`;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    } else {
      btn.disabled = true;
      btn.textContent = 'Select all options';
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    }
  }
};

/* 6. Package Bars */
const initPackageBars = () => {
  const bars = document.querySelectorAll('.progress-bar');
  bars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-percentage');
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 500);
  });
};

/* 7. Event Registration */
const initEventRegistration = () => {
  const toggleBtns = document.querySelectorAll('.toggle-register');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.event-card');
      const badge = card.querySelector('.badge-registered');
      
      if (badge) {
        // Unregister
        badge.remove();
        btn.textContent = 'Register';
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
        card.setAttribute('data-status', 'upcoming');
      } else {
        // Register
        const newBadge = document.createElement('span');
        newBadge.className = 'badge-registered mb-2';
        newBadge.style.display = 'inline-block';
        newBadge.innerHTML = 'Registered <i class="fa-solid fa-check"></i>';
        
        const details = card.querySelector('.event-details');
        details.insertBefore(newBadge, details.firstChild);
        
        btn.textContent = 'Cancel';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
        card.setAttribute('data-status', 'registered');
      }
    });
  });
};

/* 8. Event Filters */
const initEventFilters = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const events = document.querySelectorAll('.event-card[data-status]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      events.forEach(event => {
        if (filter === 'all' || event.getAttribute('data-status') === filter) {
          event.style.display = 'flex';
        } else {
          event.style.display = 'none';
        }
      });
    });
  });
};

/* 9. Init */
document.addEventListener('DOMContentLoaded', () => {
  initSidebarNav();
  initCalendar();
  initTimeSlots();
  initInstructorSelector();
  initPackageBars();
  initEventRegistration();
  initEventFilters();
});
