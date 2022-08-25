import logo from "./logo.svg";
import "./App.css";
import { users } from "./data/users";
import { useEffect, useState } from "react";

function App() {
  const [editIndex, setEditIndex] = useState(-1);
  const [employees, setEmployees] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: "",
    department: "",
    salary: 0,
  });
  const updateData = (data) => {
    setEmployees(data);
    localStorage.setItem("employees", JSON.stringify(data));
  };
  useEffect(() => {
    let local = localStorage.getItem("employees");
    if (local) {
      local = JSON.parse(local);
      setEmployees(local);
    } else {
      let dummyData = users.map((e) => ({
        id: e.id,
        name: e.name,
        salary: Math.round(Math.random() * 100000),
        department:
          Math.random() < 0.25
            ? "Frontend"
            : Math.random() > 0.25 && Math.random() < 0.5
            ? "Backend"
            : Math.random() > 0.5 && Math.random() > 0.75
            ? "Frontend,Backend"
            : "",
      }));
      updateData(dummyData);
    }
  }, []);
  const handleChange = (type, value, index) => {
    const updatedEMP = employees.map((e, i) =>
      i === index ? { ...e, [type]: value } : e
    );
    updateData(updatedEMP);
  };
  const handleDelete = (index) => {
    const afterDelete = employees.filter((e, i) => i !== index);
    updateData(afterDelete);
  };
  const handleAddNew = (data) => {
    const newEmployees = [
      ...employees,
      { ...data, id: employees[employees.length - 1].id + 1 },
    ];
    updateData(newEmployees);
    setNewEmp({
      name: "",
      department: "",
      salary: 0,
    });
  };
  const sortEmployeesBy = (type, by) => {
    updateData(
      [...employees].sort((a, b) =>
        a[type] < b[type] ? (by === "asc" ? 1 : -1) : by === "asc" ? -1 : 1
      )
    );
  };
  const filterData = (key) => {
    const filtered = JSON.parse(localStorage.getItem("employees")).filter((e) =>
      e.department.toLowerCase().includes(key)
    );
    setEmployees(filtered);
  };
  return (
    <div className="App">
      <table>
        <tr>
          <th>SNo.</th>
          <th>Name</th>
          <th>Department</th>
          <th
            onClick={() => {
              sortEmployeesBy("salary");
            }}
          >
            Salary
          </th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        {employees.map((emp, index) => {
          return (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>
                {editIndex === index ? (
                  <input
                    value={emp.name}
                    onChange={(e) => {
                      handleChange("name", e.target.value, index);
                    }}
                  />
                ) : (
                  emp.name
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <textarea
                    value={emp.department}
                    onChange={(e) => {
                      handleChange("department", e.target.value, index);
                    }}
                  ></textarea>
                ) : (
                  emp.department || "NA"
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    value={emp.salary}
                    onChange={(e) => {
                      handleChange("salary", e.target.value, index);
                    }}
                  />
                ) : (
                  emp.salary
                )}
              </td>
              <td>
                <button
                  onClick={() => {
                    setEditIndex(index === editIndex ? -1 : index);
                  }}
                >
                  {editIndex === index ? "Save" : "Edit"}
                </button>
              </td>
              <td>
                <button
                  onClick={() => {
                    handleDelete(index);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </table>
      <div className="footer">
        {isAddingNew && (
          <>
            <input
              value={newEmp.name}
              placeholder="enter name"
              onChange={(e) => {
                setNewEmp((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
            <textarea
              value={newEmp.department}
              placeholder="Enter Department"
              onChange={(e) => {
                setNewEmp((prev) => ({ ...prev, department: e.target.value }));
              }}
            ></textarea>
            <input
              value={newEmp.salary}
              placeholder="enter Salary"
              onChange={(e) => {
                setNewEmp((prev) => ({ ...prev, salary: e.target.value }));
              }}
            />
          </>
        )}
        <button
          onClick={() => {
            if (isAddingNew && newEmp.name.length > 0) {
              handleAddNew(newEmp);
            }
            setIsAddingNew((prev) => !prev);
          }}
        >
          {isAddingNew
            ? newEmp.name.length > 0
              ? "Save"
              : "cancel"
            : "Add New"}
        </button>
        {!isAddingNew && (
          <>
            <button
              onClick={() => {
                sortEmployeesBy("salary", "asc");
              }}
            >
              Sort by Salary Ascending
            </button>
            <button
              onClick={() => {
                sortEmployeesBy("salary", "desc");
              }}
            >
              Sort by Salary Descending
            </button>
            <button
              onClick={() => {
                filterData("frontend");
              }}
            >
              Filter By Department (Frontend)
            </button>
            <button
              onClick={() => {
                filterData("backend");
              }}
            >
              Filter By Department (Backend)
            </button>
            <button
              onClick={() => {
                const local = localStorage.getItem("employees");
                setEmployees(JSON.parse(local));
              }}
            >
              All Department
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
