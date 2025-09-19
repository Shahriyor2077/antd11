import React, { useEffect, useState } from "react";
import { api } from "../api";

interface StudentType {
  id: number;
  fname: string;
  lname: string;
  phone: string;
  gender: string;
}

const Student = () => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [editId, setEditId] = useState<number | null>(null);

  const getStudents = async () => {
    try {
      const res = api.get("/");
      setStudents((await res).data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent = { fname, lname, phone, gender };

    try {
      if (editId) {
        await api.put(`/${editId}`, newStudent);
        setEditId(null);
      } else {
        await api.post("/", newStudent);
      }
      setFname("");
      setLname("");
      setPhone("");
      setGender("");
      getStudents();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete=async(id: number)=>{
    try {
        await api.delete(`/${id}`);
        getStudents()
    } catch (error) {
        console.log("Delete error:", error);
    }
  }

  const handleEdit=(student: StudentType)=>{
    setEditId(student.id)
    setFname(student.fname)
    setLname(student.lname)
    setPhone(student.phone)
    setGender(student.gender)
  }



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student CRUD</h1>

      <form
        onSubmit={handleSubmit}
        action=""
        className="mb-6 p-4 border rounded-lg shadow-md w-80 bg-white"
      >
        <input
          type="text"
          placeholder="First Name"
          value={fname}
          required
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setFname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lname}
          required
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setLname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          required
          className="border p-2 w-full mb-2 rounded"
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer"
        >
          {editId ? "Update Student" : "Add Student"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <h2 className="text-lg font-semibold">
              {student.fname} {student.lname}
            </h2>
            <p className="text-gray-600">{student.phone}</p>
            <p className="text-sm text-gray-500">Gender: {student.gender}</p>
            <div className="amt-3 flex gap-2">
              <button
                onClick={() => handleEdit(student)}
                className="bg-yellow-400 px-3 py-1 rounded text-white cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                className="bg-red-500 px-3 py-1 rounded text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Student;
