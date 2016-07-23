'use strict';

angular.module('examApp')
  .service('mockData', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getActiveExams = function(){
      return exams;
    };

    this.getQuestionsForExam = function(){
      return questions;
    };
    

  });


var questions = [
  {
    id: 1,
    name: 'Q 1',
    questionText: 'Which is the best form of entertainment',
    a: 'Option A',
    b: 'Option B',
    c: 'Option C',
    d: 'Option D',
    e: 'Option E',
    f: 'Option F',
    active: true,
    aCorrect: true,
    bCorrect: false,
    cCorrect: false,
    dCorrect: false,
    eCorrect: false,
    fCorrect: false,
    answerLength: 2
  },
  {
    id: 2,
    name: 'Q 2',
    questionText: 'A Cricket team has how many players',
    a: '7',
    b: '8',
    c: '9',
    d: '11',
    active: true,
    aCorrect: true,
    bCorrect: false,
    cCorrect: false,
    dCorrect: false,
    eCorrect: false,
    fCorrect: false,
    answerLength: 1
  }
];

var exams = [
  {
    id: 1,
    code: 'PHY1',
    imageId: 'book1.jpg',
    name: 'Concepts of Physics',
    category: 'Physics',
    passPercent: 60,
    maxMarks: 100,
    active: true,
    timeAllowed: 60,
    description: 'Covers Chapter 1 to 10 of the Concepts of Physics Book'
  },
  {
    id: 2,
    imageId: 'book2.jpg',
    code: 'BIO2',
    name: 'Biology',
    category:'Biology',
    passPercent: 30,
    maxMarks: 100,
    timeAllowed: 60,
    description: 'Animal kingdom',
    active: true
  }
];