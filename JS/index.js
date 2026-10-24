var contacts = JSON.parse(localStorage.getItem("savedContacts")) || [];
var favContacts = JSON.parse(localStorage.getItem("favContacts")) || [];
var emContacts = JSON.parse(localStorage.getItem("emContacts")) || [];
var favIndexes = JSON.parse(localStorage.getItem("favIndexes")) || [];
var emIndexes = JSON.parse(localStorage.getItem("emIndexes")) || [];
var favoriteCount = Number(localStorage.getItem("favCount")) || 0;
var emergencyCount = Number(localStorage.getItem("emCount")) || 0;
var editingIndex = -1;
var filtered = -1;
var validationInput = {
  nameReg: /^(?=.{2,50}$)[A-Za-z]+(?: [A-Za-z]+)*$/,
  phoneReg: /(\+20|002)?01[0125][0-9]{8}/,
  emailReg: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
};
var fnameInput = document.getElementById("fullName");
var phoneNum = document.getElementById("phoneNum");
var email = document.getElementById("email");
var address = document.getElementById("address");
var group = document.getElementById("group");
var notes = document.getElementById("notes");
var favoriteContact = document.getElementById("favoriteContact");
var emergencyContact = document.getElementById("emergencyContact");

function addContact() {
  if (isValid(fnameInput.value, phoneNum.value, email.value) == false) {
    return;
  }
  if (isDuplicatePhone(phoneNum.value)) {
    return;
  }

  var contact = {
    name: fnameInput.value,
    phone: phoneNum.value,
    email: email.value,
    address: address.value,
    group: group.value,
    notes: notes.value,
    favorite: favoriteContact.checked,
    emergency: emergencyContact.checked,
  };
  contacts.push(contact);
  if (favoriteContact.checked) {
    favoriteCount++;
    favIndexes.push(contacts.length - 1);
    favContacts.push(contacts[contacts.length - 1]);
  }
  if (emergencyContact.checked) {
    emergencyCount++;
    emIndexes.push(contacts.length - 1);
    emContacts.push(contacts[contacts.length - 1]);
  }
  document.getElementById("closeForm").click();

  display();
  Swal.fire({
    title: "Added!",
    text: "Contact has been added successfully!",
    icon: "success",
    timer: 1500,
    showConfirmButton: !1,
  });
}

