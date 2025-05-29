const { KYCDetails } = require("../models"); // Assuming models are exported from index.js in admin/models
const path = require("path");

// Assuming you have a Multer setup for file uploads in the admin section
// Example: const upload = require('../../../multer_uploads'); // Adjust path as needed

// Placeholder for Multer middleware - you need to set this up in your route definition.
// This example assumes files are uploaded to a directory and their paths are available in req.files or req.file

exports.submitAdminKyc = async (req, res) => {
  try {
    // Assuming Multer has processed the files and they are available in req.files
    // The field names should match the formData keys from the frontend
    const {
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      panName,
      panNumber,
      fullAddress,
      gstNumber,
      hasGST,
      msmeNumber,
      isMSMERegistered,
      shopCertificateNumber,
      hasShopCertificate,
    } = req.body;

    // Assuming single files are in req.files['fieldName'][0] and multiple in req.files['fieldName']
    const chequeDocumentsFiles = req.files && req.files['chequeDocuments'] ? req.files['chequeDocuments'] : []; // Assuming multiple cheques might be allowed
    const gstCertificateFiles = req.files && req.files['gstCertificate'] ? req.files['gstCertificate'] : [];
    const msmeCertificateFiles = req.files && req.files['msmeCertificate'] ? req.files['msmeCertificate'] : [];
    const shopCertificateFiles = req.files && req.files['shopCertificate'] ? req.files['shopCertificate'] : [];
    const additionalDocumentsFiles = req.files && req.files['additionalDocuments'] ? req.files['additionalDocuments'] : [];

    // Get the paths/filenames of the uploaded files
    // Adjust this based on how your Multer configuration saves files
    const chequeDocumentsPaths = chequeDocumentsFiles.map(file => file.path.replace(/\\/g, '/'));
    const gstCertificatePaths = gstCertificateFiles.map(file => file.path.replace(/\\/g, '/'));
    const msmeCertificatePaths = msmeCertificateFiles.map(file => file.path.replace(/\\/g, '/'));
    const shopCertificatePaths = shopCertificateFiles.map(file => file.path.replace(/\\/g, '/'));
    const additionalDocumentsPaths = additionalDocumentsFiles.map(file => file.path.replace(/\\/g, '/'));


    // You might need to associate this KYC with an admin user or another entity.
    // Assuming admin_user_id comes from the request or session.
    // For now, I'll use a placeholder value. You need to replace this.
    const adminUserId = req.adminUser ? req.adminUser.id : 1; // Example: get admin user from authenticated request


    const kycDetails = await KYCDetails.create({
      admin_user_id: adminUserId, // Replace with actual admin user ID
      bankName: bankName,
      accountHolderName: accountHolderName,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
      panName: panName,
      panNumber: panNumber,
      fullAddress: fullAddress,
      gstNumber: gstNumber,
      hasGST: hasGST,
      msmeNumber: msmeNumber,
      isMSMERegistered: isMSMERegistered,
      shopCertificateNumber: shopCertificateNumber,
      hasShopCertificate: hasShopCertificate,
      chequeDocuments: chequeDocumentsPaths, // Store array of file paths/URLs
      gstCertificate: gstCertificatePaths, // Store array of file paths/URLs
      msmeCertificate: msmeCertificatePaths, // Store array of file paths/URLs
      shopCertificate: shopCertificatePaths, // Store array of file paths/URLs
      additionalDocuments: additionalDocumentsPaths, // Store array of file paths/URLs
    });

    res.status(201).json({ message: "Admin KYC details submitted successfully", kycDetails });
  } catch (error) {
    console.error("Error submitting Admin KYC:", error);
    res.status(500).json({ message: "Failed to submit Admin KYC details", error: error.message });
  }
};