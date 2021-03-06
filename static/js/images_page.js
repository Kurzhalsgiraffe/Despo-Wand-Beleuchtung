const canvas = document.querySelector("canvas");
const delete_btn = document.querySelector("#delete-btn");
const edit_btn = document.querySelector("#edit-btn");
const apply_btn = document.querySelector("#apply-btn");
const first_frame_btn = document.querySelector("#first-frame-btn");
const fast_backwards_btn = document.querySelector("#fast-backwards-btn");
const prev_frame_btn = document.querySelector("#prev-frame-btn");
const next_frame_btn = document.querySelector("#next-frame-btn");
const last_frame_btn = document.querySelector("#last-frame-btn");
const fast_forwards_btn = document.querySelector("#fast-forwards-btn");
const frameNumber = document.getElementById("framenumber");
var canvasObject = new CanvasObject(canvas, FRAME_HEIGHT=800, FRAME_WIDTH=800, PIXEL_SIZE=100, colorArray=[]);
var currentPos = 1;

delete_btn.addEventListener("click", async () => await deleteColorArrayFromServer(currentPos));
edit_btn.addEventListener("click", editSavedColorArray);
apply_btn.addEventListener("click", async () => await applyColorArray(currentPos));
first_frame_btn.addEventListener("click", async () => await loadAndShow(null, "first"));
fast_backwards_btn.addEventListener("click", async () => await loadAndShow(currentPos, "fastbackwards"));
prev_frame_btn.addEventListener("click", async () => await loadAndShow(currentPos, "prev"));
next_frame_btn.addEventListener("click", async () => await loadAndShow(currentPos, "next"));
fast_forwards_btn.addEventListener("click", async () => await loadAndShow(currentPos, "fastforwards"));
last_frame_btn.addEventListener("click", async () => await loadAndShow(null, "last"));

async function loadAndShow(id=null, pos=null) {
    await canvasObject.loadColorArrayFromServer(id, pos);
    currentPos = canvasObject.currentPos;
    if (canvasObject.colorArray.length === 0) {
        canvasObject.initializeColorArray();
        frameNumber.textContent = "KEIN BILD";
    } else {
        frameNumber.textContent = "BILD " + currentPos;
    }
    canvasObject.drawColorArrayToCanvas();
    canvasObject.drawGrid();
}

async function applyColorArray(image_id) {
    let response = await fetch("/apply?image_id="+image_id, {
        method: "POST",
    });
    if (response.status != 200) {
        console.log("failed to apply colorArray");
    }
}

async function deleteColorArrayFromServer(id) {
    let response = await fetch("/delete/"+id, {
        method: "DELETE"
    });
    if (response.status == 200) {
        await loadAndShow(currentPos,"next")
    } else {
        console.log("failed to delete colorArray from server");
    }
}

function editSavedColorArray() {
    window.location.replace("/?id="+currentPos);
}

document.addEventListener("DOMContentLoaded", async function() {
    await loadAndShow(null, "first");
});