function display(list = contacts) {
  if (filtered == -1) {
    document.getElementById("totalContacts").innerText = contacts.length;
    document.getElementById("favContacts").innerText = favoriteCount;
    document.getElementById("emergencyContacts").innerText = emergencyCount;
    document.getElementById("tContacts").innerText = contacts.length;
  }
  var contactsCard = "";
  list.map(function (contact, idx) {
    var emailDiv = "d-none";
    var addressDiv = "d-none";
    var familyGroup = "d-none";
    var friendsGroup = "d-none";
    var workGroup = "d-none";
    var schoolGroup = "d-none";
    var otherGroup = "d-none";
    var emergencyBadge = "d-none";
    var favoriteBadge = "d-none";
    if (contact.email != "") {
      emailDiv = "";
    }
    if (contact.address != "") {
      addressDiv = "";
    }
    if (contact.group != null) {
      switch (contact.group) {
        case "Family":
          familyGroup = "";
          break;
        case "Friends":
          friendsGroup = "";
          break;
        case "Work":
          workGroup = "";
          break;
        case "School":
          schoolGroup = "";
          break;
        case "Other":
          otherGroup = "";
          break;
      }
    }

    if (contact.favorite == true) {
      favoriteBadge = "";
    }
    if (contact.emergency == true) {
      emergencyBadge = "";
    }
    contactsCard += `
    <div class="col-md-6">
                  <div
                    class="card h-100 contact rounded-4 border-black border-opacity-10 overflow-hidden"
                  >
                    <div
                      class="card-header border-bottom-0 bg-body pt-3 d-flex flex-row gap-3"
                    >
                      <div
                        class="logo position-relative d-flex justify-content-center align-items-center rounded-3"
                      >
                        <span class="text-white text-uppercase fw-medium fs-5"
                          >${nameAcronymsFunction(contact.name)}</span
                        >
                        <div
                          class="favorite-logo bg-warning position-absolute border border-2 border-white rounded-5 d-flex justify-content-center align-items-center category ${favoriteBadge}"
                        >
                          <i
                            class="fa-solid fa-star"
                            style="color: rgb(255, 255, 255)"
                          ></i>
                        </div>
                        <div
                          class="emergency-logo position-absolute border border-2 border-white rounded-5 d-flex justify-content-center align-items-center category ${emergencyBadge}"
                        >
                          <i
                            class="fa-solid fa-heart-pulse"
                            style="color: rgb(255, 255, 255)"
                          ></i>
                        </div>
                      </div>
                      <div
                        class="contact-info d-flex flex-column justify-content-evenly"
                      >
                        <h6 class="fw-semibold mb-0">${contact.name}</h6>
                        <div class="phone-num d-flex align-items-center gap-2">
                          <div
                            class="tel-logo icon rounded-3 d-flex justify-content-center align-items-center"
                          >
                            <i
                              class="fa-solid fa-phone"
                              style="color: rgb(21, 93, 252)"
                            ></i>
                          </div>
                          <p class="mb-0 text-black-50">${contact.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div class="card-body py-2">
                      <div class="email d-flex align-items-center gap-2 ${emailDiv}">
                        <div
                          class="email-logo icon rounded-3 d-flex justify-content-center align-items-center"
                        >
                          <i
                            class="fa-solid fa-envelope"
                            style="color: rgb(127, 34, 254)"
                          ></i>
                        </div>
                        <p class="text-black-50 mb-0">
                          ${contact.email}
                        </p>
                      </div>
                      <div class="location d-flex align-items-center gap-2 ${addressDiv}">
                        <div
                          class="location-logo icon rounded-3 d-flex justify-content-center align-items-center"
                        >
                          <i
                            class="fa-solid fa-location-dot"
                            style="color: rgb(0, 153, 102)"
                          ></i>
                        </div>
                        <p class="text-black-50 mb-0">
                          ${contact.address}
                        </p>
                      </div>
                      <div class="badges d-flex gap-2 mt-2">
                        <span
                          class="rounded-1 px-2 py-1 bg-primary bg-opacity-10 text-primary fw-medium ${familyGroup}"
                          >Family</span
                        >
                        <span
                          class="rounded-1 px-2 py-1 bg-success bg-opacity-10 text-success fw-medium ${friendsGroup}"
                          >Friends</span
                        >
                        <span
                          class="rounded-1 px-2 py-1 fw-medium accent ${workGroup}"
                          >Work</span
                        >
                        <span
                          class="rounded-1 px-2 py-1 bg-warning bg-opacity-25 fw-medium amber ${schoolGroup}"
                          >School</span
                        >
                        <span
                          class="rounded-1 px-2 py-1 bg-secondary bg-opacity-10 fw-medium ${otherGroup}"
                          >Other</span
                        >
                        <span
                          class="rounded-1 px-2 py-1 bg-danger text-danger bg-opacity-10 ${emergencyBadge}"
                          id="emergency-badge"
                        >
                          <i class="fa-solid fa-heart-pulse"></i>
                          Emergency</span
                        >
                      </div>
                    </div>
                    <div
                      class="card-footer bg-body-tertiary border-top border-opacity-10"
                    >
                      <div class="buttons d-flex justify-content-between">
                        <div class="lft-div d-flex gap-2">
                          <button
                            class="tel-logo rounded-3 d-flex justify-content-center align-items-center border-0 icon"
                          >
                            <a href="tel:${contact.phone}">
                              <i
                                class="fa-solid fa-phone"
                                style="color: rgb(0, 153, 102)"
                              ></i>
                            </a>
                          </button>
                          <button
                            class="email-logo rounded-3 d-flex justify-content-center align-items-center border-0 icon ${emailDiv}"
                          >
                            <a href="mailto:${contact.email}">
                              <i
                                class="fa-solid fa-envelope"
                                style="color: rgb(127, 34, 254)"
                              ></i>
                            </a>
                          </button>
                        </div>
                        <div class="rght-div d-flex gap-2">
                          <button
                            class="favorite-logo rounded-3 d-flex justify-content-center align-items-center border-0 icon ${favoriteBadge ? "deactiveFav" : "text-warning"}"
                            onclick='favoriteContacts(${idx})'
                          >
                            <i class="fa-${favoriteBadge ? "regular" : "solid"} fa-star"></i>
                          </button>
                          <button
                            class="emergency-logo rounded-3 d-flex justify-content-center align-items-center border-0 icon ${emergencyBadge ? "deactiveEm" : ""}"
                            onclick='emergencyContacts(${idx})'
                          >
                            <i class="fa-${emergencyBadge ? "regular" : "solid"} fa-heart${emergencyBadge ? "" : "-pulse"}"></i>
                          </button>
                          <button
                            class="update-logo rounded-3 d-flex justify-content-center align-items-center border-0 icon"
                            onclick="openUpdateForm(${idx})"
                          >
                            <i class="fa-solid fa-pen"></i>
                          </button>
                          <button
                            class="delete-logo rounded-3 d-flex justify-content-center align-items-center border-0 icon"
                            onclick="deleteContact(${idx})"
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;
  });
  document.getElementById("contactsContainer").innerHTML = contactsCard;
  if (filtered == -1) {
    favCartona();
    emCartona();
    localStorage.setItem("savedContacts", JSON.stringify(contacts));
    localStorage.setItem("favContacts", JSON.stringify(favContacts));
    localStorage.setItem("emContacts", JSON.stringify(emContacts));
    localStorage.setItem("favIndexes", JSON.stringify(favIndexes));
    localStorage.setItem("emIndexes", JSON.stringify(emIndexes));
    localStorage.setItem("favCount", JSON.stringify(favoriteCount));
    localStorage.setItem("emCount", JSON.stringify(emergencyCount));
    resetForm();
  }
}
function favCartona() {
  var favContactsContainer = "";
  if (favoriteCount > 0) {
    favContacts.map(function (contact) {
      favContactsContainer += `<div
                      class="person favorite d-flex justify-content-between align-items-center rounded-3 px-3 py-2"
                    >
                      <div class="person-info d-flex align-items-center gap-2">
                        <div
                          class="logo d-flex justify-content-center align-items-center rounded-3"
                        >
                          <span class="text-white text-uppercase fw-medium"
                            >${nameAcronymsFunction(contact.name)}</span
                          >
                        </div>
                        <div class="d-flex flex-column justify-content-evenly w-auto">
                          <h6 class="fw-semibold mb-0">${contact.name}</h6>

                          <p class="mb-0 text-black-50">${contact.phone}</p>
                        </div>
                      </div>
                      <button
                        class="tel-logo rounded-3 d-flex justify-content-center align-items-center border-0 icon"
                      >
                        <a href="tel:${contact.phone}">
                          <i class="fa-solid fa-phone"></i>
                        </a>  
                      </button>
                    </div>`;
    });
    document.getElementById("favoriteContainer").innerHTML =
      favContactsContainer;
  } else {
    document.getElementById("favoriteContainer").innerHTML = `<div
        class="empty-div d-flex justify-content-center align-items-center"
        id="emptyFavContainer"
      >
        <p class="text-secondary text-opacity-75 mb-0 fw-medium">
          No favorites yet
        </p>
      </div>`;
  }
}
function emCartona() {
  var emContactsContainer = "";
  if (emergencyCount > 0) {
    emContacts.map(function (contact) {
      emContactsContainer += `<div
                      class="person emergency d-flex justify-content-between align-items-center rounded-3 px-3 py-2"
                    >
                      <div class="person-info d-flex align-items-center gap-2">
                        <div
                          class="logo d-flex justify-content-center align-items-center rounded-3"
                        >
                          <span class="text-white text-uppercase fw-medium"
                            >${nameAcronymsFunction(contact.name)}</span
                          >
                        </div>
                        <div class="d-flex flex-column justify-content-evenly">
                          <h6 class="fw-semibold mb-0">${contact.name}</h6>

                          <p class="mb-0 text-black-50">${contact.phone}</p>
                        </div>
                      </div>
                      <button
                        class="tel-logo rounded-3 d-flex justify-content-center align-items-center border-0 icon"
                      >
                        <a href="tel:${contact.phone}">
                          <i class="fa-solid fa-phone"></i>
                        </a>
                      </button>
                    </div>`;
    });
    document.getElementById("emergencyContainer").innerHTML =
      emContactsContainer;
  } else {
    document.getElementById("emergencyContainer").innerHTML = `<div
        class="empty-div d-flex justify-content-center align-items-center"
        id="emptyEmContainer"
      >
        <p class="text-secondary text-opacity-75 mb-0 fw-medium">
          No emergency contacts
        </p>
      </div>`;
  }
}

function favoriteContacts(index) {
  var exist = favIndexes.indexOf(index);
  if (exist > -1) {
    favIndexes.splice(exist, 1);
    favContacts.splice(exist, 1);
    contacts[index].favorite = false;
    favoriteCount--;
  } else {
    favIndexes.push(index);
    favContacts.push(contacts[index]);
    contacts[index].favorite = true;
    favoriteCount++;
  }
  display();
}

function emergencyContacts(index) {
  var exist = emIndexes.indexOf(index);
  if (exist > -1) {
    emIndexes.splice(exist, 1);
    emContacts.splice(exist, 1);
    contacts[index].emergency = false;
    emergencyCount--;
  } else {
    emIndexes.push(index);
    emContacts.push(contacts[index]);
    contacts[index].emergency = true;
    emergencyCount++;
  }
  display();
}

function isValidInput(input, id, reg) {
  if (validationInput[reg].test(input.value) || input.value == "")
    document.getElementById(id).classList.add("d-none");
  else document.getElementById(id).classList.remove("d-none");
}

function isValid(name, phone, email) {
  if (name == "") {
    Swal.fire({
      title: "Missing Name",
      text: "Please enter a name for the contact!",
      icon: "error",
      topLayer: true,
    });
    return false;
  }
  if (!validationInput.nameReg.test(name)) {
    Swal.fire({
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters).",
      icon: "error",
      topLayer: true,
    });
    return false;
  }
  if (phone == "") {
    Swal.fire({
      title: "Missing Phone",
      text: "Please enter a phone number!",
      icon: "error",
      topLayer: true,
    });
    return false;
  }
  if (!validationInput.phoneReg.test(phone)) {
    Swal.fire({
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678).",
      icon: "error",
      topLayer: true,
    });
    return false;
  }
  if (!validationInput.emailReg.test(email) && email != "") {
    Swal.fire({
      title: "Invalid Email",
      text: "Please enter a valid email address.",
      icon: "error",
      topLayer: true,
    });
    return false;
  }
  return true;
}

function isDuplicatePhone(phone, Index) {
  if (Index === undefined) Index = -1;
  for (var i = 0; i < contacts.length; i++) {
    if (i != Index && contacts[i].phone == phone) {
      Swal.fire({
        title: "Duplicate Phone Number",
        text:
          "A contact with this phone number already exists: " +
          contacts[i].name,
        icon: "error",
        topLayer: true,
      });
      return true;
    }
  }
  return false;
}

function openUpdateForm(index) {
  editingIndex = index;
  fullName.value = contacts[index].name;
  phoneNum.value = contacts[index].phone;
  email.value = contacts[index].email;
  address.value = contacts[index].address;
  group.value = contacts[index].group;
  notes.value = contacts[index].notes;
  favoriteContact.checked = contacts[index].favorite;
  emergencyContact.checked = contacts[index].emergency;

  document.getElementById("addbtn").classList.add("d-none");
  document.getElementById("updatebtn").classList.remove("d-none");
  document.querySelector(".dialog-title").innerText = "Edit Contact";

  document.getElementById("invokerDialog").showModal();
}
function nameAcronymsFunction(name) {
  var textName = name.split(" ");
  var nameAcronyms =
    textName.length == 1
      ? name.charAt(0)
      : name.charAt(0) + textName[textName.length - 1].charAt(0);
  return nameAcronyms;
}
function updateContact() {
  if (!isValid(fnameInput.value, phoneNum.value, email.value)) {
    return;
  }
  if (isDuplicatePhone(phoneNum.value, editingIndex)) {
    return;
  }
  var updatedContact = {
    name: fnameInput.value,
    phone: phoneNum.value,
    email: email.value,
    address: address.value,
    group: group.value,
    notes: notes.value,
    favorite: favoriteContact.checked,
    emergency: emergencyContact.checked,
  };
  contacts.splice(editingIndex, 1, updatedContact);

  var favoritePosition = favIndexes.indexOf(editingIndex);
  if (updatedContact.favorite && favoritePosition === -1) {
    favIndexes.push(editingIndex);
    favContacts.push(updatedContact);
  } else if (!updatedContact.favorite && favoritePosition !== -1) {
    favIndexes.splice(favoritePosition, 1);
    favContacts.splice(favoritePosition, 1);
  } else if (favoritePosition !== -1) {
    favContacts[favoritePosition] = updatedContact;
  }
  favoriteCount = favIndexes.length;

  var emergencyPosition = emIndexes.indexOf(editingIndex);
  if (updatedContact.emergency && emergencyPosition === -1) {
    emIndexes.push(editingIndex);
    emContacts.push(updatedContact);
  } else if (!updatedContact.emergency && emergencyPosition !== -1) {
    emIndexes.splice(emergencyPosition, 1);
    emContacts.splice(emergencyPosition, 1);
  } else if (emergencyPosition !== -1) {
    emContacts[emergencyPosition] = updatedContact;
  }
  emergencyCount = emIndexes.length;

  editingIndex = -1;
  document.getElementById("addbtn").classList.remove("d-none");
  document.getElementById("updatebtn").classList.add("d-none");
  document.querySelector(".dialog-title").innerText = "Add New Contact";
  document.getElementById("closeForm").click();
  display();
  Swal.fire({
    title: "Updated!",
    text: "Contact has been updated successfully!",
    icon: "success",
    timer: 1500,
    showConfirmButton: !1,
  });
}
function resetForm() {
  fullName.value = "";
  phoneNum.value = "";
  email.value = "";
  address.value = "";
  group.value = "";
  notes.value = "";
  favoriteContact.checked = false;
  emergencyContact.checked = false;
}
function search(input) {
  filtered = 1;
  var filteredContacts = contacts.filter(function (contact) {
    return contact.name.toLowerCase().includes(input.toLowerCase());
  });
  display(filteredContacts);
  filtered = -1;
}
function deleteContact(index) {
  // if contact is favorite
  var favIndex = favIndexes.indexOf(index);
  if (favIndex > -1) {
    favIndexes.splice(favIndex, 1);
    favContacts.splice(favIndex, 1);
    favoriteCount--;
  }

  // if contact is an emergency contact
  var emIndex = emIndexes.indexOf(index);
  if (emIndex > -1) {
    emIndexes.splice(emIndex, 1);
    emContacts.splice(emIndex, 1);
    emergencyCount--;
  }

  // Any indexes stored that are greater than deleted index must shift down by 1
  for (var i = 0; i < favIndexes.length; i++) {
    if (favIndexes[i] > index) {
      favIndexes[i]--;
    }
  }
  for (var i = 0; i < emIndexes.length; i++) {
    if (emIndexes[i] > index) {
      emIndexes[i]--;
    }
  }

  contacts.splice(index, 1);
  display();
}

display();
