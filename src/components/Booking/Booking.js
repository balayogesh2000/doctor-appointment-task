import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Card } from "react-bootstrap";
import { getDoctor } from "../../api/doctorApi";

import classes from "./Booking.module.css";
import { createBooking, getAllBookings, sendMail } from "../../api/bookingApi";
import { getMe } from "../../api/authApi";
import { useSetLoader } from "../../context/LoaderContext";
import Modal from "../Modal/Modal";
import toast from "../../utils/toast";

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

const Booking = () => {
  const params = useParams();
  const [doctor, setDoctor] = useState({});
  const [user, setUser] = useState({});
  const [slots, setSlots] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const setLoader = useSetLoader();
  const [time, setTime] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const generateSlots = (bookings) => {
    const slots = bookings.data.data.map((booking) => {
      let date = new Date(booking.slot).toISOString().split("T")[0];
      let time = tConvert(new Date(booking.slot).toLocaleTimeString());
      time = time.slice(0, 4) + " " + time.slice(7, 9).toLowerCase();
      return { date, time };
    });
    let slotsObj = {};
    slots.forEach((slot) => {
      if (slotsObj[slot.date]) {
        slotsObj[slot.date].push(slot.time);
      } else {
        slotsObj[slot.date] = [slot.time];
      }
    });
    setSlots(slotsObj);
  };
  useEffect(() => {
    (async () => {
      setLoader(true);
      const doc = await getDoctor(params.id);
      setDoctor(doc.data.data.data);
      const user = await getMe();
      setUser(user);
      const bookings = await getAllBookings({
        doctor: doc.data.data.data._id,
      });
      setLoader(false);
      generateSlots(bookings);
    })();
  }, []);

  const bookingHandler = async (slot) => {
    setLoader(true);
    await createBooking({
      doctor: doctor._id,
      user: user._id,
      fee: doctor.fee,
      slot: new Date(
        `${date} ${time.split(" ")[0]}:00 ${time.split(" ")[1].toUpperCase()}`
      ),
      paid: false,
    });
    const bookings = await getAllBookings({
      doctor: doctor._id,
      user: user._id,
    });
    generateSlots(bookings);
    setShow(false);
    if (user.email) {
      await sendMail({
        doctorName: doctor.name,
        doctorSpeciality: doctor.speciality,
        userName: user.name,
        appointmentTime: slot,
      });
      toast(
        `Slot booked successfully and confirmation mail sent to ${user.email} `
      );
    } else {
      toast(`Slot booked successfully`);
    }
    setLoader(false);
  };

  const slotClickHandler = async (time) => {
    setTime(time);
    setShow(true);
  };
  return (
    <div className={classes.Booking}>
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.header}>
            <div>
              <h3>{doctor.name}</h3>
              <p>{doctor.speciality}</p>
            </div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="date"
                placeholder="name@example.com"
                min={new Date().toISOString().split("T")[0]}
                max={
                  new Date(new Date().setDate(new Date().getDate() + 5))
                    .toISOString()
                    .split("T")[0]
                }
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className={classes.timeSlot}>
            {["5:00 pm", "5:15 pm", "5:30 pm", "5:45 pm", "6:00 pm"].map(
              (item) => {
                const isBooked = slots[date]?.includes(item);
                const isExpired =
                  new Date().getTime() >
                  new Date(
                    `${date} ${item.split(" ")[0]}:00 ${item
                      .split(" ")[1]
                      .toUpperCase()}`
                  );
                return isBooked || isExpired ? (
                  <div
                    style={{
                      background: "lightcoral",
                    }}
                  >
                    {item}
                  </div>
                ) : (
                  <div
                    onClick={() => slotClickHandler(item)}
                    style={{
                      background: "lightgreen",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
      <Modal
        show={show}
        setShow={setShow}
        title="Booking Confirmation"
        save="Book"
        cancel="Cancel"
        onSave={() =>
          bookingHandler(new Date(date).toDateString() + " " + time)
        }
      >
        <div>
          <p>Doctor : {doctor.name}</p>
          <p>speciality : {doctor.speciality}</p>
          <p>Patient: {user.name}</p>
          <p>
            Appointment Date & time : {new Date(date).toDateString()} {time}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;
