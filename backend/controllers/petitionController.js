const Petition = require('../models/Petition');
const User = require('../models/User');

// Get all petitions
exports.getPetitions = async (req, res) => {
    try {
        const petitions = await Petition.find().populate('author', 'name').sort({ date: -1 });
        res.json(petitions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new petition
exports.createPetition = async (req, res) => {
    const { title, description, category, signatureGoal, location } = req.body;
    try {
        const newPetition = new Petition({
            title,
            description,
            category,
            signatureGoal,
            location,
            author: req.user.id,
        });

        const petition = await newPetition.save();
        res.json(petition);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Sign a petition
exports.signPetition = async (req, res) => {
    try {
        const petition = await Petition.findById(req.params.id);
        if (!petition) {
            return res.status(404).json({ msg: 'Petition not found' });
        }
        // Check if user has already signed
        if (petition.signatures.includes(req.user.id)) {
            return res.status(400).json({ msg: 'You have already signed this petition' });
        }

        petition.signatures.unshift(req.user.id);
        await petition.save();
        res.json(petition.signatures);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};