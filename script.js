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
let questionJson;
// Value
let timeEl;
let currentQuestion = 0;
let time ;

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
        time = 0;
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
    console.log(this.innerText);
    if(this.innerText == questionJson[currentQuestion].answer)
    {
        this.classList.add("correct");
    }
    else{
        this.classList.add("wrong");
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
        getQuestion();
    },1000);
}


    