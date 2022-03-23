import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { getAllDoctors } from "../../api/doctorApi";
import { useSetLoader } from "../../context/LoaderContext";

import classes from "./Home.module.css";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const setLoader = useSetLoader();
  useEffect(() => {
    (async () => {
      setLoader(true);
      const doctors = await getAllDoctors();
      setDoctors(doctors.data.doc);
      setLoader(false);
    })();
  }, []);
  const searchHandler = async (e) => {
    setSearch(e.target.value);
    if (e.target.value !== "") {
      const doctors = await getAllDoctors({ name: e.target.value });
      setDoctors(doctors.data.doc);
    } else {
      const doctors = await getAllDoctors();
      setDoctors(doctors.data.doc);
    }
  };
  return (
    <div className={classes.Home}>
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
              <Card.Link href="#">
                <Link to={`/doctor/${item._id}`}>Book now</Link>
              </Card.Link>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
