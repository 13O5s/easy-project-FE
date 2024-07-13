const highScoreContainer = document.getElementById("high-score");
const clearData = document.getElementById("clear-data");
const data = JSON.parse(localStorage.getItem("highScores"));
function showData(){
    data.forEach(data => {
        let liTag = document.createElement("li");
        liTag.innerHTML = `<span>${data.name}</span><span>${data.score}</span>`;
        highScoreContainer.appendChild(liTag);
    })
}
showData();
clearData.addEventListener("click", () =>{
    localStorage.removeItem("highScores");
    highScoreContainer.innerHTML = "";
    alert("High scores have been cleared successfully");
});