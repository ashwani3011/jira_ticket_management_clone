let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let colors = ["pink", "green", "blue", "black"];

//ticket shorting
let allFiltersChildren = document.querySelectorAll(".filter div");

for (let i = 0; i < allFiltersChildren.length; i++) {
  allFiltersChildren[i].addEventListener("click", function (e) {
    let filterColor = e.currentTarget.classList[0];
    loadTasks(filterColor);
  });
}

let deleteBtn = document.querySelector(".delete");

let deleteMode = false;

//it will check AllTickets object exist or not if not it will create one

if (localStorage.getItem("AllTickets") == undefined) {
  let allTickets = {};

  allTickets = JSON.stringify(allTickets);

  localStorage.setItem("AllTickets", allTickets);
}

loadTasks();

deleteBtn.addEventListener("click", function (e) {
  if (e.currentTarget.classList.contains("delete-selected")) {
    e.currentTarget.classList.remove("delete-selected");
    deleteMode = false;
  } else {
    e.currentTarget.classList.add("delete-selected");
    deleteMode = true;
  }
});

addBtn.addEventListener("click", function () {
  //we have to close delete mode

  deleteBtn.classList.remove("delete-selected");
  deleteMode = false;
  // agar pahle se modal screen pe h to plus pe click karne pe naya modal na bane

  // let preModal = document.querySelector(".modal");
  // if (preModal != null) return;

  let div = document.createElement("div");
  div.classList.add("modal");

  div.innerHTML = `<div class="task-section">
  <div class="task-inner-container" contenteditable="true"></div>
</div>
<div class="modal-priority-section">
  <div class="priority-inner-container">
    <div class="modal-priority pink"></div>
    <div class="modal-priority green"></div>
    <div class="modal-priority blue"></div>
    <div class="modal-priority black selected"></div>
  </div>
</div>`;

  // by default ticket ka color black ho
  let ticketColor = "black";

  // jis priority ko select kare vo set ho jaye
  let allModalPriority = div.querySelectorAll(".modal-priority");
  for (let i = 0; i < allModalPriority.length; i++) {
    allModalPriority[i].addEventListener("click", function (e) {
      for (let j = 0; j < allModalPriority.length; j++) {
        allModalPriority[j].classList.remove("selected");
      }
      // ye color nikalega priority se
      e.currentTarget.classList.add("selected");
      ticketColor = e.currentTarget.classList[1];
    });
  }

  //  jab enter key pres ho tab ticket generate ho jaye
  let taskInnerConteainer = div.querySelector(".task-inner-container");
  taskInnerConteainer.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      //line 105 pe pahle ye tha ${e.currentTarget.innerText}
      //ticket color uppar se aa hi raha h but task niche tha so usko pale hi le aaye
      let id = uid();
      let task = e.currentTarget.innerText;

      // step1 => jobhi data hai localstorage use lekr aao

      let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

      // step2 => usko update kro

      let ticketObj = {
        color: ticketColor,
        taskValue: task,
      };

      allTickets[id] = ticketObj;

      // step3 => wapis updated object ko localstorage me save krdo
      localStorage.setItem("AllTickets", JSON.stringify(allTickets));

      let ticketDiv = document.createElement("div");
      ticketDiv.classList.add("ticket");

      ticketDiv.setAttribute("data-id", id);

      ticketDiv.innerHTML = ` <div data-id="${id}" class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">
          #${id}
        </div>
        <div data-id="${id}" class="actual-task" contenteditable="true">
          ${task}
        </div>`;

      let ticketColorDiv = ticketDiv.querySelector(".ticket-color");

      let actualTaskDiv = ticketDiv.querySelector(".actual-task");

      actualTaskDiv.addEventListener("input", function (e) {
        let updatedTask = e.currentTarget.innerText;

        //updating task in local storage

        let currTicketId = e.currentTarget.getAttribute("data-id");
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

        allTickets[currTicketId].taskValue = updatedTask;

        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
      });

      // changing ticket color to next color on click
      // let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
      ticketColorDiv.addEventListener("click", function (e) {
        //fetching id from ui for updating storage for color change
        let currTicketId = e.currentTarget.getAttribute("data-id");
        // index 1 pe humar color mil raha h class list me
        let currColor = e.currentTarget.classList[1];

        let index = -1;
        for (let i = 0; i < colors.length; i++) {
          if (colors[i] == currColor) index = i;
        }
        index++;
        index = index % 4;

        let newColor = colors[index];

        //1- all tickets lana ; 2- update krna ; 3- wapis save krna

        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

        allTickets[currTicketId].color = newColor;

        localStorage.setItem("AllTickets", JSON.stringify(allTickets));

        ticketColorDiv.classList.remove(currColor);
        ticketColorDiv.classList.add(newColor);
      });
      //deleting ticket
      ticketDiv.addEventListener("click", function (e) {
        if (deleteMode) {
          let currTicketId = e.currentTarget.getAttribute("data-id");

          e.currentTarget.remove();

          //deleting ticket object from data base
          let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

          delete allTickets[currTicketId];

          localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        }
      });

      grid.append(ticketDiv);

      div.remove();
    } else if (e.key == "Escape") {
      div.remove();
    }
  });
  body.append(div);
});

