import React, { useEffect, useState } from 'react';

function App() {
  const initialvalue = {
    firstName: "",
    lastName: "",
    number: "",
    email: "",
    gender: "female",
    subjects: [],
  }

  const [person, setPerson] = useState(initialvalue);
  const [people, setPeople] = useState([]);
  const [deletedPersonID, setDeletedPersonID] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getFromLocal = JSON.parse(localStorage.getItem('people'));
    setPeople(getFromLocal || []);
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? getUpdatedSubjects(name, e) : e.target.value;
    setPerson(prev => ({ ...prev, [name]: value }));
  }

  const getUpdatedSubjects = (name, e) => {
    const value = e.target.value;
    const updatedSubjects = [...person.subjects];

    if (e.target.checked) {
      updatedSubjects.push(value);
    } else {
      const index = updatedSubjects.indexOf(value);
      if (index !== -1) {
        updatedSubjects.splice(index, 1);
      }
    }

    return updatedSubjects;
  }

  const generateRandomID = () => {
    return Math.floor(Math.random() * 100000).toString();
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (person.number.length !== 10) {
      alert('Phone number must be 10 digits.');
      return;
    }

    if (isEditing) {
      // If we're editing, update the existing entry.
      const updatedPeople = people.map(existingPerson =>
        existingPerson.id === person.id ? person : existingPerson
      );
      setPeople(updatedPeople);
      setIsEditing(false);
      setinLocal(updatedPeople); // Save the updated data to local storage.
    } else {
      // If not editing, create a new entry.
      const newPerson = { ...person, id: generateRandomID() };
      setPeople(prev => [...prev, newPerson]);
      setinLocal([...people, newPerson]); // Save the updated data to local storage.
    }

    setPerson(initialvalue);
  }

  const handleDelete = (id) => {
    setDeletedPersonID(id);
    const updatedPeople = people.filter(person => person.id !== id);
    setPeople(updatedPeople);
    setIsEditing(false); // Exit editing mode if deleting.
    setinLocal(updatedPeople); // Save the updated data to local storage.
  }

  const handleEdit = (id) => {
    const personToEdit = people.find(person => person.id === id);
    setPerson(personToEdit);
    setIsEditing(true);
  }

  function setinLocal(updatedData) {
    localStorage.setItem("people", JSON.stringify(updatedData));
  }

  return (
    <div>
      <h1>REACT FORM</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor='firstName'>First Name</label><br></br>
        <input type='text' id='firstName' value={person.firstName} name='firstName' onChange={handleChange} placeholder='Enter your First Name' /><br></br><br></br>
        <label htmlFor='lastName'>Last Name</label><br></br>
        <input type='text' id='lastName' value={person.lastName} name='lastName' onChange={handleChange} placeholder='Enter your Last Name' /><br></br><br></br>
        <label htmlFor='number'>Phone</label><br></br>
        <input type='tel' id='number' value={person.number} name='number' onChange={handleChange} placeholder='Enter your Phone Number' /><br></br><br></br>
        <label htmlFor='email'>Email</label><br></br>
        <input type='email' id='email' value={person.email} name='email' onChange={handleChange} placeholder='Enter your email' /><br></br><br></br>

        <div>
          <div>
            <label>Gender</label><br></br>
            <input type="radio" id="male" name="gender" value="male" onChange={handleChange} checked={person.gender === "male"} />
            <label htmlFor="male">Male</label>
          </div>
          <div>
            <input type="radio" id="female" name="gender" value="female" onChange={handleChange} checked={person.gender === "female"} />
            <label htmlFor="female">Female</label>
          </div>
          <div>
            <input type="radio" id="other" name="gender" value="other" onChange={handleChange} checked={person.gender === "other"} />
            <label htmlFor="other">Other</label>
            <br></br><br></br>
          </div>

          <div>
            <label>Subjects</label><br></br>
            <input type="checkbox" id="math" name="subjects" value="Math" onChange={handleChange} checked={person.subjects.includes("Math")} />
            <label htmlFor="math">Math</label>
          </div>
          <div>
            <input type="checkbox" id="science" name="subjects" value="Science" onChange={handleChange} checked={person.subjects.includes("Science")} />
            <label htmlFor="science">Science</label>
          </div>
          <div>
            <input type="checkbox" id="history" name="subjects" value="History" onChange={handleChange} checked={person.subjects.includes("History")} />
            <label htmlFor="history">History</label>
          </div><br></br>
        </div>
        <button type="submit">{isEditing ? "Edit" : "Submit"}</button>
      </form>

      {deletedPersonID && (
        <div>
          <p>Person with ID: {deletedPersonID} has been deleted.</p>
          <button onClick={() => setDeletedPersonID(null)}>Close</button>
        </div>
      )}
      <br></br>
      <div>
        <table>
          <thead>
            <tr>
              <th>Sr</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Subjects</th>
              <th>ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {people.map((val, index) => {
              return (
                <tr key={val.id}>
                  <td>{index + 1}</td>
                  <td>{val.firstName}</td>
                  <td>{val.lastName}</td>
                  <td>{val.email}</td>
                  <td>{val.number}</td>
                  <td>{val.gender}</td>
                  <td>{Array.isArray(val.subjects) ? val.subjects.join(', ') : val.subjects}</td>
                  <td>{val.id}</td>
                  <td>
                    <button onClick={() => handleEdit(val.id)}>Edit</button>
                    <button onClick={() => handleDelete(val.id)}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
