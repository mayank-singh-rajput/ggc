// Countdown Timer
function startTimer(duration) {
  let timer = duration,
    minutes,
    seconds;

  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    document.getElementById("digit1").textContent = Math.floor(minutes / 10);
    document.getElementById("digit2").textContent = minutes % 10;
    document.getElementById("digit3").textContent = Math.floor(seconds / 10);
    document.getElementById("digit4").textContent = seconds % 10;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

window.onload = function () {
  startTimer(120); // Start the timer with a 2-minute countdown

  generateGrid("grid1", 80);
  generateGrid("grid2", 80);
  generateGrid("grid3", 80);
  generateGrid("grid4", 80);
  generateGrid("grid5", 80);
};

// Generate Lottery Grid with 7 numbers per row
function generateGrid(gridId, totalNumbers) {
  const grid = document.getElementById(gridId);
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(7, 1fr)";
  grid.style.gap = "5px";

  const ticketHeader = document
    .querySelector(`#${gridId}`)
    .closest(".ticket")
    .querySelector("h3");

  for (let i = 1; i <= totalNumbers; i++) {
    let numDiv = document.createElement("div");
    numDiv.textContent = i;
    numDiv.classList.add("grid-item");
    numDiv.dataset.number = i;

    numDiv.onclick = function () {
      if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        this.textContent = i;
        let selectedItems = grid.querySelectorAll(".selected");
        if (selectedItems.length === 0) {
          ticketHeader.classList.remove("selected-h3");
        }
      } else {
        this.classList.add("selected");
        this.textContent = "✗";
        ticketHeader.classList.add("selected-h3");
      }
    };

    grid.appendChild(numDiv);
  }
}

// Auto-selection Feature
document.getElementById("autoSelect").addEventListener("click", function () {
  let allGrids = document.querySelectorAll(".grid div");
  let ticketHeaders = document.querySelectorAll(".ticket h3");

  for (let i = 0; i < 5; i++) {
    ticketHeaders[i].classList.add("selected-h3");
    for (let j = 0; j < 10; j++) {
      let randIndex = Math.floor(Math.random() * allGrids.length);
      let gridItem = allGrids[randIndex];
      gridItem.classList.add("selected");
      gridItem.textContent = "✗";
    }
  }
});

// Select All
document.getElementById("allSelect").addEventListener("click", function () {
  let allGrids = document.querySelectorAll(".grid div");
  let ticketHeaders = document.querySelectorAll(".ticket h3");

  allGrids.forEach((gridItem) => {
    gridItem.classList.add("selected");
    gridItem.textContent = "✗";
  });

  ticketHeaders.forEach((header) => header.classList.add("selected-h3"));
});

// Delete Selection
document.getElementById("delete").addEventListener("click", function () {
  let selectedItems = document.querySelectorAll(".grid .selected");

  selectedItems.forEach((item) => {
    item.classList.remove("selected");
    item.textContent = item.dataset.number;
  });

  let ticketHeaders = document.querySelectorAll(".ticket h3");
  ticketHeaders.forEach((header) => header.classList.remove("selected-h3"));
});

// Function to format the date
function formatDate() {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const currentDate = new Date();
  return currentDate.toLocaleString("en-GB", options).replace(",", "");
}

const currentTime = formatDate();
document.getElementById("startTime").innerHTML = `
  <option value="${currentTime}">${currentTime}</option>
  <option value="${currentTime}">${currentTime}</option>
  <option value="${currentTime}">${currentTime}</option>
`;

// Function to open modal
function openModal(gridId) {
  const modal = document.getElementById("modal");
  if (modal.classList.contains("active")) {
    hideModal();
  } else {
    showModal(gridId);
  }
}

function showModal(gridId) {
  const modal = document.getElementById("modal");
  modal.classList.add("active");

  const modalTitle = document.getElementById("modalTitle");
  const modalGrid = document.getElementById("modalGrid");

  const ticketTitle =
    document.getElementById(gridId).previousElementSibling.innerText;
  const ticketBody = document.getElementById(gridId).innerHTML;

  modalTitle.innerHTML = ticketTitle;
  modalGrid.innerHTML = ticketBody;

  // Make the grid items in the modal selectable
  const modalGridItems = modalGrid.querySelectorAll(".grid-item");
  modalGridItems.forEach((item) => {
    item.onclick = function () {
      toggleSelectionInModal(item, gridId);
    };
  });
}

function hideModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const optionGrid = document.getElementById("optionGrid");

  for (let i = 1; i <= 10; i++) {
    const box = document.createElement("div");
    box.textContent = i;
    box.classList.add("option-item");
    optionGrid.appendChild(box);

    box.addEventListener("click", function () {
      const numSelected = parseInt(this.textContent);
      const selectedGrid = document.getElementById("modalGrid");

      const allGridItems = selectedGrid.querySelectorAll(".grid-item");
      const randomIndexes = getRandomIndexes(allGridItems.length, numSelected);

      randomIndexes.forEach((index) => {
        const randomItem = allGridItems[index];
        randomItem.classList.add("selected");
        randomItem.textContent = "✗";
      });
    });
  }
});

function getRandomIndexes(totalItems, numSelected) {
  const indexes = [];
  while (indexes.length < numSelected) {
    const randomIndex = Math.floor(Math.random() * totalItems);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }
  return indexes;
}

// Function to toggle selection in both modal and original grid
function toggleSelectionInModal(modalItem, gridId) {
  const originalGrid = document.getElementById(gridId);
  const originalGridItem = originalGrid.querySelector(
    `.grid-item[data-number="${modalItem.textContent}"]`
  );

  if (modalItem.classList.contains("selected")) {
    modalItem.classList.remove("selected");
    modalItem.textContent = modalItem.dataset.number;
    originalGridItem.classList.remove("selected");
    originalGridItem.textContent = originalGridItem.dataset.number;
  } else {
    modalItem.classList.add("selected");
    modalItem.textContent = "✗";
    originalGridItem.classList.add("selected");
    originalGridItem.textContent = "✗";
  }
}

// Close modal button
document.getElementById("model-delete").addEventListener("click", hideModal);