// Load task function which will load ui data from data base information after start (refresh/newtab/browser reopen)
// After creating ui will also attach the required event listener

function loadTasks(color) {
  //shorting ticket based on color
  let ticketsOnUi = document.querySelectorAll(".ticket");

  for (let i = 0; i < ticketsOnUi.length; i++) {
    ticketsOnUi[i].remove();
  }

  //1- fetch alltickets data

  let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

  //2- create ticket UI for each ticket obj
  //3- attach required listeners
  //4- add tickets in the grid section of ui

  for (x in allTickets) {
    let currTicketId = x;
    let singleTicketObj = allTickets[x]; //pink

    //passed color was black
    if (color) {
      if (color != singleTicketObj.color) continue;
    }

    let ticketDiv = document.createElement("div");
    ticketDiv.classList.add("ticket");

    ticketDiv.setAttribute("data-id", currTicketId);

    ticketDiv.innerHTML = ` <div data-id="${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
      <div class="ticket-id">
        #${currTicketId}
      </div>
      <div data-id="${currTicketId}" class="actual-task" contenteditable="true">
        ${singleTicketObj.taskValue}
      </div>`;

    let ticketColorDiv = ticketDiv.querySelector(".ticket-color");

    let actualTaskDiv = ticketDiv.querySelector(".actual-task");

    actualTaskDiv.addEventListener("input", function (e) {
      let updatedTask = e.currentTarget.innerText;

      let currTicketId = e.currentTarget.getAttribute("data-id");
      let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

      allTickets[currTicketId].taskValue = updatedTask;

      localStorage.setItem("AllTickets", JSON.stringify(allTickets));
    });

    ticketColorDiv.addEventListener("click", function (e) {
      // let colors = ["pink", "blue", "green", "black"];

      let currTicketId = e.currentTarget.getAttribute("data-id");

      let currColor = e.currentTarget.classList[1]; //green

      let index = -1;
      for (let i = 0; i < colors.length; i++) {
        if (colors[i] == currColor) index = i;
      }

      index++;
      index = index % 4;

      let newColor = colors[index];

      //1- all tickets lana ; 2- update krna ; 3- wapis save krna

      let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

      allTickets[currTicketId].color = newColor;

      localStorage.setItem("AllTickets", JSON.stringify(allTickets));

      ticketColorDiv.classList.remove(currColor);
      ticketColorDiv.classList.add(newColor);
    });

    ticketDiv.addEventListener("click", function (e) {
      if (deleteMode) {
        let currTicketId = e.currentTarget.getAttribute("data-id");

        e.currentTarget.remove();

        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

        delete allTickets[currTicketId];

        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
      }
    });

    grid.append(ticketDiv);
  }
}
