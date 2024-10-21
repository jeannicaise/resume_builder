require("dotenv").config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
});
const PORT = process.env.APP_PORT || 5001;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

db.connect((err) => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);

  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour des compétences et résumé :', err);

      return res.status(500).send('Erreur lors de l\'enregistrement');
    }
    res.status(201).send('Utilisateur enregistré avec succès');
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send('Utilisateur non trouvé');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    console.log(user);
    
    if (!isMatch) {
      return res.status(400).send('Mot de passe incorrect');
    }

    const token = jwt.sign({ id: user.user_id }, 'votre_secret_jwt', { expiresIn: '1h' });
    res.json({
      
        id: user.user_id, // Assure-toi que l'ID de l'utilisateur est renvoyé
        username: user.username,
        accessToken: token });
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'votre_secret_jwt', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


// / Routes pour les utilisateurs
app.post('/api/users',authenticateToken, (req, res) => {
    const user = req.body;
    db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ user_id: result.insertId, ...user });
    });
});

app.get('/api/resume/:user_id',authenticateToken, (req, res) => {
  const user_id = req.params.user_id;

  const query = `
  SELECT 
    u.user_id, 
    u.firstname, 
    u.lastname, 
    u.phone, 
    u.email, 
    u.linkedin, 
    u.github, 
    u.website, 
    u.address, 
    p.prof_id, 
    p.summary, 
    p.skills, 
    we.work_id, 
    we.company_name, 
    we.role, 
    we.start_date AS work_start_date, 
    we.end_date AS work_end_date, 
    we.description AS work_description, 
    e.edu_id, 
    e.institution_name, 
    e.degree, 
    e.start_date AS edu_start_date, 
    e.end_date AS edu_end_date, 
    c.cert_id, 
    c.cert_link, 
    c.cert_details
  FROM users u
  LEFT JOIN professional p ON u.user_id = p.user_id
  LEFT JOIN work_experience we ON u.user_id = we.user_id -- Correction ici
  LEFT JOIN education e ON u.user_id = e.user_id
  LEFT JOIN certifications c ON u.user_id = c.user_id
  WHERE u.user_id = ?;
`;


  db.query(query, [user_id], (error, results) => {
    if (error) {
      console.error('Erreur lors affichage données:', error); 
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' }); 
    }

    // Récupération des données de profil
    const profile = {
      user_id: results[0].user_id,
      firstname: results[0].firstname,
      lastname: results[0].lastname,
      phone: results[0].phone,
      email: results[0].email,
      linkedin: results[0].linkedin,
      github: results[0].github,
      website: results[0].website,
      address: results[0].address,
    };
    
    // Récupération des compétences
    const competence = {
      prof_id: results[0].prof_id,
      summary: results[0].summary,
      skills: results[0].skills,
    };
    
    // Élimination des doublons dans le tableau work
    const work = [...new Set(results.map(row => JSON.stringify({
      work_id: row.work_id,
      company_name: row.company_name,
      role: row.role,
      work_start_date: row.work_start_date,
      work_end_date: row.work_end_date,
      work_description: row.work_description,
    })))].map(item => JSON.parse(item));

    // Élimination des doublons dans le tableau education
    const education = [...new Set(results.map(row => JSON.stringify({
      edu_id: row.edu_id,
      institution_name: row.institution_name,
      degree: row.degree,
      edu_start_date: row.edu_start_date,
      edu_end_date: row.edu_end_date,
    })))].map(item => JSON.parse(item));

    // Retour des données sous forme de réponse JSON
    res.json({
      profile,
      competence,
      work,
      education
    });
  });
});



// Récupérer les informations du CV d'après l'ID


//Route pour modification 

//-----------------------1-route pour le profile

app.put('/resume/:user_id/profile', (req, res) => {
  const user_id = req.params.user_id;
  const { firstname, lastname, phone, email, linkedin, github, website, address } = req.body;

  const query = `
    UPDATE users 
    SET firstname = ?, lastname = ?, phone = ?, email = ?, linkedin = ?, github = ?, website = ?, address = ?
    WHERE user_id = ?`;
  
  db.query(query, [firstname, lastname, phone, email, linkedin, github, website, address, user_id], (err, result) => {
    if (err) {
      console.error('Erreur lors affichage données:', err); 

      return res.status(500).json({ error: 'Error updating profile' });
    }
    res.json({ message: 'Profile updated successfully!' });
  });
});


