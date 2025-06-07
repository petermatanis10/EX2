// Submitted by: Peter Matanis, Raneen Mansour, Loai Matanis
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3002;

// חיבור למסד הנתונים
const db = new sqlite3.Database(path.join(__dirname, 'db', 'rtfilms.db'), (err) => {
    if (err) {
        console.error('❌ Error opening database: ' + err.message);
    } else {
        console.log('✅ Connected to the RTfilms SQLite database.');
    }
});

// קביעת EJS כתבנית התצוגה
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// קבצים סטטיים (CSS, תמונות)
app.use(express.static(path.join(__dirname, 'public')));

// דף הבית - ברירת מחדל לסרט PrincessBride
// app.get('/', (req, res) => {
//     res.redirect('/movie?title=PrincessBride');
// });

app.get("/",(req,res)=>{
    res.redirect("/movie.html")
}) 

// תצוגת סרט על פי פרמטר `title`
app.get('/movie', (req, res) => {
    const filmCode = req.query.title;
    console.log(filmCode)
    if (!filmCode) {
        return res.status(400).send("❌ Missing 'title' query parameter.");
    }

    console.log(`🔎 Fetching details for film: ${filmCode}`);

    // שאילתות לשליפת נתונים מהמסד
    const filmQuery = 'SELECT * FROM Films WHERE FilmCode = ?';
    const reviewsQuery = 'SELECT * FROM Reviews WHERE FilmCode = ?';
    const detailsQuery = 'SELECT * FROM FilmDetails WHERE FilmCode = ?';

    db.get(filmQuery, [filmCode], (err, film) => {
        if (err) {
            console.error("❌ Error retrieving film data: ", err.message);
            return res.status(500).send("Error retrieving film data.");
        }
        if (!film) {
            console.warn(`⚠️ Film not found: ${filmCode}`);
            return res.status(404).send("Film not found.");
        }

        db.all(reviewsQuery, [filmCode], (err, reviews) => {
            if (err) {
                console.error("❌ Error retrieving reviews: ", err.message);
                return res.status(500).send("Error retrieving reviews.");
            }

            db.all(detailsQuery, [filmCode], (err, details) => {
                if (err) {
                    console.error("❌ Error retrieving details: ", err.message);
                    return res.status(500).send("Error retrieving details.");
                }

                // עיבוד נתוני הסרט
                let filmDetails = {};
                details.forEach(detail => {
                    filmDetails[detail.Attribute] = detail.Value;
                });

                // בניית נתיב הפוסטר של הסרט
                const posterPath = `/${film.FilmCode}/poster.${film.PosterFormat || 'jpg'}`;

                console.log(`✅ Successfully retrieved data for ${film.Title}`);


                //ישן
                // הצגת העמוד עם הנתונים שהתקבלו מהמסד
                // res.render('movie', {
                //     film,
                //     reviews,
                //     filmDetails,
                //     posterPath
                // });


                //חדש   
                res.json({
                    film,
                    reviews,
                    filmDetails,
                    posterPath
                });

            });
        });
    });
});
// הפעלת השרת
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});