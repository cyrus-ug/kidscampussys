// permissions.js

// Action codes: C = Create, R = Read, U = Update, D = Delete
const PERMISSIONS = {
  SystemAdmin: {
    Users:    ['C','R','U','D'],
    Config:   ['C','R','U','D'],
    Terms:    ['C','R','U','D'],
    Pupils:   ['C','R','U','D'],
    Marks:    ['C','R','U','D'],
    Conduct:  ['C','R','U','D'],
    Fees:     ['C','R','U','D'],
    Library:  ['C','R','U','D'],
    Assigns:  ['C','R','U','D'],
    Messaging:['C','R','U','D']
  },

  SchoolAdmin: {
    Users:    ['C','R','U'],
    Terms:    ['C','R','U','D'],
    Pupils:   ['C','R','U','D'],
    Marks:    ['R'],
    Conduct:  ['R'],
    Fees:     ['C','R','U','D'],
    Library:  ['R'],
    Assigns:  ['R'],
    Messaging:['C','R','U','D']
  },

  Teacher: {
    Pupils:   ['R'],
    Marks:    ['C','R','U'],
    Conduct:  ['C','R','U'],
    Assigns:  ['C','R','U'],
    Messaging:['C','R','U','D']
  },

  Librarian: {
    Library:  ['C','R','U','D'],
    Messaging:['C','R','U','D']
  },

  Parent: {
    Pupils:       ['R'],
    Marks:        ['R'],
    Conduct:      ['R'],
    Fees:         ['R'],
    Library:      ['R'],
    Assigns:      ['R'],
    Messaging:    ['C','R']
  },

  Student: {
    Marks:        ['R'],
    Conduct:      ['R'],
    Assigns:      ['R'],
    Messaging:    ['C','R']
  }
};

export default PERMISSIONS;
