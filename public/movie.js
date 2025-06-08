let query = location.search
fetch("/movie"+query)
.then(data=>data.json())
.then(movies=>{
    let {film,filmDetails,posterPath,reviews} = movies
    let h1Title         = document.getElementById("title")
    let imageOverview   = document.getElementById("imageOverview")
    let movieInfoDl   = document.getElementById("movie-info-dl")
    let scoreImg        = document.getElementById("score-img")
    let rating          = document.getElementById("rating")
    let p1              = document.getElementById("p1")
    let p2              = document.getElementById("p2")
    let reviewLen       = document.getElementById("reviewLen")


    h1Title.innerHTML = film.Title+" "+film.Year ;
    imageOverview.src = `${film.FilmCode}/poster.png`

    if(filmDetails && typeof filmDetails == "object"){
        Object.entries(filmDetails).forEach(([key,value])=>{
            if(value){
                movieInfoDl.innerHTML += `<dt>${key.toUpperCase().replace(/_/g, ' ')} </dt>`
                if(key==="Links"){
                    movieInfoDl.innerHTML+=`
                        <dd class="links">
                            ${
                                value.split(',').map(link => {
                                    let parts = link.trim().split(': '); 
                                    if (parts.length === 2) {
                                        return `
                                            <span>${parts[0]}:</span>  
                                            <a href="${parts[1]}" target="_blank">${parts[1]}</a><br>
                                        `
                                    }else{
                                        return `<a href="${link.trim()}>" target="_blank">${link.trim()}</a><br>`
                                    } 
                                }) 
                            }
                        </dd>
                    `
                }
                else{
                    movieInfoDl.innerHTML+=`<dd>${value}</dd>`
                }
            }
        })
    }


    scoreImg.src = film.Score >= 60 ? '/freshbig.png' : '/rottenbig.png'
    rating.innerHTML += film.Score +"%";

    reviews.slice(0,Math.ceil(reviews.length/2)).forEach(review=>{
        p1.innerHTML += `
            <p class="review-box">
                <img src="${film.Score >= 60 ? '/fresh.gif' : '/rotten.gif'}" alt="Fresh">
                <q>${review.ReviewText}</q>
            </p>
            <p class="critic-info">
                <img src="/critic.gif" alt="Critic">
                ${review.ReviewerName} <br>
                ${review.Affiliation || 'Independent'}
            </p>
        `
    })

    reviews.slice(Math.ceil(reviews.length / 2)).forEach(review => {
        p2.innerHTML += `
            <p class="review-box">
                <img src="${film.Score >= 60 ? '/fresh.gif' : '/rotten.gif'}" alt="Fresh">
                <q>${review.ReviewText}</q>
            </p>
            <p class="critic-info">
                <img src="/critic.gif" alt="Critic">
                ${review.ReviewerName} <br>
                ${review.Affiliation || 'Independent'}
            </p>
        `
    })


    reviewLen.innerHTML = `${(1- reviews.length )} of  ${reviews.length}` 

})