const express = require('express');
const router = express.Router();
const { createEmployee, getEmployee, updateEmployee, deleteEmployee } = require('./emp_personal_info/emp_info.controller');
const { createCompensation, getCompensation, updateCompensation, deleteCompensation } = require('./emp_details_com/emp_details.controller');

// Employee Info API routes
router.post('/createEmp', createEmployee);
router.get('/getEmp/:id', getEmployee);
router.put('/updateEmp/:id', updateEmployee);
router.delete('/deleteEmp/:id', deleteEmployee);

// Employee Compensation API routes
router.post('/emp-detail', createCompensation);
router.get('/emp-detail/:id', getCompensation);
router.put('/update-detail/:id', updateCompensation);
router.delete('/delete-detail/:id', deleteCompensation);

module.exports = router;