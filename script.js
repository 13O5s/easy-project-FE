/*There are some differences between localStorage and sessionStorage
1) sessionStorage 
    + The data stored inside session storage is per-origin
    + THE DATA BE CLEARED WHILE CLOSE THE BROWSER TAB (OR WINDOW)
2) localStorage
    +) THE DATA WILL NOT BE CLEARED DURING A RELOAD OR REOPENING OF
    THE WEB PAGE OR EVENT CLOSE THE BROWSER TAB (OR WINDOW)
    +)The data inside localStorage will be cleared if the contents gets cleared
    through JS or clear catches of the browser */

// reading questions.json file
async function fetchQuestionAPI(API){ 
    try{
        const response = await fetch(API);
        const data = await response.json();
        return data;
    }
    catch(err){
        console.error(err);
    }
}




// DOM event
const startbtn = document.querySelector("#pre-quizz button");
const timer = document.querySelector('#timer');
const preQuizz = document.querySelector("#pre-quizz");
const quizz = document.querySelector("#quizz");
const question = document.querySelector("#question");
const options = document.querySelector(".answer-option");
const postQuizz = document.querySelector("#post-quizz");
const minusSpan = document.querySelector("#minus-time");
let nameInput = document.querySelector("#name");
let submit = document.querySelector("#submitBtn");
let questionJson;
// Value
let timeEl;
let currentQuestion = 0;
let time;
let minusTime = 10;

fetchQuestionAPI('question.json')
    .then(data => {
        questionJson = data;
        time = questionJson.length*10;
    })
startbtn.addEventListener("click", () =>{
    quizzStart();
});

function quizzStart(){
    preQuizz.classList.add("hide");
    quizz.classList.remove("hide");
    // set time count down
    setTimeCountDown();
        timeEl = setInterval(() =>{
            setTimeCountDown();
        }, 1000);
    getQuestion();
    // 

}

function setTimeCountDown()
{
    if(time <0)
        quizEnd();
    timer.innerText = time;
    time--;
}
function getQuestion()
{
    question.innerText = questionJson[currentQuestion].prompt;
    options.innerHTML ="";
    questionJson[currentQuestion].options.forEach( option =>{
        let op = document.createElement("li");
        let choiceBtn = document.createElement("button");
        choiceBtn.classList.add("btn", "choice");
        choiceBtn.textContent = option;
        op.appendChild(choiceBtn);
        options.appendChild(op);
        choiceBtn.addEventListener('click', choiceChecked);
    });
}
function choiceChecked(){
    if(this.innerText == questionJson[currentQuestion].answer)
    {
        this.classList.add("correct");
    }
    else{
        this.classList.add("wrong");
        time = time-minusTime;
        if(time < 0)
            time = 0;
        timer.innerText = time;
        minusSpan.innerText = minusTime;
        minusSpan.classList.add("hideTime");
    } 
    let choiceBtns = document.querySelectorAll(".choice");
    choiceBtns.forEach(choice => {
        choice.classList.add("banClick");
        if(choice.innerText == questionJson[currentQuestion].answer && choice.innerText != this.innerText)
            choice.classList.add("correct", "shake");
    })
    clearInterval(timeEl);
    timeEl =null;
    setTimeout(() =>{
        timeEl = setInterval(() =>{
            setTimeCountDown();
        }, 1000);
        currentQuestion++;
        if (
            currentQuestion ===
            questionJson.length
        ) {
            quizEnd();
        } else {
            getQuestion();
        }
    },500);
}

function quizEnd(){ 
    clearInterval(timeEl);
    quizz.classList.add("hide");
    postQuizz.classList.remove("hide");
    let score = Math.floor((time/questionJson.length)*100);
    document.querySelector("#score-final").innerText = score;
}

function checkEnter(e){
    if(e.key === "Enter"){
        saveHighScore();
        alert("Your socre has been saved successfully");
    }
}

function saveHighScore(){
    let score = Math.floor((time/questionJson.length)*100);
    let name = nameInput.value.trim();
    if(name !== ""){
        let scores = JSON.parse(localStorage.getItem("highScores")) || [];
        scores.push({name, score});
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);
        localStorage.setItem("highScores", JSON.stringify(scores));
        alert("Your socre has been saved successfully");
    }
}
nameInput.onkeyup = checkEnter;
submit.addEventListener("click", saveHighScore);