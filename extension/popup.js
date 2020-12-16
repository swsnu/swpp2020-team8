"use strict";

document.getElementById("adoor_logo").onclick = goToInbox;

window.onload = function () {
  if (localStorage.getItem("alarm") === null) {
    localStorage.alarm == "nil";
    document.getElementById("alarm-on-off").value = "로그인";
  } else if (localStorage.alarm == "on") {
    document.getElementById("alarm-on-off").value = "알림 설정 끄기";
  } else if (localStorage.alarm == "nil") {
    document.getElementById("alarm-on-off").value = "로그인";
  } else {
    document.getElementById("alarm-on-off").value = "알림 설정 켜기";
  }
};

function getAdoorUrl() {
  return "https://adoor.world";
}

function isAdoorUrl(url) {
  return url.startsWith(getAdoorUrl());
}

chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.create({ url: getAdoorUrl() }, function (tab) {});
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.status === "complete" &&
    isAdoorUrl(tab.url)
  ) {
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      async function (tabs) {
        let code = `document.getElementsByClassName("hello-username")[0].innerText;`;
        let notFound = true;
        while (notFound) {
          chrome.tabs.executeScript(
            tabId,
            {
              code: code,
            },
            function (result) {
              if (result[0] === null) {
                console.log("waiting for load");
              } else {
                let name = localStorage.getItem("name");
                if (result !== name) {
                  console.log("username changed");
                }
                localStorage.setItem("name", result);
                notFound = false;
              }
            }
          );
          await new Promise((r) => setTimeout(r, 500));
        }
      }
    );
  }
});

function goToInbox() {
  console.log("알림 페이지로 이동 중...");
  let tabFound = false;
  chrome.tabs.getAllInWindow(undefined, function (tabs) {
    for (var i = 0, tab; (tab = tabs[i]); i++) {
      if (tab.url && isAdoorUrl(tab.url)) {
        console.log(
          "Found Adoor tab: " +
            tab.url +
            ". " +
            "Focusing and refreshing count..."
        );
        chrome.tabs.update(tab.id, {
          active: true,
          selected: true,
          url: getAdoorUrl(),
        });
        tabFound = true;
      }
    }
    if (!tabFound) {
      console.log("Could not find Adoor tab. Creating one...");
      chrome.tabs.create({ url: getAdoorUrl() });
    }
  });
}

var filters = {
  url: [{ urlContains: getAdoorUrl().replace(/^https?\:\/\//, "") }],
};

function onNavigate(details) {
  if (details.url && isAdoorUrl(details.url)) {
    console.log(
      "Recognized Adoor navigation to: " +
        details.url +
        "." +
        "Refreshing count..."
    );
  }
}

if (
  chrome.webNavigation &&
  chrome.webNavigation.onDOMContentLoaded &&
  chrome.webNavigation.onReferenceFragmentUpdated
) {
  chrome.webNavigation.onDOMContentLoaded.addListener(onNavigate, filters);
  chrome.webNavigation.onReferenceFragmentUpdated.addListener(
    onNavigate,
    filters
  );
} else {
  chrome.tabs.onUpdated.addListener(function (_, details) {
    onNavigate(details);
  });
}

document.getElementById("alarm-on-off").addEventListener("click", function () {
  if (localStorage.alarm == "on") {
    localStorage.alarm = "off";
    $("#alarm-on-off").prop("value", "알림 설정 켜기");
  } else if (localStorage.alarm == "off") {
    localStorage.alarm = "on";
    $("#alarm-on-off").prop("value", "알림 설정 끄기");
  } else {
    localStorage.setItem("alarm", "on");
    $("#alarm-on-off").prop("value", "알림 설정 끄기");
    goToInbox();
  }
});