app.post('/resume/profile', (req, res) => {
  console.log(req.body);  
  const { firstname, lastname, phone, email, linkedin, github, website, address } = req.body;

  const query = `
    INSERT INTO users (firstname, lastname, phone, email, linkedin, github, website, address) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [firstname, lastname, phone, email, linkedin, github, website, address], (err, result) => {
    if (err) {
      console.error('Erreur lors de la création du profil:', err); 
      return res.status(500).json({ error: 'Erreur lors de la création du profil' });
    }
    res.status(201).json({ message: 'Profil créé avec succès!', userId: result.insertId });
  });
});


app.get('/resume/:user_id/profile', (req, res) => {
  const user_id = req.params.user_id;

  db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching profile data' });
    }
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  });
});



//-----------------------2-route pour summary et skills

// Route pour obtenir le résumé et les compétences d'un utilisateur spécifique
app.get('/api/resume/:user_id/competence',authenticateToken, (req, res) => {
  const user_id = req.params.user_id;

  const query = `
    SELECT summary, skills 
    FROM professional 
    WHERE user_id = ?
  `;

  db.query(query, [user_id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des compétences et résumé :', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Données non trouvées pour cet utilisateur' });
    }

      
    const competence = {
      prof_id: results[0].prof_id, 
      summary: results[0].summary,
      skills: results[0].skills,
    }; 
    res.json({
      competence
    });
  });
});

// Route pour mettre à jour le résumé et les compétences d'un utilisateur
app.post('/api/resume/:user_id/competence', (req, res) => {
  const user_id = req.params.user_id;
  const { summary, skills } = req.body;

  const query = `
    INSERT INTO professional (summary, skills, user_id) 
    VALUES (?, ?, ?)
  `;

  db.query(query, [summary, skills, user_id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la mise à jour des compétences et résumé :', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour des données' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Compétences et résumé mis à jour avec succès' });
  });
});



// Route pour mettre à jour le résumé et les compétences d'un utilisateur
app.put('/api/resume/:user_id/competence', (req, res) => {
  const user_id = req.params.user_id;
  const { summary, skills } = req.body;

  const query = `
    UPDATE professional 
    SET summary = ?, skills = ? 
    WHERE user_id = ?
  `;

  db.query(query, [summary, skills, user_id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la mise à jour des compétences et résumé :', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour des données' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Compétences et résumé mis à jour avec succès' });
  });
});


//-----------------------4-route pour work

// Route pour obtenir les expériences professionnelles d'un utilisateur spécifique
app.get('/api/resume/:user_id/experience',authenticateToken, (req, res) => {
  const user_id = req.params.user_id;

  const query = `
    SELECT work_id, role, company_name, start_date,end_date, description 
    FROM work_experience 
    WHERE user_id = ?
  `;

  db.query(query, [user_id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des expériences professionnelles :', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucune expérience professionnelle trouvée pour cet utilisateur' });
    }

    const work = results.map(row => ({
      workId:row.work_id,
      jobTitle: row.role,
      company: row.company_name,
      startDate: row.start_date,
      endDate: row.end_date,
      jobDetails: row.description,
    }));

    res.json({ work });
  });
});


app.put('/api/resume/:user_id/experience', (req, res) => {
  const user_id = req.params.user_id;
  const workExperiences = req.body.workExperiences; // Attendre un tableau d'expériences

  // Requête SQL pour mettre à jour chaque expérience
  const query = `
    UPDATE work_experience 
    SET role = ?, company_name = ?, start_date = ?, end_date = ?, description = ?
    WHERE user_id = ? AND work_id = ?
  `;

  const promises = workExperiences.map(work => {
    const { work_id, role, company_name, start_date, end_date, description } = work;

    // Log pour le débogage
    console.log(`Mise à jour de l'expérience pour user_id: ${user_id}, work_id: ${work_id}`);
    
    return new Promise((resolve, reject) => {
      db.query(query, [role, company_name, start_date, end_date, description, user_id, work_id], (error, results) => {
        if (error) {
          console.error('Erreur lors de la mise à jour :', error);
          return reject(error);
        }

        if (results.affectedRows === 0) {
          return reject(new Error('Utilisateur ou expérience professionnelle non trouvé'));
        }

        resolve(results);
      });
    });
  });

  // Attendre que toutes les promesses soient résolues
  Promise.all(promises)
    .then(() => {
      res.json({ message: 'Compétences et résumé mis à jour avec succès' });
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour des expériences professionnelles :', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour des données' });
    });
});


