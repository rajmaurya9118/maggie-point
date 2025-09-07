// ======== Profile Dynamic Editing ========

// Edit Display Name
function editName() {
  const userInfo = document.querySelector('.user-info');
  const currentName = document.getElementById('displayName').innerText;

  userInfo.innerHTML = `
    <input type="text" id="nameInput" value="${currentName}" />
    <button class="save-btn" onclick="saveName()">Save</button>
    <button class="cancel-btn" onclick="cancelEditName('${currentName}')">Cancel</button>
  `;
}

function saveName() {
  const newName = document.getElementById('nameInput').value;
  const userInfo = document.querySelector('.user-info');
  userInfo.innerHTML = `
    <h2 id="displayName">${newName}</h2>
    <button class="edit-btn" onclick="editName()"><i class="fas fa-edit"></i> Edit Name</button>
  `;
}

function cancelEditName(oldName) {
  const userInfo = document.querySelector('.user-info');
  userInfo.innerHTML = `
    <h2 id="displayName">${oldName}</h2>
    <button class="edit-btn" onclick="editName()"><i class="fas fa-edit"></i> Edit Name</button>
  `;
}

// Edit Email
function editEmail() {
  const section = document.querySelector('#emailDisplay').parentElement;
  const currentEmail = document.getElementById('emailDisplay').innerText === "Not added" ? "" : document.getElementById('emailDisplay').innerText;

  section.innerHTML = `
    <div class="section-header"><i class="fas fa-envelope"></i><h3>Email</h3></div>
    <input type="email" id="emailInput" value="${currentEmail}" placeholder="Enter email"/>
    <button class="save-btn" onclick="saveEmail()">Save</button>
    <button class="cancel-btn" onclick="cancelEmail('${currentEmail}')">Cancel</button>
  `;
}

function saveEmail() {
  const newEmail = document.getElementById('emailInput').value || "Not added";
  const section = document.querySelector('.profile-section:nth-child(2)');
  section.innerHTML = `
    <div class="section-header"><i class="fas fa-envelope"></i><h3>Email</h3></div>
    <p id="emailDisplay">${newEmail}</p>
    <button class="edit-btn" onclick="editEmail()"><i class="fas fa-edit"></i> Add / Edit</button>
  `;
}

function cancelEmail(oldEmail) {
  const section = document.querySelector('.profile-section:nth-child(2)');
  const text = oldEmail || "Not added";
  section.innerHTML = `
    <div class="section-header"><i class="fas fa-envelope"></i><h3>Email</h3></div>
    <p id="emailDisplay">${text}</p>
    <button class="edit-btn" onclick="editEmail()"><i class="fas fa-edit"></i> Add / Edit</button>
  `;
}

// Edit Password
function editPassword() {
  const section = document.querySelector('.profile-section:nth-child(3)');
  section.innerHTML = `
    <div class="section-header"><i class="fas fa-lock"></i><h3>Password</h3></div>
    <input type="password" id="passwordInput" placeholder="Enter new password"/>
    <button class="save-btn" onclick="savePassword()">Save</button>
    <button class="cancel-btn" onclick="cancelPassword()">Cancel</button>
  `;
}

function savePassword() {
  const section = document.querySelector('.profile-section:nth-child(3)');
  section.innerHTML = `
    <div class="section-header"><i class="fas fa-lock"></i><h3>Password</h3></div>
    <p>••••••••</p>
    <button class="edit-btn" onclick="editPassword()"><i class="fas fa-key"></i> Update</button>
  `;
}

function cancelPassword() {
  savePassword(); // resets back
}

// Address Management
function addAddress() {
  const list = document.getElementById('addressList');
  if (list.children[0] && list.children[0].innerText === "No addresses added yet") {
    list.innerHTML = "";
  }
  const newLi = document.createElement('li');
  newLi.innerHTML = `
    <input type="text" placeholder="Enter address"/>
    <button class="save-btn" onclick="saveAddress(this)">Save</button>
    <button class="cancel-btn" onclick="cancelAddress(this)">Cancel</button>
  `;
  list.appendChild(newLi);
}

function saveAddress(btn) {
  const li = btn.parentElement;
  const address = li.querySelector('input').value;
  li.innerHTML = `
    ${address}
    <button onclick="deleteAddress(this)">Delete</button>
  `;
}

function cancelAddress(btn) {
  const li = btn.parentElement;
  li.remove();
  const list = document.getElementById('addressList');
  if (list.children.length === 0) {
    list.innerHTML = `<li>No addresses added yet</li>`;
  }
}

function deleteAddress(btn) {
  btn.parentElement.remove();
  const list = document.getElementById('addressList');
  if (list.children.length === 0) {
    list.innerHTML = `<li>No addresses added yet</li>`;
  }
}

// Profile Photo (basic demo)
function editProfilePhoto() {
  alert("Profile photo upload feature coming soon!");
}
