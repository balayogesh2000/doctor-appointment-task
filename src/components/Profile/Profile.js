import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

import classes from "./Profile.module.css";
import { getAllBookings } from "../../api/bookingApi";

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const Profile = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    (async () => {
      const bookings = await getAllBookings({ user: user._id });
      setBookings(bookings.data.data);
      console.log(bookings.data.data);
    })();
  }, []);
  return (
    <div className={classes.Profile}>
      <div className="contain">
        <h3>My Bookings </h3>
        <div className={classes.doctorList}>
          {bookings.map((item) => (
            <Card
              style={{
                width: "18rem",
                background:
                  new Date(item.slot).getTime() < new Date().getTime()
                    ? "lightcoral"
                    : "lightgreen",
              }}
            >
              <Card.Body>
                <Card.Title
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{item.doctor.name}</span>{" "}
                  <span style={{ color: "green" }}>₹{item.doctor.fee}</span>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {item.doctor.speciality}
                </Card.Subtitle>
                <div style={{ color: "#333" }}>
                  {new Date(item.slot).toDateString() +
                    " " +
                    formatAMPM(new Date(item.slot))}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
