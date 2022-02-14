async function setRenderBackground() {
    //https://picsum.photos/200/300
    const result = await axios.get("https://picsum.photos/1280/720", {
        responseType: "blob"
    })
    console.log(result.data)
    const data = URL.createObjectURL(result.data)
    console.log(data)
    document.querySelector("body").style.backgroundImage = `url(${data})`
}
function setTime() {
    const timer = document.querySelector(".timer");
    setInterval(() => {
        const a = new Date();
        const hour = "0" + a.getHours();
        const minute = "0" + a.getMinutes();
        const second = "0" + a.getSeconds();
        timer.textContent = hour.slice(-2) + ":" + minute.slice(-2) + ":" + second.slice(-2);
        // timer.textContent = `${a.getHours()}:${a.getMinutes()}:${a.getSeconds()}`

    }, 1000);
};
function getMemo(value) {
    const memo = document.querySelector(".memo")
    const memovalue = localStorage.getItem("todo");
    memo.textContent = memovalue;
}
function setMemo() {
    const memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", function (e) {
        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.target.value)
            getMemo(e.target.value);
            memoInput.value = "";
        }
    })
}
function getPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}
function deleteMemo() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo");
            e.target.textContent = "";
        }
    })
}
async function getWeather(la, lo) {
    if (la && lo) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${la}&lon=${lo}&appid=2719e331e07a6af0547cfe7df2754c8c`)

        return data;
    }
    const data = await axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=2719e331e07a6af0547cfe7df2754c8c")
    return data;
}
async function renderWeather() {
    let la = "";
    let lo = "";
    try {
        const position = await getPosition();
        la = position.coords.latitude;
        lo = position.coords.longitude;
    } catch {

    }
    const result = await getWeather(la, lo);
    const weatherData = result.data;
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if (cur.dt_txt.indexOf("18:00:00") > 0) {
            acc.push(cur);
        }
        return acc;
    }, [])
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = weatherList.map((e) => {
        return weatherWrapperCompnent(e);
    }).join("")

}

function weatherWrapperCompnent(e) {
    console.log(e);
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1)
    return `
     <div class="card" style="width: 18rem;">
      <div class="card-header text-red text-center">
        ${e.dt_txt.split(" ")[0]}
      </div>  
      <div class="card-body">
        <h5>${e.weather[0].main}</h5>
        <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="...">
        <p class="card-text">${changeToCelsius(e.main.temp)}</p>
      </div>
    </div> 
    `
}

function matchIcon(wheatherData) {
    if (wheatherData === "Clear") return "./images/039-sun.png"
    if (wheatherData === "Clouds") return "./images/001-cloud.png"
    if (wheatherData === "Rain") return "./images/003-rainy.png"
    if (wheatherData === "Snow") return "./images/006-snowy.png"
    if (wheatherData === "Thunderstorm") return "./images/008-storm.png"
    if (wheatherData === "Drizzle") return "./images/031-snowflake.png"
    if (wheatherData === "Atomsphere") return "./images/033-hurricane.png"
}
function setContent() {
    const content = document.querySelector(".timer-content")
    if (new Date().getHours() <= 12) content.textContent = "Good mornig, Hyeong Seok";
    if (new Date().getHours() > 12) content.textContent = "Good evening, Hyeong Seok";
}
async function modalbutton() {
    const button = document.querySelector(".modal-button");
    let la = "";
    let lo = "";
    try {
        const position = await getPosition();
        la = position.coords.latitude;
        lo = position.coords.longitude;
    } catch {

    }
    const result = await getWeather(la, lo);
    const weatherData = result.data;
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if (cur.dt_txt.indexOf("18:00:00") > 0) {
            acc.push(cur);
        }
        return acc;
    }, [])

    const nowimg = matchIcon(weatherList[0].weather[0].main);
    console.log(nowimg)

    const img = new Image();
    img.src = nowimg;
    button.appendChild(img)
}
modalbutton();
setContent();
renderWeather();
getWeather();
deleteMemo();
getMemo();
setTime();
setMemo();
setRenderBackground();

setInterval(() => {
    setRenderBackground();
}, 5000)



