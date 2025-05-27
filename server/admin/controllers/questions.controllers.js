const Questions = require("../models/questions.model");


/*
*---------------------------------------------------
*--------- User Side APIs By InfoTechZone ----------
*---------------------------------------------------
*/

// Adding Questions
exports.addingQNAData = async (req, res) => {
    try {
      const { questions, poss_ans,  cat } = req.body; // Extract the question and possible answers from request body
    
      // Validate input
      if (!questions || typeof questions !== 'string' || questions.trim() === '') {
        return res.status(400).json({
          status: 400,
          success: false,
          message: 'Invalid question provided. It must be a non-empty string.',
        });
      }
  
      if (!poss_ans || !Array.isArray(poss_ans) || poss_ans.length === 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: 'Invalid possible answers provided. Must be a non-empty array.',
        });
      }

      if(!cat || cat.length === 0 || cat === ''){
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'Invlade questions category.'
        })
      }
  
      // Validate possible answers are strings and non-empty
      const invalidAnswers = poss_ans.filter((ans) => typeof ans !== 'string' || ans.trim() === '');
      if (invalidAnswers.length > 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: 'All possible answers must be non-empty strings.',
        });
      }
  
      // Create a new question in the database
      const newQuestion = await Questions.create({
        questions: questions,
        poss_ans: poss_ans,
        cat: cat,
      });
  
      res.status(201).json({
        status: 201,
        success: true,
        message: 'Question created successfully.',
        data: newQuestion, // Return the created question
      });
    } catch (error) {
      console.error('Error during question creation: ', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: 'Internal server error.',
        error: error.message, // Optionally include error details
      });
    }
  };
    


// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
      const { id } = req.params; // Extract question ID from URL
  
      const question = await Questions.findByPk(id);
  
      if (!question) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Question not found.',
        });
      }
  
      await question.destroy(); // Delete the question
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Question deleted successfully.',
      });
    } catch (error) {
      console.warn('Error during deleting question: ', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: 'Internal server error.',
      });
    }
  };


  // Update a specific answer
exports.updateSpecificAnswer = async (req, res) => {
    try {
      const { id } = req.params; // Extract question ID
      const { oldAnswer, newAnswer } = req.body; // Old and new answers
  
      if (!oldAnswer || !newAnswer) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: 'Both oldAnswer and newAnswer are required.',
        });
      }
  
      const question = await Questions.findByPk(id);
      if (!question) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Question not found.',
        });
      }
  
      const answers = question.poss_ans;
      const answerIndex = answers.indexOf(oldAnswer);
      if (answerIndex === -1) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Answer not found in the question.',
        });
      }
  
      answers[answerIndex] = newAnswer; // Update the answer
      question.poss_ans = answers;
      await question.save();
  
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Answer updated successfully.',
      });
    } catch (error) {
      console.warn('Error during updating a specific answer: ', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: 'Internal server error.',
      });
    }
  };
  

  // Delete a specific answer
  exports.deleteSpecificAnswer = async (req, res) => {
    try {
      const { id } = req.params; // Extract question ID
      const { answer } = req.body; // Answer to delete
  
      if (!answer) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: 'Answer to delete is required.',
        });
      }
  
      const question = await Questions.findByPk(id);
      if (!question) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Question not found.',
        });
      }
  
      const answers = question.poss_ans;
      const updatedAnswers = answers.filter(ans => ans !== answer); // Remove the specific answer
  
      if (updatedAnswers.length === answers.length) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Answer not found in the question.',
        });
      }
  
      question.poss_ans = updatedAnswers;
      await question.save();
  
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Answer deleted successfully.',
      });
    } catch (error) {
      console.warn('Error during deleting a specific answer: ', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: 'Internal server error.',
      });
    }
  };


  // Update possible answers of a question
exports.updateAnswer = async (req, res) => {
    try {
      const { id } = req.params; // Extract question ID
      const { poss_ans } = req.body; // New array of possible answers
  
      if (!Array.isArray(poss_ans)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: 'Invalid possible answers format. It must be an array.',
        });
      }
  
      const question = await Questions.findByPk(id);
      if (!question) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Question not found.',
        });
      }
  
      question.poss_ans = poss_ans;
      await question.save();
  
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Possible answers updated successfully.',
      });
    } catch (error) {
      console.warn('Error during updating answers: ', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: 'Internal server error.',
      });
    }
  };


/*
*---------------------------------------------------
*--------- User Side APIs By InfoTechZone ----------
*---------------------------------------------------
*/
// User App Side APIs
exports.SendQNAData = async (req, res) => {
    try {
      // Extract the category from request body or query
      const { category } = req.body;
  
      if (!category) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: 'Category is required.',
        });
      }
  
      // Find all questions in the specified category
      const questions = await Questions.findAll({
        where: {
          cat: category, // Filter by category
        },
      });
  
      // Check if there are questions for the given category
      if (!questions.length) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: `No questions found for category: ${category}`,
        });
      }
  
      // Send the questions and their possible answers to the user
      return res.status(200).json({
        status: 200,
        success: true,
        message: `Questions for category: ${category} fetched successfully.`,
        data: questions,
      });
    } catch (error) {
      console.warn('Error during getting questions: ', error);
      res.status(500).json({
        status: 500,
        success: false,
        message: 'Internal server error.',
      });
    }
  };
  