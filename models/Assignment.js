
 const Assignment = (assignment,classes,description,due_date, completed = false) => {
  return {
    assignment,
    classes,
    description,  
    completed,
    due_date,
  };
};

module.exports = Assignment;
