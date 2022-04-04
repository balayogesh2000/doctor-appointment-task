import React, { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { useSetLoader } from "../../context/LoaderContext";
import classes from "./Profile.module.css";
import { getAllBookings, deleteBooking } from "../../api/bookingApi";
import { useAuthContext } from "../../store/auth-context";
import cancelIcon from "../../assets/img/close.png";
import deleteIcon from "../../assets/img/trash.png";
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
          <Table bordered responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor Name</th>
                <th>Patient Name</th>
                <th>Speciality</th>
                <th>Consultation Fee</th>
                <th>Booking Date & time</th>
                <th>Delete Booking</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((item, idx) => {
                return (
                  <tr
                    style={{
                      width: "18rem",
                      background:
                        new Date(item.slot).getTime() < new Date().getTime()
                          ? "lightcoral"
                          : "lightgreen",
                    }}
                  >
                    <td>{idx + 1}</td>
                    <td>{item.doctor?.name}</td>
                    <td>{item.user?.name}</td>
                    <td>{item.doctor?.speciality}</td>
                    <td>{item.doctor?.fee}</td>
                    <td>
                      {new Date(item.slot).toDateString() +
                        " " +
                        formatAMPM(new Date(item.slot))}
                    </td>
                    <td>
                      <img
                        style={{ marginLeft: "20px", cursor: "pointer" }}
                        src={deleteIcon}
                        alt="cancel"
                        onClick={() => cancelHandler(item._id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
