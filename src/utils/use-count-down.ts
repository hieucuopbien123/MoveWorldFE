import { useRef, useEffect, useState } from "react";
// import moment from "moment";

const CountdownHook = (toDate: any) => {
  const timer = useRef<any>();
  const [isTimesUp, setTimesUp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [prevDate, setPrevDate] = useState(0);
  
  const tick = () => {
    // setCountdown(Math.max(0, moment(new Date(toDate)).diff(moment())));
    setCountdown(Math.max(0, toDate - new Date().getTime()));
  };
  
  useEffect(() => {
    setTimesUp(countdown <= 0);
  }, [countdown]);
  
  useEffect(() => {
    if (toDate) {
      if (!prevDate || (prevDate && Math.abs(toDate - prevDate) > 15000)) {
        tick();
        timer.current = setInterval(tick, 1000);
        return () => clearInterval(timer.current);
      } else {
        setPrevDate(toDate);
      }
    }
  }, [toDate]);
  
  return [isTimesUp, countdown];
};
export default CountdownHook;
