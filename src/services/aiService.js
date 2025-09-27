// Simulated AI service for question generation and scoring
export const generateQuestions = () => {
  return {
    easy: [
      {
        id: 1,
        question: "What is React and what are its main advantages?",
        difficulty: "easy",
        timeLimit: 20,
        expectedKeywords: ["component", "virtual dom", "reusable", "state", "props"]
      },
      {
        id: 2,
        question: "Explain the difference between let, const, and var in JavaScript.",
        difficulty: "easy",
        timeLimit: 20,
        expectedKeywords: ["scope", "hoisting", "block", "immutable", "mutable"]
      }
    ],
    medium: [
      {
        id: 3,
        question: "How would you implement a custom hook in React? Provide an example.",
        difficulty: "medium",
        timeLimit: 60,
        expectedKeywords: ["useState", "useEffect", "custom", "reusable", "logic"]
      },
      {
        id: 4,
        question: "Explain the concept of closures in JavaScript and provide a practical example.",
        difficulty: "medium",
        timeLimit: 60,
        expectedKeywords: ["closure", "scope", "function", "lexical", "environment"]
      }
    ],
    hard: [
      {
        id: 5,
        question: "Design a scalable state management solution for a large React application. What patterns would you use?",
        difficulty: "hard",
        timeLimit: 120,
        expectedKeywords: ["redux", "context", "state", "scalable", "pattern", "architecture"]
      },
      {
        id: 6,
        question: "Explain the React reconciliation algorithm and how it optimizes rendering performance.",
        difficulty: "hard",
        timeLimit: 120,
        expectedKeywords: ["reconciliation", "diffing", "virtual dom", "performance", "algorithm"]
      }
    ]
  };
};

export const evaluateAnswer = (question, answer) => {
  const keywords = question.expectedKeywords || [];
  const answerText = answer.toLowerCase();
  
  // Handle "Don't Know" answers
  if (answerText.includes("don't know") || answerText.includes("i don't know") || answerText.includes("no answer provided") || answerText.includes("time expired")) {
    return {
      score: 0,
      feedback: generateDontKnowFeedback(question),
      matchedKeywords: []
    };
  }
  
  // Simple keyword matching for scoring
  const matchedKeywords = keywords.filter(keyword => 
    answerText.includes(keyword.toLowerCase())
  );
  
  const keywordScore = (matchedKeywords.length / keywords.length) * 40;
  
  // Length and quality scoring
  const lengthScore = Math.min(answer.length / 100, 1) * 20;
  
  // Technical depth scoring (simplified)
  const technicalScore = answerText.includes('example') || answerText.includes('code') ? 20 : 10;
  
  const totalScore = Math.min(keywordScore + lengthScore + technicalScore, 100);
  
  return {
    score: Math.round(totalScore),
    feedback: generateFeedback(question, answer, matchedKeywords),
    matchedKeywords
  };
};

const generateDontKnowFeedback = (question) => {
  const feedback = [];
  
  feedback.push("It's okay to not know every answer. This shows honesty and self-awareness.");
  feedback.push("For future reference, this question was about: " + question.expectedKeywords.join(", "));
  
  if (question.difficulty === 'easy') {
    feedback.push("This was a basic concept. Consider reviewing fundamental React/JavaScript concepts.");
  } else if (question.difficulty === 'medium') {
    feedback.push("This was an intermediate topic. Consider studying more advanced React patterns and JavaScript concepts.");
  } else {
    feedback.push("This was an advanced topic. Consider studying system design and complex React architectures.");
  }
  
  return feedback;
};

const generateFeedback = (question, answer, matchedKeywords) => {
  const feedback = [];
  
  if (matchedKeywords.length === 0) {
    feedback.push("Your answer didn't cover the key concepts. Consider mentioning: " + question.expectedKeywords.join(", "));
  } else if (matchedKeywords.length < question.expectedKeywords.length / 2) {
    feedback.push("Good start! You covered some key points. Consider also discussing: " + 
      question.expectedKeywords.filter(k => !matchedKeywords.includes(k)).join(", "));
  } else {
    feedback.push("Excellent! You covered most of the key concepts well.");
  }
  
  if (answer.length < 50) {
    feedback.push("Your answer could be more detailed. Try to provide examples or explain your reasoning.");
  }
  
  if (!answer.toLowerCase().includes('example') && question.difficulty !== 'easy') {
    feedback.push("Consider providing a practical example to illustrate your point.");
  }
  
  return feedback;
};

export const calculateFinalScore = (questionResults) => {
  const totalScore = questionResults.reduce((sum, result) => sum + result.score, 0);
  const averageScore = totalScore / questionResults.length;
  
  let grade = 'F';
  if (averageScore >= 90) grade = 'A';
  else if (averageScore >= 80) grade = 'B';
  else if (averageScore >= 70) grade = 'C';
  else if (averageScore >= 60) grade = 'D';
  
  return {
    totalScore: Math.round(averageScore),
    grade,
    summary: generateSummary(questionResults, averageScore)
  };
};

const generateSummary = (questionResults, averageScore) => {
  const strengths = [];
  const weaknesses = [];
  
  questionResults.forEach((result, index) => {
    if (result.score >= 80) {
      strengths.push(`Question ${index + 1}: Strong understanding`);
    } else if (result.score < 60) {
      weaknesses.push(`Question ${index + 1}: Needs improvement`);
    }
  });
  
  let summary = `Overall Score: ${Math.round(averageScore)}/100\n\n`;
  
  if (strengths.length > 0) {
    summary += `Strengths:\n${strengths.join('\n')}\n\n`;
  }
  
  if (weaknesses.length > 0) {
    summary += `Areas for Improvement:\n${weaknesses.join('\n')}\n\n`;
  }
  
  if (averageScore >= 80) {
    summary += "Overall Assessment: Strong candidate with good technical knowledge.";
  } else if (averageScore >= 60) {
    summary += "Overall Assessment: Decent candidate with room for improvement.";
  } else {
    summary += "Overall Assessment: Candidate needs significant improvement in technical knowledge.";
  }
  
  return summary;
};
