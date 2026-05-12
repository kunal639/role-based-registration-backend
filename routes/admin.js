const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { Founder, Audience } = require('../models/UserModels');

// IMPORT the middleware bouncer 
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/admin/participants
 * @desc    Fetch all registrations for the Dashboard UI
 * @access  Private (Admin Only)
 */


router.get('/participants', protect, async (req, res) => {
    try {
        const [founders, audience] = await Promise.all([
            Founder.find().sort({ createdAt: -1 }),
            Audience.find().sort({ createdAt: -1 })
        ]);
        
        res.json({ founders, audience });
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Error fetching participants" });
    }
});

/**
 * @route   DELETE /api/admin/participant/:role/:id
 * @desc    Remove a specific participant (Unpaid/Invalid)
 * @access  Private (Admin Only)
 */

router.delete('/participant/:role/:id', protect, async (req, res) => {
    try {
        const { role, id } = req.params;
        
        if (role === 'founder') {
            await Founder.findByIdAndDelete(id);
        } else if (role === 'audience') {
            await Audience.findByIdAndDelete(id);
        } else {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        res.json({ message: "Participant removed successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Failed to delete participant" });
    }
});

/**
 * @route   GET /api/admin/export
 * @desc    Generate and download Excel report
 * @access  Private (Admin Only)
 */

router.get('/export', protect, async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        
        // --- Sheet 1: Founders ---
        const founderSheet = workbook.addWorksheet('Founders');
        founderSheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Startup', key: 'startup', width: 20 },
            { header: 'Idea', key: 'idea', width: 30 },
            { header: 'Stage', key: 'stage', width: 15 },
            { header: 'Paid', key: 'isPaid', width: 10 }
        ];
        
        const founders = await Founder.find().sort({ createdAt: -1 });
        founderSheet.addRows(founders);

        // --- Sheet 2: Audience ---
        const audienceSheet = workbook.addWorksheet('Audience');
        audienceSheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Organization', key: 'org', width: 25 },
            { header: 'Paid', key: 'isPaid', width: 10 }
        ];
        
        const attendees = await Audience.find().sort({ createdAt: -1 });
        audienceSheet.addRows(attendees);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Pitch_Registrations.xlsx');

        await workbook.xlsx.write(res);
        res.status(200).end();
        
    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: "Export failed" });
    }
});

module.exports = router;