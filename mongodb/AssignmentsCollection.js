const mongodb = require("mongodb");
const Assignment = require("../models/Assignment");

/**
 * @function TasksCollection
 * @description returns all tasks from database
 *
 * @param {mongodb.Db} db - the mongo.Db to search
 * @returns {Object} all the methods that can be done to the MongoDB
 */
const TasksCollection = (db) => {
  //chose collection
  const collection = db.collection("assignments");

  /**
   * @function getTask
   * @description returns all tasks from database
   *
   * @returns {Promise<Task>} all tasks that are incomplete
   */
   const getAssignmentbyclass = (class_name) => {
    return collection
      //create cursor for assignments for the given class 
      .find({ 
        classes: class_name ,
        completed:false,
      })
      //convert filtered assignments into an array to be outputted
      .toArray()
      .then((cursor) => {
        //console.log(`getIncompleteTasks::returning ${cursor.length} items`);
        return cursor;
      });
  };
  const getAssignment = (assignment,classes) => {
    return collection
    //create cursor for assignments with the given assignment name
      .find({
        assignment: assignment ,
        classes: classes,
        completed:false,
      })
      //convert assignments to an array
      .toArray()
      //output the assignments
      .then((cursor) => {
        //console.log(`getIncompleteTasks::returning ${cursor.length} items`);
        return cursor;
      });
  };

  /**
   * @function getAllTasks
   * @description returns all tasks from database by earliest duedate
   *
   * @returns {Promise<Array<Task>>} all tasks that are incomplete
   */
  const getAllAssignments = () => {
    return collection
      //create a cursor to iterate over all the items in the collection
      .find()
      //sort the assignments by due_date
      .sort( { due_date : 1} )
      //convert to array
      .toArray()
      //output
      .then((cursor) => {
        console.log(`returning ${cursor.length} assignments`);
        return cursor;
      });
  };

  /**
   * @function getCompletedTasks
   * @description returns all completed tasks from database
   *
   * @returns {Array<Task>} all tasks that are incomplete
   */
  const getCompletedAssignments = () => {
    return collection
      //create cursor for all completed assignments
      .find({ completed: true })
      .toArray()
      .then((cursor) => {
        console.log(`getIncompleteTasks::returning ${cursor.length} items`);
        return cursor;
      });
  };
  const getinCompletedAssignments = () => {
    return collection
      //create cursor for all incomplete assignments
      .find({ completed: false })
      .toArray()
      .then((cursor) => {
      
        return cursor;
      });
  };

  /**
   * @function createTask
   * @description creates a task
   *
   * @param {string} description - the description of the task
   * @return {Task}
   */
  const createAssignment = (assignment,classes,description,due_date) => {
    //create a new Assignment object
    const new_assignment = Assignment(assignment,classes,description,due_date);
    //insert the new assignment and return it
    return collection.insertOne(new_assignment).then(() => {
      return new_assignment;
    });
  };

  /**
   * @function completeTask
   * @description completes a task given the _id
   *
   * @param {string} id - the document _id of the task
   * @return {Task}
   *
   */
   const completeAssignment = (assignment,classes) => {
    const filter = {
      assignment,
      classes 
    };
    //change the completed value to true 
    return collection
      .updateOne(filter, {
        $set: {
          completed: true,
        },
      })
      .then(() => {
        return collection.findOne(filter);
      });
  };
  const updateDescription = (assignment,classes,description) => {
    const filter = {
      assignment,
      classes 
    };
    //change the completed value to true 
    return collection
      .updateOne(filter, {
        $set: {
          description: description,
        },
      })
      .then(() => {
        return collection.findOne(filter);
      });
  };
  const updateDueDate = (assignment,classes,due_date) => {
    console.log(assignment,classes,due_date)
    const filter = {
      assignment,
      classes 
    };
    return collection
      .updateOne(filter, {
        $set: {
          due_date: due_date,
        }
      })
      .then(() => {
        return collection.findOne(filter);
      });
  };
  const deleteAssignment = (assignment,classes) => {
    const filter = {
      assignment,
      classes 
    };
    //delete the assignment from the database
    return collection
      .deleteOne(filter)
      .then(() => {
        return;
      });
  };


  return {
    createAssignment,
    completeAssignment,
    updateDueDate,
    updateDescription,
    deleteAssignment,
    getAssignment,
    getAssignmentbyclass,
    getAllAssignments,
    getCompletedAssignments,
    getinCompletedAssignments
  };
};

module.exports = TasksCollection;
