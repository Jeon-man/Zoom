const socket = io();

const welcome = document.getElementById("welcome");
const roomNameForm = welcome.querySelector("#roomName");
const nicknameFrom = welcome.querySelector("#name");

const room = document.getElementById("room");
room.hidden = true;

let roomName;

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");

  msgForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
      addMessage(`You : ${value}`);
    });
    input.value = "";
  });
}

roomNameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
});

nicknameFrom.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nicknameFrom.querySelector("input");
  socket.emit("nickname", input.value);
});

socket.on("welcome", (user) => {
  addMessage(`${user} join`);
});

socket.on("bye", (user) => {
  addMessage(`${user} left`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("#roomList");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(room);
  });
});
