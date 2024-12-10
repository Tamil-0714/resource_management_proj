const loadProfileInfo = (data) => {
  const container = document.querySelector(".students-container");

  data.forEach((e) => {
    console.log("this is e", e);

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
    slButton.setAttribute("data-stdId", e.id);
    slButton.setAttribute("onclick", "handleReqInfo(this)");
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

const loadReqInfo = async (stdId, reqBox) => {
  reqBox.innerHTML = `<sl-icon name="x-lg" class="box-close-icon" onclick="closePopup(this)" aria-hidden="true" library="default"></sl-icon><div
                        class="div-hidder"
                        style="height: 30px; width: 100%"
                      ></div>`;
  try {
    const response = await fetch("http://localhost:8050/stdReqInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Inform backend that the body is JSON
      },
      body: JSON.stringify({ stdId }),
      credentials: "include",
    });
    if (response.ok) {
      const result = await response.json();
      const reqInfos = result.reqInfo;
      reqInfos.forEach((reqInfo) => {
        const dummy = `   <div class="full-box-container" data-reqStdId="${reqInfo.id}" data-reqId="${reqInfo.reqId}">
                        <div class="left-box-container">
                          <div class="left-top-container">
                            <h3>${reqInfo.id}, ${reqInfo.resourceName} - ${reqInfo.reqDate}</h3>
                          </div>
                          <div class="left-bottom-container">
                            <p>
                              ${reqInfo.reqReason}
                            </p>
                          </div>
                        </div>
                        <div class="right-box-container">
                          <div class="right-top-container">
                            <button class="approve-request">Approve</button>
                          </div>
                          <div class="right-bottom-container">
                            <button class="reject-request">Reject</button>
                          </div>
                        </div>
                  </div>`;
        reqBox.innerHTML += dummy;
      });
    } else {
      console.error("somewent wrong");
    }
  } catch (error) {
    console.error(error);
  }
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
      // document.querySelector(".request-info-box").innerHTML = `<div>hellow</div>`
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