// Route pour ajouter de nouvelles expériences professionnelles pour un utilisateur spécifique
app.post('/api/resume/:user_id/experience', (req, res) => {
  const user_id = req.params.user_id;
  const workExperiences = req.body.workExperiences; // Attendre un tableau d'expériences

  // Requête SQL pour insérer chaque nouvelle expérience
  const query = `
    INSERT INTO work_experience (user_id, company_name, role, start_date, end_date, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Promises pour insérer chaque nouvelle expérience
  const promises = workExperiences.map(work => {
    const { company_name,role, start_date, end_date, description } = work;

    // Log pour le débogage
    console.log(`Ajout d'une nouvelle expérience pour user_id: ${user_id}`);

    return new Promise((resolve, reject) => {
      db.query(query, [user_id, company_name,role, start_date, end_date, description], (error, results) => {
        if (error) {
          console.error('Erreur lors de l\'insertion :', error);
          return reject(error);
        }

        resolve(results);
      });
    });
  });

  // Attendre que toutes les promesses soient résolues
  Promise.all(promises)
    .then(() => {
      res.json({ message: 'Nouvelles expériences professionnelles ajoutées avec succès' });
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout des nouvelles expériences professionnelles :', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout des données' });
    });
});



//-----------------------5-route pour education

app.get('/api/resume/:user_id/education', (req, res) => {
  const user_id = req.params.user_id;

  const query = `
    SELECT edu_id, institution_name, degree, start_date, end_date
    FROM education
    WHERE user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des expériences professionnelles :', err);

      return res.status(500).json({ error: 'Error retrieving education data' });
      
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No education data found for this user' });
    }

    const education = results.map(row => ({
      eduId: row.edu_id,
      college: row.institution_name,
      course: row.degree,
      startDate: row.start_date,
      endDate: row.end_date,
    }));

    res.json({ education });
  });
});

app.put('/api/resume/:user_id/education', (req, res) => {
  const user_id = req.params.user_id;
  const educationEntries = req.body.educationEntries; // Attendre un tableau d'entrées d'éducation

  console.log(educationEntries);
  
  // Requête SQL pour mettre à jour chaque entrée d'éducation
  const query = `
    UPDATE education 
    SET institution_name = ?, degree = ?, start_date = ?, end_date = ?
    WHERE user_id = ? AND edu_id = ?
  `;

  const promises = educationEntries.map(education => {
    const { edu_id, institution_name, degree, start_date, end_date } = education;

    // Log pour le débogage
    console.log(`Mise à jour de l'éducation pour user_id: ${user_id}, edu_id: ${edu_id}`);
    
    return new Promise((resolve, reject) => {
      db.query(query, [institution_name, degree, start_date, end_date, user_id, edu_id], (error, results) => {
        if (error) {
          console.error('Erreur lors de la mise à jour :', error);
          return reject(error);
        }

        if (results.affectedRows === 0) {
          return reject(new Error('Utilisateur ou éducation non trouvée'));
        }

        resolve(results);
      });
    });
  });

  // Attendre que toutes les promesses soient résolues
  Promise.all(promises)
    .then(() => {
      res.json({ message: 'Éducation mise à jour avec succès' });
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour des entrées d\'éducation :', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour des données' });
    });
});




// Route pour ajouter de nouvelles entrées d'éducation pour un utilisateur spécifique
app.post('/api/resume/:user_id/education', (req, res) => {
  const user_id = req.params.user_id;
  const educationEntries = req.body.educationEntries; // Attendre un tableau d'éducation  

  // Requête SQL pour insérer chaque nouvelle entrée d'éducation
  const query = `
    INSERT INTO education (user_id, institution_name, degree, start_date, end_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  // Promises pour insérer chaque nouvelle entrée d'éducation
  const promises = educationEntries.map(education => {
    const { institution_name, degree, start_date, end_date } = education;

    // Log pour le débogage
    console.log(`Ajout d'une nouvelle entrée d'éducation pour user_id: ${user_id}`);

    return new Promise((resolve, reject) => {
      db.query(query, [user_id, institution_name, degree, start_date, end_date], (error, results) => {
        if (error) {
          console.error('Erreur lors de l\'insertion :', error);
          return reject(error);
        }

        resolve(results);
      });
    });
  });

  // Attendre que toutes les promesses soient résolues
  Promise.all(promises)
    .then(() => {
      res.json({ message: 'Nouvelles entrées d\'éducation ajoutées avec succès' });
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout des nouvelles entrées d\'éducation :', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout des données' });
    });
});



























