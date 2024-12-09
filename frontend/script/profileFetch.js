const loadProfileInfo = (data) => {
  const container = document.querySelector(".students-container");

  data.forEach((e) => {
    const studentContainer = document.createElement("div");
    studentContainer.classList.add("student-container");

    const avatarWrapper = document.createElement("div");
    avatarWrapper.classList.add("avatar-wrapper");

    const avatar = document.createElement("sl-avatar");
    avatar.setAttribute("label", "User avatar");
    avatarWrapper.appendChild(avatar);

    const nameOtherWrapper = document.createElement("div");
    nameOtherWrapper.classList.add("name-other-wrapper");

    const name = document.createElement("h4");
    name.classList.add("std-name");
    name.textContent = e.stdName;

    const updateTime = document.createElement("p");
    updateTime.classList.add("update-time");
    updateTime.textContent = e.lastUpdate;

    nameOtherWrapper.appendChild(name);
    nameOtherWrapper.appendChild(updateTime);

    const requestInfoWrapper = document.createElement("div");
    requestInfoWrapper.classList.add("request-info-wrapper");

    const slPopup = document.createElement("sl-popup");
    slPopup.setAttribute("placement", "right");
    slPopup.setAttribute("skidding", "200");
    slPopup.setAttribute("distance", "2");

    const spanAnchor = document.createElement("span");
    spanAnchor.setAttribute("slot", "anchor");

    const slButton = document.createElement("sl-button");
    slButton.classList.add("requested-info-btn");
    slButton.setAttribute("onclick", "togglePopup(this)");
    slButton.textContent = "Request Info";

    spanAnchor.appendChild(slButton);

    const requestInfoBox = document.createElement("div");
    requestInfoBox.classList.add("box", "request-info-box");

    const slIcon = document.createElement("sl-icon");
    slIcon.setAttribute("name", "x-lg");
    slIcon.classList.add("box-close-icon");
    slIcon.setAttribute("onclick", "closePopup(this)");

    requestInfoBox.appendChild(slIcon);

    slPopup.appendChild(spanAnchor);
    slPopup.appendChild(requestInfoBox);

    requestInfoWrapper.appendChild(slPopup);

    studentContainer.appendChild(avatarWrapper);
    studentContainer.appendChild(nameOtherWrapper);
    studentContainer.appendChild(requestInfoWrapper);

    container.appendChild(studentContainer);
  });
};
async function fetchProfile() {
  try {
    const response = await fetch("http://localhost:8050/profile", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();

      console.log(result.stdData);
      loadProfileInfo(result.stdData);
    } else if (response.status === 401) {
      window.location.href = "/index.html"; //unauthorized
    } 
  } catch (error) {
    console.error("Error fetching profile:", error);
   
  }
}

document.getElementById("logout-button").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:8050/logout", {
      method: "POST",
      credentials: "include", // Include session cookies
    });

    if (response.ok) {
      window.location.href = "/index.html"; // Redirect to login after logout
    } else {
      alert("Error logging out");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
});

// Fetch profile information on page load
fetchProfile();
