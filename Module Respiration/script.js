document.addEventListener("DOMContentLoaded", () => {
  const sounds = document.getElementsByName("sounds");
  const soundBtn = document.getElementById("soundBtn");
  const circle = document.querySelector(".circle");
  const startStopBtn = document.getElementById("startStopBtn");
  const advancedSettingsBtn = document.getElementById("advancedSettingsBtn");
  const advancedSettingsDialog = document.getElementById("advancedSettingsDialog");
  const closeDialogBtn = document.getElementById("closeDialogBtn");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");
  const inhaleSlider = document.getElementById("inhaleSlider");
  const holdSlider = document.getElementById("holdSlider");
  const exhaleSlider = document.getElementById("exhaleSlider");
  const endHoldSlider = document.getElementById("endHoldSlider");
  const actionTitle = document.getElementById("actionTitle");
  const informationBtn = document.getElementById("informationBtn");
  const informationModal = document.getElementById("informationModal");
  const closeInformationBtn = document.getElementById("closeInformationBtn");
  const informationContents = document.getElementsByName("informations");
  const labelRadiosBtn = document.getElementsByName("labelOptions");
  const preSettings = document.getElementById("preSettings");
  const modeTitle = document.getElementById("modeTitle");
  const actionDiv = document.getElementById("actionDiv");
  actionDiv.hidden = true;
  let isAnimating = false;
  let animationFrameRequest;
  let currentTiming = [4, 4, 4, 4];
  let currentOption = 0;
  let nameOptions = ["Équilibrer","Apaiser","Dynamique","Personnalisé"];
  labelRadiosBtn.forEach(btn => {
    btn.addEventListener("click", () => {
      currentOption = btn.getAttribute("data-options");
      if (btn.getAttribute("data-timing") !== null) {
        currentTiming = btn.getAttribute("data-timing").split("-");
      }
    })
  });

  const updateSliderValues = () => {
    document.getElementById("inhaleValue").textContent = inhaleSlider.value + 's';
    document.getElementById("holdValue").textContent = holdSlider.value + 's';
    document.getElementById("exhaleValue").textContent = exhaleSlider.value + 's';
    document.getElementById("endHoldValue").textContent = endHoldSlider.value + 's';
  }

  informationBtn.addEventListener("click", () => {
    if (!isAnimating) {
      fetch("data.json")
      .then((response) => response.json())
      .then((json) => {
        informationContents[0].innerHTML = json[currentOption].name;
        if (json[currentOption].name == "Personnalisé") {
          informationContents[1].innerHTML = currentTiming[0] + "s - " +
          currentTiming[1] + "s - " + currentTiming[2] + "s - " + currentTiming[3] + "s";
        } else {
          informationContents[1].innerHTML = json[currentOption].timing;
        }
        informationContents[2].innerHTML = json[currentOption].description;
        informationModal.showModal();
      });
    }
  });

  closeInformationBtn.addEventListener("click", () => {
    informationModal.close();
  });

  advancedSettingsBtn.addEventListener("click", () => {
    if (!isAnimating) {
      advancedSettingsDialog.showModal();
      updateSliderValues();
    }
  });

  closeDialogBtn.addEventListener("click", () => {
    advancedSettingsDialog.close();
  });

  saveSettingsBtn.addEventListener("click", () => {
    currentTiming = [inhaleSlider.value, holdSlider.value, exhaleSlider.value, endHoldSlider.value];
    advancedSettingsDialog.close();
  });

  const startAnimation = (timing) => {
    let [inhale, hold, exhale, endHold] = timing.map(Number);
    let totalTime = inhale + hold + exhale + endHold;
    let elapsedTime = 0;
    let lastTimestamp = null;

    const animate = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }
      const delta = timestamp - lastTimestamp;
      elapsedTime += delta / 1000;
      let cycleTime = elapsedTime % totalTime;
      let scale = 1;
      if (cycleTime < inhale) {
        scale = 1 + (cycleTime / inhale) * (4 - 1);
        checkWhenActionChange("Inspirer");
        actionTitle.innerHTML = "Inspirer";
      } else if (cycleTime < inhale + hold) {
        scale = 4;
        checkWhenActionChange("Maintenir");
        actionTitle.innerHTML = "Maintenir";
      } else if (cycleTime < inhale + hold + exhale) {
        scale = 4 - ((cycleTime - inhale - hold) / exhale) * (3);
        checkWhenActionChange("Expirer");
        actionTitle.innerHTML = "Expirer";
      } else {
        checkWhenActionChange("Maintenir");
        actionTitle.innerHTML = "Maintenir";
      }
      circle.style.transform = `scale(${scale})`;
      lastTimestamp = timestamp;
      if (isAnimating) {
        animationFrameRequest = requestAnimationFrame(animate);
      }
    }
    isAnimating = true;
    animationFrameRequest = requestAnimationFrame(animate);
  }

  const checkWhenActionChange = (action) => {
    if (soundBtn.checked) {
      if (action != actionTitle.innerHTML) {
        switch(action) {
          case "Inspirer":
            sounds[0].play();
            break;
          case "Expirer":
            sounds[0].play();
            break;
          case "Maintenir":
            sounds[1].play();
            break;
        }
      }
    }
  }

  const stopAnimation = () => {
    isAnimating = false;
    if (animationFrameRequest) {
      cancelAnimationFrame(animationFrameRequest);
      animationFrameRequest = null;
    }
    circle.style.transform = "scale(1)";
    actionTitle.innerHTML = "";
  }

  startStopBtn.addEventListener("click", () => {
    if (isAnimating) {
      stopAnimation();
      startStopBtn.innerHTML = "Commencer";
      modeTitle.innerHTML = "";
      preSettings.hidden = false;
      actionDiv.hidden = true;
      startStopBtn.blur();
    } else {
      startAnimation(currentTiming);
      startStopBtn.innerHTML = "Arrêter";
      modeTitle.innerHTML = "Mode : " + nameOptions[currentOption];
      preSettings.hidden = true;
      actionDiv.hidden = false;
      startStopBtn.blur();
    }
  });
});

const updateSliderValue = (sliderId, outputId) => {
  var slider = document.getElementById(sliderId);
  var output = document.getElementById(outputId);
  output.textContent = slider.value + 's';
}