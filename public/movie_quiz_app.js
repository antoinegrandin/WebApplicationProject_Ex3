let api_key = "8a0abe2e1b2bb22bacda36f4bd0e1519";
let currentMovieId = "238";
let currentPersonId = "";
let quiz_area = document.getElementById('quiz');
let score = 0;
let isDuplicate = false
let answerList = [];

function movieInfo() {
  let url = "https://api.themoviedb.org/3/movie/" + currentMovieId + "?api_key=" + api_key;
  fetch(url).then(res => {
    return res.json()
  }).then(data => {
    console.log(data);
    showMovie(data);
    askingUserAboutPeople()
  }).catch(error => {
    console.log('Something went wrong.');
    console.log(error)
  });
}

function personInfo(personId) {
  let personUrl = "https://api.themoviedb.org/3/person/" + personId + "?api_key=" + api_key;
  fetch(personUrl).then(res => {
    return res.json()
  }).then(data => {
    console.log(data);
    showPerson(data);
    askingUserAboutMovie()
  }).catch(error => {
    console.log('Something went wrong.');
    console.log(error)
  });
}


function showMovie(data) {
  quiz_area.innerHTML = '';
  quiz_area.innerHTML += '<h2><a>' + data.original_title + '</a></h2>' +
    '<p>' + data.release_date + '</p>' +
    '<img src=https://image.tmdb.org/t/p/w500' + data.poster_path + '>';

}

function showPerson(data) {
  quiz_area.innerHTML = ''
  quiz_area.innerHTML += '<h2><a>' + data.name + '</a></h2>' +
    '<p>Born ' + data.birthday + '</p>' +
    '<img src=https://image.tmdb.org/t/p/w500' + data.profile_path + '>';
}

function directorQuiz() {
  let answer = document.getElementById("quiz_bar_director").value
  duplicateVerif(answer)
  if (isDuplicate == false) {
    let directorUrl = "https://api.themoviedb.org/3/movie/" + currentMovieId + "/credits?api_key=" + api_key;
    fetch(directorUrl).then(res => {
      return res.json()
    }).then(data => {
      console.log(data);
      let res = false
      for (var i = 0; i < data.crew.length; i++) {
        if (data.crew[i].name == answer && data.crew[i].job == "Director") {
          score += 1
          currentPersonId = data.crew[i].id
          personInfo(currentPersonId)
          res = true
        }
      }
      if (res == false) {
        endQuiz()
      }
    }).catch(error => {
      console.log('Something went wrong.');
      console.log(error)
    });
  }

}

function actorQuiz() {
  let answer = document.getElementById("quiz_bar_actor").value
  duplicateVerif(answer)
  if (isDuplicate == false) {
    let actorUrl = "https://api.themoviedb.org/3/movie/" + currentMovieId + "/credits?api_key=" + api_key;
    fetch(actorUrl).then(res => {
      return res.json()
    }).then(data => {
      console.log(data);
      let res = false
      for (var i = 0; i < data.cast.length; i++) {
        if (data.cast[i].name == answer) {
          score += 1
          currentPersonId = data.cast[i].id
          personInfo(currentPersonId)
          res = true
        }
      }
      if (res == false) {
        endQuiz()
      }
    }).catch(error => {
      console.log('Something went wrong.');
      console.log(error)
    });
  }
}

function movieQuiz() {
  let answer = document.getElementById("quiz_bar_movie").value
  duplicateVerif(answer)
  if (isDuplicate == false) {
    let movieUrl = "https://api.themoviedb.org/3/person/" + currentPersonId + "/movie_credits?api_key=" + api_key;
    fetch(movieUrl).then(res => {
      return res.json()
    }).then(data => {
      console.log(data);
      let res = false
      for (var i = 0; i < data.cast.length; i++) {
        if (data.cast[i].original_title == answer) {
          score += 1
          currentMovieId = data.cast[i].id
          movieInfo()
          res = true
        }
      }
      if (res == false) {
        for (var i = 0; i < data.crew.length; i++) {
          if (data.crew[i].original_title == answer) {
            score += 1
            currentMovieId = data.crew[i].id
            movieInfo()
            res = true
          }
        }
      }
      if (res == false) {
        endQuiz()
      }

    }).catch(error => {
      console.log('Something went wrong.');
      console.log(error)
    });
  }

}

function askingUserAboutPeople() {
  quiz_area.innerHTML += '<p>Your score is ' + score + '</p> <input type="search" id="quiz_bar_director" name="q">' +
    '<button id="director_btn" onclick="directorQuiz()">Director</button>' + ' | ' +
    '<input type="search" id="quiz_bar_actor" name="q">' +
    '<button id="actor_btn" onclick="actorQuiz()">Actor</button>';
}

function askingUserAboutMovie() {
  quiz_area.innerHTML += '<p>Your score is ' + score + '</p> <input type="search" id="quiz_bar_movie" name="q">' +
    '<button id="movie_btn" onclick="movieQuiz()">Movie</button>'
}

function wrongAnswerMessage() {
  quiz_area.innerHTML += '<p id="wrong">Wrong answer</p>'
}

function duplicateVerif(answer) {
  for (var i = 0; i <= answerList.length; i++) {
    if (answerList[i] == answer) {
      isDuplicate = true
      quiz_area.innerHTML = ''
      let end_area = document.getElementById('end')
      end_area.innerHTML = '<p>Duplicate answer, your final score is ' + score + '. Thanks for playing !</p>';
    }
  }
  if (isDuplicate == false) {
    answerList.push(answer)
  }

}
function endQuiz() {
  quiz_area.innerHTML = ''
  let end_area = document.getElementById('end')
  end_area.innerHTML = '<p>Wrong answer, your final score is ' + score + '. Thanks for playing !</p>';
}
