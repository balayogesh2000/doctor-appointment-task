import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSetLoader } from "../../context/LoaderContext";
import classes from "./Profile.module.css";
import { getAllBookings, deleteBooking } from "../../api/bookingApi";
import { useAuthContext } from "../../store/auth-context";
import cancelIcon from "../../assets/img/close.png";
import showToast from "../../utils/toast";

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

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const setLoader = useSetLoader();
  const authCtx = useAuthContext();

  const fetchBookings = async () => {
    if (authCtx.user._id) {
      setLoader(true);
      let bookings = [];
      if (authCtx.user.role === "user") {
        bookings = await getAllBookings({ user: authCtx.user._id });
      } else {
        bookings = await getAllBookings({ doctor: authCtx.user._id });
      }
      setBookings(bookings.data.data);
      setLoader(false);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchBookings();
    })();
  }, [authCtx.user._id]);
  const cancelHandler = async (id) => {
    try {
      setLoader(true);
      await deleteBooking(id);
      fetchBookings();
    } catch (err) {
      setLoader(false);
      showToast(err.response.data.message);
    }
  };
  return (
    <div className={classes.Profile}>
      <div className="contain">
        <h3>My Appointments</h3>
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
                  <span>
                    {authCtx.user.role === "user"
                      ? item.doctor?.name
                      : item?.user?.name}
                  </span>{" "}
                  <span style={{ color: "green" }}>₹{item.doctor?.fee}</span>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {item.doctor?.speciality}
                </Card.Subtitle>
                <div style={{ color: "#333" }}>
                  {new Date(item.slot).toDateString() +
                    " " +
                    formatAMPM(new Date(item.slot))}
                  <img
                    style={{ marginLeft: "20px", cursor: "pointer" }}
                    src={cancelIcon}
                    alt="cancel"
                    onClick={() => cancelHandler(item._id)}
                  />
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
