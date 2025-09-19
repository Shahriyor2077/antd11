import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Card, Row, Col, Form, Input, Select, DatePicker, Button, Popconfirm, message } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface StudentType {
  id: number;
  fname: string;
  lname: string;
  phone: string;
  gender: string;
  birthdate: string;
}

const Student = () => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [birthdate, setBirthdate] = useState<Dayjs | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const getStudents = async () => {
    try {
      const res = api.get(`/`);
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

    const newStudent = {
      fname,
      lname,
      phone,
      gender,
      birthdate: birthdate ? birthdate.format("YYYY-MM-DD") : "",
    };

    try {
      if (editId) {
        await api.put(`/${editId}`, newStudent);
        setEditId(null);
      } else {
        await api.post(`/`, newStudent);
      }
      setFname("");
      setLname("");
      setPhone("");
      setGender("male");
      setBirthdate(null);
      getStudents();
      message.success(editId ? "Student updated" : "Student added");
    } catch (error) {
      console.error("Error:", error);
      message.error("Request failed");
    }
  };

  const handleDelete=async(id: number)=>{
    try {
        await api.delete(`/${id}`);
        getStudents();
        message.success("Student deleted");
    } catch (error) {
        console.log("Delete error:", error);
        message.error("Delete failed");
    }
  }

  const handleEdit=(student: StudentType)=>{
    setEditId(student.id)
    setFname(student.fname)
    setLname(student.lname)
    setPhone(student.phone)
    setGender(student.gender)
    setBirthdate(student.birthdate ? dayjs(student.birthdate) : null)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student CRUD</h1>

      <form onSubmit={handleSubmit} action="" className="mb-6 max-w-xl">
        <Card>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item label="First name" required>
                <Input value={fname} onChange={(e) => setFname(e.target.value)} placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last name" required>
                <Input value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Last name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone" required>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Gender" required>
                <Select value={gender} onChange={(v) => setGender(v)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Birthdate">
                <DatePicker className="w-full" value={birthdate} onChange={(d) => setBirthdate(d)} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" ">
                <Button type="primary" htmlType="submit" className="w-full">
                  {editId ? "Update Student" : "Add Student"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </form>

      <Row gutter={[16, 16]}>
        {students.map((student) => (
          <Col xs={24} sm={12} md={8} key={student.id}>
            <Card
              title={`${student.fname} ${student.lname}`}
              extra={
                <div className="flex gap-2">
                  <Button size="small" onClick={() => handleEdit(student)}>Edit</Button>
                  <Popconfirm title="Delete this student?" onConfirm={() => handleDelete(student.id)} okText="Yes" cancelText="No">
                    <Button size="small" danger>Delete</Button>
                  </Popconfirm>
                </div>
              }
            >
              <div className="space-y-1">
                <div><span className="text-gray-500">Phone:</span> {student.phone}</div>
                <div><span className="text-gray-500">Gender:</span> {student.gender}</div>
                {student.birthdate && (
                  <div><span className="text-gray-500">Birthdate:</span> {dayjs(student.birthdate).format("YYYY-MM-DD")}</div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Student;
