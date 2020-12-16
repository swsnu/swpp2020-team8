"use strict";

setInterval(setAlarm, 1000 * 30);

chrome.browserAction.onClicked.addListener(goToInbox);

function getAdoorUrl() {
  return "https://adoor.world";
}

function isAdoorUrl(url) {
  return url.startsWith(getAdoorUrl());
}

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
                  setAlarm(tabs);
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

chrome.notifications.onButtonClicked.addListener(function () {
  goToInbox();
});

function setAlarm(event) {
  let name = localStorage.getItem("name");
  let alarm = localStorage.getItem("alarm");
  if (name === null && alarm === null) {
    localStorage.setItem("alarm", "nil");
    chrome.alarms.create({ delayInMinutes: 30 });
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "어도어(adoor)",
      message: "로그인 하고 노티 알림을 받아보세요",
      buttons: [{ title: "Check Notifications" }],
      priority: 0,
    });
    chrome.browserAction.setIcon({ path: "icon19-bnw.png" });
    chrome.browserAction.setBadgeBackgroundColor({
      color: [190, 190, 190, 230],
    });
    return;
  }
  $.ajax({
    type: "GET",
    url:
      "https://adoor.world/api/notifications/unread/?username=" +
      localStorage.getItem("name"),
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      if (localStorage.getItem("id") === null) {
        localStorage.id = JSON.stringify(data.id);
      }
      if (localStorage.getItem("id") < data.id && localStorage.alarm == "on") {
        chrome.alarms.create({ delayInMinutes: 1 });
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "어도어(adoor)",
          message: "새로운 노티가 도착했습니다.",
          buttons: [{ title: "Check Notifications" }],
          priority: 0,
        });
      }
      localStorage.setItem("id", JSON.stringify(data.id));
      localStorage.setItem("num_unread", data.num_unread);
      updateIcon();
    },
    error: function (e) {
      console.log(e);
      chrome.browserAction.setIcon({ path: "icon19-bnw.png" });
      chrome.browserAction.setBadgeBackgroundColor({
        color: [190, 190, 190, 230],
      });
    },
  });
}

function updateIcon() {
  let name = localStorage.getItem("name");
  let alarm = localStorage.getItem("alarm");
  if (name === null && alarm === null) {
    chrome.browserAction.setIcon({ path: "icon19-bnw.png" });
    chrome.browserAction.setBadgeBackgroundColor({
      color: [190, 190, 190, 230],
    });
    chrome.browserAction.setBadgeText({ text: "?" });
    localStorage.alarm = "nil";
    $("#alarm-on-off").prop("value", "로그인");
  } else {
    chrome.browserAction.setIcon({ path: "icon19.png" });
    chrome.browserAction.setBadgeBackgroundColor({ color: [241, 44, 86, 20] });
    chrome.browserAction.setBadgeText({ text: localStorage.num_unread });
    if (localStorage.getItem("alarm") == "on") {
      $("#alarm-on-off").prop("value", "알림 설정 끄기");
    } else if (localStorage.getItem("alarm") == "off") {
      $("#alarm-on-off").prop("value", "알림 설정 켜기");
    }
  }
}
