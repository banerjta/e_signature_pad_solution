import { profiles } from "./profiles/profile-list.js";

const canvasId = "canvas";
const modalId = "modal";
const connectButtonModalId = "open-interface-modal-button";
const connectButtonId = "connect-button";

const disconnectButtonId = "disconnect-button";
const deviceSpaceId = "device-space";
const canvasCssWidthToHeightRatio = 2;

export const signaturePadView = (function () {
  /**
   * load html component in the dom
   */
  async function loadHtml() {
    await fetch("signature-pad/templates/main.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the content into the container
        document.getElementById(deviceSpaceId).innerHTML = html;
      })
      .catch((error) => console.error("Error loading HTML:", error));
  }

  /**
   * load html component in the dom
   */
  async function loadModelsList(onSelect) {
    await fetch("signature-pad/templates/models-list.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the content into the container
        if (!document.getElementById("list-container")) {
          const listContainer = document.createElement("div");
          listContainer.id = "list-container";
          listContainer.innerHTML = html;

          const deviceContainer = document.getElementById(
            "signature-pad-space"
          );
          deviceContainer.insertAdjacentElement("afterbegin", listContainer);
        }
      })
      .then(() => {
        const dropDownContainer = document.getElementById("model-dropdown-div");
        const dropDownBody = document.createElement("div");
        dropDownBody.setAttribute("class", "dropdown-content");

        for (const profile of profiles) {
          let action = () => {
            // if (device.CONTROLLER != currentActiveController.CONTROLLER) {
            // currentActiveController.CONTROLLER?.destroy();
            // currentActiveController.CONTROLLER = device.CONTROLLER;
            document.getElementById("model-drop-down-title").textContent =
              profile.LABEL;
            console.log("view", profile);

            onSelect(profile);
            // showDevice(device.CONTROLLER);
            // }
          };

          const element = document.createElement("p");
          element.setAttribute("class", "dropdown-elements");
          element.textContent = profile.LABEL;
          element.addEventListener("click", action);
          dropDownBody.appendChild(element);
        }
        dropDownContainer.appendChild(dropDownBody);
      })
      .catch((error) => console.error("Error loading HTML:", error));
  }

  /**
   * bind functions to the buttons
   * @param {Function} connect
   * @param {Function} disconnect
   * @param {Function} clearCanvas
   * @param {Function} downloadImage
   */
  function bindControlButtons(connect, disconnect, clearCanvas, downloadImage) {
    document
      .getElementById(connectButtonModalId)
      .addEventListener("click", connect);

    // document.getElementById(connectButtonId).addEventListener("click", (e) => {
    //   hideModal();
    //   connect(getIntefaceType());
    // });

    document
      .getElementById(disconnectButtonId)
      .addEventListener("click", disconnect);
    document.getElementById(disconnectButtonId).disabled = true;

    document
      .getElementById("clear-button")
      .addEventListener("click", clearCanvas);

    document
      .getElementById("download-image-button")
      .addEventListener("click", downloadImage);

    initializeModal();
  }

  function getIntefaceType() {
    const radioButtons = document.getElementsByName("interface");

    for (let i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) return radioButtons[i].value;
    }
  }

  function connect(connectingMsg) {
    let connectButton = document.getElementById(connectButtonId);
    let connectInner = connectButton.innerHTML;
    connectButton.innerHTML = connectingMsg;
    connectButton.disabled = true;
    return connectInner;
  }

  function initializeModal() {
    let modal = document.getElementById(modalId);
    let span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
      hideModal();
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        hideModal();
      }
    };
  }

  function showModal() {
    let modal = document.getElementById(modalId);
    modal.style.display = "block";
  }

  function hideModal() {
    let modal = document.getElementById(modalId);
    modal.style.display = "none";
  }

  function disconnect(disconnectingMsg) {
    let disconnectButton = document.getElementById(disconnectButtonId);
    let disconnectInner = disconnectButton.innerHTML;
    disconnectButton.innerHTML = disconnectingMsg;
    disconnectButton.disabled = true;
    return disconnectInner;
  }

  function updateCanvasSize(canvasWidth, canvasHeight) {
    let maxWidth = 512;
    let maxHeight = 256;
    // let height = Math.ceil(
    //   Math.max(canvasWidth / canvasCssWidthToHeightRatio, canvasHeight)
    // );

    let canvas = document.getElementById(canvasId);
    // canvas.height = canvasHeight;
    // canvas.width = Math.ceil(height * canvasCssWidthToHeightRatio);
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    let ratio = Math.max(canvasWidth / maxWidth, canvasHeight / maxHeight);
    canvas.style.width = Math.ceil(canvasWidth / ratio) + "px";
    canvas.style.height = Math.ceil(canvasHeight / ratio) + "px";
  }

  function enableDisconnectButton() {
    document.getElementById(connectButtonId).disabled = true;
    document.getElementById(disconnectButtonId).disabled = false;
  }

  function enableConnectButton() {
    document.getElementById(connectButtonId).disabled = false;
    document.getElementById(disconnectButtonId).disabled = true;
  }

  function setConnectButtonInner(innerHtml) {
    document.getElementById(connectButtonId).innerHTML = innerHtml;
  }

  function setDisconnectButtonInner(innerHtml) {
    document.getElementById(disconnectButtonId).innerHTML = innerHtml;
  }

  /**
   * download a part of the canvas as image, parameters are the boundries of the area to be downloaded
   * @param {number} xStart
   * @param {number} yStart
   * @param {number} xEnd
   * @param {number} yEnd
   */
  function downloadImage(xStart, yStart, xEnd, yEnd) {
    let canvas = document.getElementById(canvasId);
    // make new canvas
    let rectangleCanvas = document.createElement("canvas");
    let rectangleContext = rectangleCanvas.getContext("2d");
    let width = xEnd - xStart + 1;
    let height = yEnd - yStart + 1;
    rectangleCanvas.width = width;
    rectangleCanvas.height = height;

    //copy the drawn part from old canvas to the new one
    rectangleContext.drawImage(
      canvas,
      xStart,
      yStart,
      width,
      height,
      0,
      0,
      width,
      height
    );
    // set a link and download it
    let dataUrl = rectangleCanvas.toDataURL("image/png");
    let link = document.createElement("a");
    link.href = dataUrl;
    link.download = "signature.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function clearCanvas() {
    let canvas = document.getElementById(canvasId);
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * draw a line on the canvas
   * @param {number} lineWidth
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   */
  function canvasDrawLine(lineWidth, x, y, x2, y2) {
    let c = document.getElementById(canvasId);
    let ctx = c.getContext("2d");
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function clearDviceSpace() {
    document.getElementById(deviceSpaceId).innerHTML = "";
  }
  return {
    bindControlButtons,
    loadHtml,
    loadModelsList,
    connect,
    showModal,
    hideModal,
    getIntefaceType,
    disconnect,
    updateCanvasSize,
    enableDisconnectButton,
    enableConnectButton,
    setConnectButtonInner,
    setDisconnectButtonInner,
    downloadImage,
    clearCanvas,
    canvasDrawLine,
    clearDviceSpace,
  };
})();
