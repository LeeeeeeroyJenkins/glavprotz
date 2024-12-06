import React, { useEffect, useState } from "react";
import axios from "axios";

const formatDateForMySQL = (date) => {
  const pad = (num) => (num < 10 ? "0" + num : num);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
};

const GlavproData = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
      name,
      value: Number(value),
      created_at: formatDateForMySQL(new Date()),
    };
    setData([...data, newItem]);
    setName("");
    setValue("");
    try {
      await axios.post("/api/glavpro", { name, value });
      fetchData();
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditName(data[index].name);
    setEditValue(data[index].value);
  };

  const handleSave = async (index) => {
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      name: editName,
      value: editValue,
      created_at: formatDateForMySQL(new Date()),
    };
    setData(updatedData);
    setEditIndex(null);

    try {
      await axios.put(`/api/glavpro/${updatedData[index].id}`, {
        name: editName,
        value: editValue,
        created_at: formatDateForMySQL(new Date()),
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/glavpro/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/glavpro");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Glavpro Data</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="new-item"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="number"
          className="new-item"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          required
        />
        <button className="button button-save" type="submit">
          Add
        </button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Value</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    className="new-item"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    className="new-item"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  item.value
                )}
              </td>
              <td>{item.created_at}</td>
              <td>
                {editIndex === index ? (
                  <button
                    className="button button-save"
                    onClick={() => handleSave(index)}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      className="button button-edit"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GlavproData;
