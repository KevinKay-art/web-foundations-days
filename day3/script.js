let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
    return notes.filter(note =>
        note.text.toLowerCase().includes(word.toLowerCase())
    );
}

console.log(searchNotes("day")); // Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]
console.log(searchNotes("pizza")); // Expected: []

function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (let note of notes) {
        if (note.text.length > longest.text.length) {
            longest = note;
        }
    }

    return longest;
}

console.log(longestNote()); // Expected: note 3

let savedNotes = notes;
notes = [];
console.log(longestNote()); // Expected: null
notes = savedNotes;

function countByCategory() {
    let counts = {};

    for (let note of notes) {
        if (counts[note.category]) {
            counts[note.category]++;
        } else {
            counts[note.category] = 1;
        }
    }

    return counts;
}

console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 1 }

notes = [];
console.log(countByCategory()); // Expected: {}
notes = savedNotes;

function getSummary() {
    let counts = countByCategory();
    let total = notes.length;

    let noteWord = total === 1 ? "note" : "notes";

    return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

console.log(getSummary()); // Expected: 5 notes: 2 personal, 1 work, 2 study.

notes = [];
console.log(getSummary()); // Expected: 0 notes: 0 personal, 0 work, 0 study.
notes = savedNotes;

function isDuplicate(text) {
    return notes.some(note =>
        note.text.trim().toLowerCase() === text.trim().toLowerCase()
    );
}

console.log(isDuplicate("Call mum")); // Expected: true
console.log(isDuplicate("  CALL MUM  ")); // Expected: true

function addNote(text, category) {
    text = text.trim();

    if (text.length < 1 || text.length > 200) {
        console.log("Reason: Note must be 1-200 characters.");
        return false;
    }

    if (isDuplicate(text)) {
        console.log("Reason: Note already exists.");
        return false;
    }

    if (!["personal", "work", "study"].includes(category)) {
        console.log("Reason: Invalid category.");
        return false;
    }

    let newId = notes.length > 0
        ? Math.max(...notes.map(note => note.id)) + 1
        : 1;

    notes.push({
        id: newId,
        text: text,
        category: category
    });

    return true;
}

console.log(addNote("Learn JavaScript", "study")); // Expected: true

console.log(addNote("Call mum", "personal")); // Expected: false, because note is a duplicate

console.log(addNote("", "personal")); // Expected: false, because note is empty

console.log(addNote("Buy a new laptop", "shopping")); // Expected: false, because category is invalid