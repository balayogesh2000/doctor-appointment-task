import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { getAllDoctors } from "../../api/doctorApi";
import { useSetLoader } from "../../context/LoaderContext";

import classes from "./Home.module.css";
import { useAuthContext } from "../../store/auth-context";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const setLoader = useSetLoader();
  const [speciality, setSpeciality] = useState("");
  const authCtx = useAuthContext();

  const fetchDoctors = async () => {
    setLoader(true);
    const params = {};
    if (search) params.name = search;
    if (speciality) params.speciality = speciality;
    const doctors = await getAllDoctors(params);
    setDoctors(doctors.data.data);
    setLoader(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [speciality, search]);

  const resetHandler = () => {
    setSearch("");
    setSpeciality("");
  };

  return (
    <>
      {authCtx?.user?.role === "doctor" && <Navigate to="/profile" replace />}
      {authCtx?.user?.role === "admin" && <Navigate to="/admin" replace />}
      <div className={classes.Home}>
        <div className={classes.container}>
          <input
            className={classes.searchInput + " form-control"}
            type="text"
            placeholder="Search doctors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={"form-select"}
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
          >
            <option value="" hidden>
              select speciality
            </option>
            <option value="Gynaecology">Gynaecology</option>
            <option value="Sexology">Sexology</option>
            <option value="General physician">General physician</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="Stomach and digestion">Stomach and digestion</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
          <Button onClick={resetHandler}>Reset</Button>
        </div>
        <div className={classes.doctorList}>
          {doctors.map((item) => (
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {item.speciality}
                </Card.Subtitle>
                <Card.Link href="#">
                  <Link to={`/doctor/${item._id}`}>Book now</Link>
                </Card.Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
