import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, InputGroup } from "react-bootstrap";
import { getAllDoctors, getDoctor, updateDoctor } from "../../api/doctorApi";
import { useSetLoader } from "../../context/LoaderContext";
import { createDoctor, deleteDoctor } from "../../api/doctorApi";
import toast from "../../utils/toast";
import deleteIcon from "../../assets/img/trash.png";
import editIcon from "../../assets/img/edit.png";
import Modal from "../Modal/Modal";

import classes from "./Home.module.css";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [search, setSearch] = useState("");
  const setLoader = useSetLoader();
  const [name, setName] = useState("");
  const [fee, setFee] = useState("500");
  const [speciality, setSpeciality] = useState("Gynaecology");
  const [id, setId] = useState("");
  const [doctor, setDoctor] = useState({});
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const fetchDoctors = async () => {
    setLoader(true);
    const doctors = await getAllDoctors();
    setDoctors(doctors.data.data);
    setLoader(false);
  };

  useEffect(() => {
    (async () => {
      await fetchDoctors();
    })();
  }, []);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoader(true);
      await createDoctor({
        name,
        email,
        password,
        passwordConfirm: password,
        speciality,
        fee,
        role: "doctor",
      });
      setLoader(false);
      setName("");
      setFee("500");
      setSpeciality("Gynaecology");
      toast("Doctor added successfully");
      fetchDoctors();
    } catch (err) {
      toast(err.response.data.message, true);
      setLoader(false);
    }
  };

  const searchHandler = async (e) => {
    setSearch(e.target.value);
    if (e.target.value !== "") {
      const doctors = await getAllDoctors({ name: e.target.value });
      setDoctors(doctors.data.data);
    } else {
      const doctors = await getAllDoctors();
      setDoctors(doctors.data.data);
    }
  };
  const deleteHandler = async () => {
    setLoader(true);
    await deleteDoctor(id);
    toast("Succesfully deleted");
    setLoader(false);
    setShow(false);
    fetchDoctors();
  };
  const editHandler = async (params) => {
    setLoader(true);
    console.log(doctor);
    await updateDoctor(id, doctor);
    toast("Succesfully updated");
    setLoader(false);
    setEditShow(false);
    fetchDoctors();
  };
  const deleteClickHandler = (id) => {
    setId(id);
    setShow(true);
  };
  const editClickHandler = async (id) => {
    setId(id);
    const doctor = await getDoctor(id);
    console.log(doctor.data.data.data);
    setDoctor(doctor.data.data.data);
    setEditShow(true);
  };
  return (
    <div className={classes.Home}>
      <div className={classes.addSection}>
        <h5>Add Doctor information</h5>
        <form className={classes.addForm} onSubmit={submitHandler}>
          <input
            className={"form-control"}
            type="text"
            placeholder="Doctor name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="form-control"
            id="EmailInput"
            name="EmailInput"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <input
            className={"form-control"}
            type="number"
            placeholder="Enter the fee"
            min="0"
            defaultValue="500"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            required
          />
          <select
            className={"form-select"}
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            required
          >
            <option value="Gynaecology">Gynaecology</option>
            <option value="Sexology">Sexology</option>
            <option value="General physician">General physician</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="Stomach and digestion">Stomach and digestion</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
          <Button type="submit">Submit</Button>
        </form>
      </div>
      <div className={classes.container}>
        <div className={classes.searchBar}>
          <input
            className={classes.searchInput + " form-control"}
            type="text"
            placeholder="Search doctors"
            value={search}
            onChange={searchHandler}
          />
        </div>
      </div>
      <div className={classes.doctorList}>
        {doctors.map((item) => (
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {item.speciality}
              </Card.Subtitle>
              <div className={classes.edit}>
                <img
                  src={editIcon}
                  alt="edit"
                  onClick={() => editClickHandler(item._id)}
                />
                <img
                  src={deleteIcon}
                  alt="trash"
                  onClick={() => deleteClickHandler(item._id)}
                />
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
      <Modal
        show={show}
        setShow={setShow}
        title="Delete Confirmation"
        save="Yes"
        cancel="No"
        onSave={deleteHandler}
      >
        Are you sure you want to delete?
      </Modal>
      <Modal
        show={editShow}
        setShow={setEditShow}
        title="Update Doctor information"
        save={null}
        cancel={null}
        onSave={editHandler}
      >
        <form className={classes.modalForm} onSubmit={editHandler}>
          <input
            className={"form-control"}
            type="text"
            placeholder="Doctor name"
            value={doctor.name}
            onChange={(e) =>
              setDoctor((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <input
            className={"form-control"}
            type="number"
            placeholder="Enter the fee"
            min="0"
            defaultValue="500"
            value={doctor.fee}
            onChange={(e) =>
              setDoctor((prev) => ({ ...prev, fee: e.target.value }))
            }
            required
          />
          <select
            className={"form-select"}
            value={doctor.speciality}
            onChange={(e) =>
              setDoctor((prev) => ({ ...prev, speciality: e.target.value }))
            }
            required
          >
            <option value="Gynaecology">Gynaecology</option>
            <option value="Sexology">Sexology</option>
            <option value="General physician">General physician</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="Stomach and digestion">Stomach and digestion</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
          <Button
            onClick={() => setShow(false)}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
