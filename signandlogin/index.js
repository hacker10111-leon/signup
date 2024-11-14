const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();


app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));


const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Add email field for login
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    address: { type: String },
    postcode: { type: String, required: true },
    phone: { type: String, required: true },
    nickname: { type: String, required: true },
    hometown: { type: String, required: true }
});

const Applicant = mongoose.model('Applicant', applicantSchema);


app.get('/signup', (req, res) => {
    res.render('signup'); // Renders the 'signup.ejs' page
});


app.post('/api/applicant', async (req, res) => {
    try {
        const { name, email, password, age, address, postcode, phone, nickname, hometown } = req.body;

         const hashedPassword = await bcrypt.hash(password, 10);

        const newApplicant = new Applicant({
            name,
            email,
            password: hashedPassword,
            age,
            address,
            postcode,
            phone,
            nickname,
            hometown
        });

        await newApplicant.save();

        res.status(200).json({
            success: true,
            message: 'Sign up successful. You can now log in.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});
app.get('/login', (req, res) => {
    const message = req.query.message || ''; // Retrieve any error message
    res.render('login', { message });
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
     
        const user = await Applicant.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
              return res.redirect('/dashboard');
        } else {
            return res.redirect('/login?message=Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.redirect('/login?message=An error occurred');
    }
});
app.get('/dashboard', async (req, res) => {
    try {
        const applicants = await Applicant.find();   const dailyCounts = {};
        applicants.forEach(applicant => {
            const date = new Date(applicant.createdAt).toISOString().split('T')[0]; // Assuming there's a `createdAt` field
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });
        const monthlyCounts = {};
        applicants.forEach(applicant => {
            const month = new Date(applicant.createdAt).toISOString().slice(0, 7); // YYYY-MM format
            monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        res.render('dashboard', { dailyCounts, monthlyCounts });
    } catch (error) {
        console.log('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});


mongoose.connect("mongodb://localhost:27017/Applications", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to the database");

        app.listen(3000, () => {
            console.log('The server is running at port 3000');
        });
    })
    .catch((error) => {
        console.log('Failed to connect to the database', error);
});
